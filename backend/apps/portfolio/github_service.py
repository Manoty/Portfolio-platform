# =============================================================================
# GITHUB SERVICE — All GitHub API interactions isolated here
# Uses the public GitHub REST API v3 (no auth required for public repos)
# Rate limit: 60 requests/hour unauthenticated
# =============================================================================
import logging
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

import requests

logger = logging.getLogger(__name__)

GITHUB_API_BASE  = "https://api.github.com"
REQUEST_TIMEOUT  = 10  # seconds
MAX_REPOS        = 100 # max repos to fetch per request (GitHub max is 100)


# ---------------------------------------------------------------------------
# Data classes — typed representation of GitHub responses
# ---------------------------------------------------------------------------

@dataclass
class GitHubRepository:
    """Typed representation of a single GitHub repository."""
    id:           int
    name:         str
    full_name:    str
    description:  Optional[str]
    html_url:     str
    language:     Optional[str]
    topics:       list[str]
    updated_at:   str
    pushed_at:    str
    stargazers_count: int
    forks_count:  int
    is_fork:      bool
    is_archived:  bool
    is_private:   bool
    already_imported: bool = False

    @classmethod
    def from_api_response(cls, data: dict) -> "GitHubRepository":
        return cls(
            id=data["id"],
            name=data["name"],
            full_name=data["full_name"],
            description=data.get("description") or "",
            html_url=data["html_url"],
            language=data.get("language"),
            topics=data.get("topics") or [],
            updated_at=data.get("updated_at", ""),
            pushed_at=data.get("pushed_at", ""),
            stargazers_count=data.get("stargazers_count", 0),
            forks_count=data.get("forks_count", 0),
            is_fork=data.get("fork", False),
            is_archived=data.get("archived", False),
            is_private=data.get("private", False),
        )

    def to_dict(self) -> dict:
        return {
            "id":               self.id,
            "name":             self.name,
            "full_name":        self.full_name,
            "description":      self.description,
            "html_url":         self.html_url,
            "language":         self.language,
            "topics":           self.topics,
            "updated_at":       self.updated_at,
            "pushed_at":        self.pushed_at,
            "stargazers_count": self.stargazers_count,
            "forks_count":      self.forks_count,
            "is_fork":          self.is_fork,
            "is_archived":      self.is_archived,
            "already_imported": self.already_imported,
        }


@dataclass
class GitHubServiceResult:
    """Wrapper for service results — always has a success flag + data or error."""
    success:       bool
    data:          list[dict] = field(default_factory=list)
    error_code:    str        = ""
    error_message: str        = ""

    @classmethod
    def ok(cls, data: list[dict]) -> "GitHubServiceResult":
        return cls(success=True, data=data)

    @classmethod
    def error(cls, code: str, message: str) -> "GitHubServiceResult":
        return cls(success=False, error_code=code, error_message=message)


# ---------------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------------

def validate_github_username(username: str) -> tuple[bool, str]:
    """
    Check if a GitHub username exists via the users endpoint.
    Returns (is_valid: bool, error_message: str).
    """
    if not username or not username.strip():
        return False, "Username cannot be empty."

    username = username.strip()

    # Basic format validation before hitting the API
    import re
    if not re.match(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$", username):
        return False, "Invalid GitHub username format."

    try:
        response = requests.get(
            f"{GITHUB_API_BASE}/users/{username}",
            headers=_get_headers(),
            timeout=REQUEST_TIMEOUT,
        )
    except requests.Timeout:
        return False, "GitHub API timed out. Please try again."
    except requests.ConnectionError:
        return False, "Could not reach GitHub API. Check your connection."

    if response.status_code == 200:
        return True, ""
    elif response.status_code == 404:
        return False, f"GitHub user '{username}' does not exist."
    elif response.status_code == 403:
        return False, "GitHub API rate limit exceeded. Try again in an hour."
    else:
        return False, f"GitHub API returned an unexpected status: {response.status_code}."


def fetch_repositories(username: str) -> GitHubServiceResult:
    """
    Fetch all public repositories for a GitHub username.
    Marks repos that are already imported.
    Returns a GitHubServiceResult.
    """
    if not username:
        return GitHubServiceResult.error(
            "NO_USERNAME",
            "No GitHub username configured. Set it in Site Settings.",
        )

    try:
        response = requests.get(
            f"{GITHUB_API_BASE}/users/{username}/repos",
            headers=_get_headers(),
            params={
                "type":      "owner",
                "sort":      "pushed",
                "direction": "desc",
                "per_page":  MAX_REPOS,
            },
            timeout=REQUEST_TIMEOUT,
        )
    except requests.Timeout:
        return GitHubServiceResult.error(
            "TIMEOUT",
            "GitHub API timed out. Please try again in a moment.",
        )
    except requests.ConnectionError:
        return GitHubServiceResult.error(
            "CONNECTION_ERROR",
            "Could not reach GitHub API. Check your server's internet connection.",
        )
    except Exception as exc:
        logger.exception("Unexpected error fetching GitHub repositories: %s", exc)
        return GitHubServiceResult.error(
            "UNEXPECTED_ERROR",
            "An unexpected error occurred. Check server logs.",
        )

    # Handle HTTP error responses
    if response.status_code == 404:
        return GitHubServiceResult.error(
            "USER_NOT_FOUND",
            f"GitHub user '{username}' not found. Update your GitHub username in Site Settings.",
        )
    if response.status_code == 403:
        reset_time = response.headers.get("X-RateLimit-Reset", "")
        return GitHubServiceResult.error(
            "RATE_LIMITED",
            f"GitHub API rate limit exceeded. Resets at: {reset_time}. "
            "Authenticated requests have higher limits — consider adding a token.",
        )
    if response.status_code != 200:
        return GitHubServiceResult.error(
            "API_ERROR",
            f"GitHub API returned status {response.status_code}.",
        )

    repos_raw = response.json()
    if not isinstance(repos_raw, list):
        return GitHubServiceResult.error(
            "INVALID_RESPONSE",
            "GitHub API returned an unexpected response format.",
        )

    if not repos_raw:
        return GitHubServiceResult.ok([])

    # Parse into typed objects
    repos = [GitHubRepository.from_api_response(r) for r in repos_raw]

    # Mark already-imported repos
    repos = _mark_imported(repos)

    # Convert to dicts for serialization
    return GitHubServiceResult.ok([r.to_dict() for r in repos])


def import_repositories(repo_ids: list[int], username: str) -> dict:
    """
    Import selected GitHub repositories as draft Project records.

    Returns:
        {
            "imported": [{"id": uuid, "title": str, "slug": str}, ...],
            "skipped":  [{"repo_id": int, "name": str, "reason": str}, ...],
            "errors":   [{"repo_id": int, "reason": str}, ...],
        }
    """
    from .models import Project, Technology

    if not repo_ids:
        return {"imported": [], "skipped": [], "errors": []}

    # Fetch current state of repos to get metadata
    result = fetch_repositories(username)
    if not result.success:
        return {
            "imported": [],
            "skipped": [],
            "errors": [{"repo_id": rid, "reason": result.error_message} for rid in repo_ids],
        }

    # Build lookup by repo ID
    repo_map = {r["id"]: r for r in result.data}

    imported = []
    skipped  = []
    errors   = []

    for repo_id in repo_ids:
        repo = repo_map.get(repo_id)

        if not repo:
            errors.append({
                "repo_id": repo_id,
                "reason":  "Repository not found in current fetch. It may have been deleted or made private.",
            })
            continue

        # Duplicate protection
        if repo["already_imported"]:
            skipped.append({
                "repo_id": repo_id,
                "name":    repo["name"],
                "reason":  "Already imported.",
            })
            continue

        try:
            project = _create_project_from_repo(repo)
            imported.append({
                "id":    str(project.pk),
                "title": project.title,
                "slug":  project.slug,
            })
        except Exception as exc:
            logger.exception(
                "Failed to import repository %s (id=%s): %s",
                repo.get("name"), repo_id, exc,
            )
            errors.append({
                "repo_id": repo_id,
                "name":    repo.get("name", ""),
                "reason":  str(exc),
            })

    return {"imported": imported, "skipped": skipped, "errors": errors}


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _get_headers() -> dict:
    """Build request headers. Adds auth token if configured."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    # Optional: support GITHUB_TOKEN env var for higher rate limits
    import os
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _mark_imported(repos: list[GitHubRepository]) -> list[GitHubRepository]:
    """Set already_imported=True on repos whose github_repo_id is in the DB."""
    from .models import Project

    existing_ids = set(
        Project.objects.filter(
            github_repo_id__isnull=False
        ).values_list("github_repo_id", flat=True)
    )

    for repo in repos:
        repo.already_imported = repo.id in existing_ids

    return repos


def _create_project_from_repo(repo: dict) -> "Project":
    """
    Create a draft Project from a GitHub repository dict.
    Maps GitHub metadata to Project fields.
    """
    from .models import Project, Technology

    # Resolve technology from primary language (case-insensitive exact match)
    technology = None
    if repo.get("language"):
        technology = Technology.objects.filter(
            name__iexact=repo["language"]
        ).first()

    # Build a clean title from repo name (underscores → spaces, title case)
    title = repo["name"].replace("-", " ").replace("_", " ").title()

    # Build description
    description = repo.get("description") or f"Repository: {repo['name']}"
    if repo.get("topics"):
        description += f"\n\nTopics: {', '.join(repo['topics'])}"

    project = Project.objects.create(
        title=title,
        summary=(repo.get("description") or f"Imported from GitHub: {repo['name']}")[:500],
        description=description,
        github_url=repo["html_url"],
        status=Project.Status.DRAFT,
        is_featured=False,
        category=Project.Category.FULL_STACK,  # sensible default; user can edit
        github_repo_id=repo["id"],
    )

    if technology:
        project.technologies.add(technology)

    return project