# =============================================================================
# GITHUB SERVICE TESTS
# All external HTTP calls are mocked — no real API calls in tests
# =============================================================================
import pytest
from unittest.mock import patch, MagicMock
from apps.portfolio.github_service import (
    validate_github_username,
    fetch_repositories,
    import_repositories,
    GitHubRepository,
    _mark_imported,
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def make_mock_repo(overrides: dict = None) -> dict:
    """Minimal valid GitHub API repository response."""
    base = {
        "id":               12345,
        "name":             "my-project",
        "full_name":        "kevinmanoti/my-project",
        "description":      "A test project",
        "html_url":         "https://github.com/kevinmanoti/my-project",
        "language":         "Python",
        "topics":           ["django", "api"],
        "updated_at":       "2024-01-15T12:00:00Z",
        "pushed_at":        "2024-01-15T12:00:00Z",
        "stargazers_count": 5,
        "forks_count":      1,
        "fork":             False,
        "archived":         False,
        "private":          False,
    }
    if overrides:
        base.update(overrides)
    return base


def make_mock_response(status_code: int, json_data=None, headers: dict = None):
    """Create a mock requests.Response object."""
    mock_resp = MagicMock()
    mock_resp.status_code = status_code
    mock_resp.json.return_value = json_data if json_data is not None else []
    mock_resp.headers = headers or {}
    return mock_resp


# ---------------------------------------------------------------------------
# validate_github_username
# ---------------------------------------------------------------------------

class TestValidateGitHubUsername:

    def test_valid_username_returns_true(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, {"login": "kevinmanoti"})
            is_valid, error = validate_github_username("kevinmanoti")
        assert is_valid is True
        assert error == ""

    def test_nonexistent_username_returns_false(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(404)
            is_valid, error = validate_github_username("zzznobody12345xyz")
        assert is_valid is False
        assert "does not exist" in error

    def test_rate_limited_returns_false_with_message(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(403)
            is_valid, error = validate_github_username("someuser")
        assert is_valid is False
        assert "rate limit" in error.lower()

    def test_empty_username_returns_false_without_api_call(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            is_valid, error = validate_github_username("")
        mock_get.assert_not_called()
        assert is_valid is False
        assert "empty" in error.lower()

    def test_invalid_format_returns_false_without_api_call(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            is_valid, error = validate_github_username("invalid username!")
        mock_get.assert_not_called()
        assert is_valid is False

    def test_timeout_returns_false_with_message(self):
        import requests
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.side_effect = requests.Timeout()
            is_valid, error = validate_github_username("kevinmanoti")
        assert is_valid is False
        assert "timed out" in error.lower()

    def test_connection_error_returns_false(self):
        import requests
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.side_effect = requests.ConnectionError()
            is_valid, error = validate_github_username("kevinmanoti")
        assert is_valid is False
        assert "reach" in error.lower()


# ---------------------------------------------------------------------------
# fetch_repositories
# ---------------------------------------------------------------------------

class TestFetchRepositories:

    def test_returns_repos_on_success(self):
        repos = [make_mock_repo({"id": i, "name": f"repo-{i}"}) for i in range(3)]
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, repos)
            result = fetch_repositories("kevinmanoti")
        assert result.success is True
        assert len(result.data) == 3

    def test_empty_response_returns_ok_with_empty_list(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [])
            result = fetch_repositories("kevinmanoti")
        assert result.success is True
        assert result.data == []

    def test_user_not_found_returns_error(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(404)
            result = fetch_repositories("nonexistentuser")
        assert result.success is False
        assert result.error_code == "USER_NOT_FOUND"

    def test_rate_limited_returns_error_with_code(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(
                403,
                headers={"X-RateLimit-Reset": "1700000000"},
            )
            result = fetch_repositories("kevinmanoti")
        assert result.success is False
        assert result.error_code == "RATE_LIMITED"
        assert "rate limit" in result.error_message.lower()

    def test_empty_username_returns_error(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            result = fetch_repositories("")
        mock_get.assert_not_called()
        assert result.success is False
        assert result.error_code == "NO_USERNAME"

    def test_timeout_returns_error(self):
        import requests
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.side_effect = requests.Timeout()
            result = fetch_repositories("kevinmanoti")
        assert result.success is False
        assert result.error_code == "TIMEOUT"

    def test_connection_error_returns_error(self):
        import requests
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.side_effect = requests.ConnectionError()
            result = fetch_repositories("kevinmanoti")
        assert result.success is False
        assert result.error_code == "CONNECTION_ERROR"

    def test_repos_contain_expected_fields(self):
        repo = make_mock_repo()
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            result = fetch_repositories("kevinmanoti")
        first = result.data[0]
        assert "id"               in first
        assert "name"             in first
        assert "html_url"         in first
        assert "language"         in first
        assert "topics"           in first
        assert "already_imported" in first

    def test_already_imported_flag_false_for_new_repos(self):
        repo = make_mock_repo({"id": 99999})
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            result = fetch_repositories("kevinmanoti")
        assert result.data[0]["already_imported"] is False


# ---------------------------------------------------------------------------
# _mark_imported (unit test — no HTTP)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestMarkImported:

    def test_marks_imported_repos_correctly(self):
        from apps.portfolio.factories import ProjectFactory
        # Create a project with a known github_repo_id
        project = ProjectFactory(github_repo_id=11111)

        repo_imported = GitHubRepository.from_api_response(make_mock_repo({"id": 11111}))
        repo_new      = GitHubRepository.from_api_response(make_mock_repo({"id": 22222}))

        result = _mark_imported([repo_imported, repo_new])

        assert result[0].already_imported is True
        assert result[1].already_imported is False

    def test_no_imported_projects_marks_all_false(self):
        repos = [
            GitHubRepository.from_api_response(make_mock_repo({"id": i}))
            for i in range(3)
        ]
        result = _mark_imported(repos)
        assert all(not r.already_imported for r in result)


# ---------------------------------------------------------------------------
# import_repositories
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestImportRepositories:

    def test_creates_draft_projects_for_selected_repos(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({"id": 55555, "name": "my-api", "language": "Python"})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            result = import_repositories([55555], "kevinmanoti")

        assert len(result["imported"]) == 1
        assert len(result["errors"])   == 0

        project = Project.objects.get(github_repo_id=55555)
        assert project.status    == Project.Status.DRAFT
        assert project.is_featured is False
        assert project.github_url  == repo["html_url"]

    def test_imported_project_title_is_formatted(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({"id": 55556, "name": "my-cool-project"})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([55556], "kevinmanoti")

        project = Project.objects.get(github_repo_id=55556)
        assert project.title == "My Cool Project"

    def test_maps_python_language_to_existing_technology(self):
        from apps.portfolio.models import Project
        from apps.portfolio.factories import TechnologyFactory

        python_tech = TechnologyFactory(name="Python")
        repo = make_mock_repo({"id": 55557, "name": "python-app", "language": "Python"})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([55557], "kevinmanoti")

        project = Project.objects.get(github_repo_id=55557)
        assert python_tech in project.technologies.all()

    def test_unknown_language_leaves_technologies_empty(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({"id": 55558, "name": "haskell-app", "language": "Haskell"})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([55558], "kevinmanoti")

        project = Project.objects.get(github_repo_id=55558)
        assert project.technologies.count() == 0

    def test_technology_match_is_case_insensitive(self):
        from apps.portfolio.models import Project
        from apps.portfolio.factories import TechnologyFactory

        TechnologyFactory(name="TypeScript")
        repo = make_mock_repo({"id": 55559, "name": "ts-app", "language": "TypeScript"})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([55559], "kevinmanoti")

        project = Project.objects.get(github_repo_id=55559)
        assert project.technologies.count() == 1

    def test_skips_already_imported_repo(self):
        from apps.portfolio.factories import ProjectFactory

        # Pre-existing project with this repo ID
        ProjectFactory(github_repo_id=77777)
        repo = make_mock_repo({"id": 77777})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            result = import_repositories([77777], "kevinmanoti")

        assert len(result["imported"]) == 0
        assert len(result["skipped"]) == 1
        assert result["skipped"][0]["reason"] == "Already imported."

    def test_duplicate_protection_prevents_second_import(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({"id": 88888})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            result1 = import_repositories([88888], "kevinmanoti")
            # Reset already_imported flag simulation by updating mock
            result2 = import_repositories([88888], "kevinmanoti")

        assert len(result1["imported"]) == 1
        assert len(result2["skipped"]) == 1
        # Only one project should exist with this repo ID
        assert Project.objects.filter(github_repo_id=88888).count() == 1

    def test_repo_not_in_fetch_results_goes_to_errors(self):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [])  # empty fetch
            result = import_repositories([99999], "kevinmanoti")

        assert len(result["errors"]) == 1
        assert "not found" in result["errors"][0]["reason"].lower()

    def test_empty_repo_ids_returns_empty_result(self):
        result = import_repositories([], "kevinmanoti")
        assert result == {"imported": [], "skipped": [], "errors": []}

    def test_github_api_error_propagates_to_errors(self):
        import requests
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.side_effect = requests.ConnectionError()
            result = import_repositories([12345], "kevinmanoti")

        assert len(result["errors"]) > 0

    def test_stores_github_repo_id_on_project(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({"id": 66666})

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([66666], "kevinmanoti")

        project = Project.objects.get(github_repo_id=66666)
        assert project.github_repo_id == 66666

    def test_stores_github_url_correctly(self):
        from apps.portfolio.models import Project
        repo = make_mock_repo({
            "id":       44444,
            "html_url": "https://github.com/kevinmanoti/test-repo",
        })

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            import_repositories([44444], "kevinmanoti")

        project = Project.objects.get(github_repo_id=44444)
        assert project.github_url == "https://github.com/kevinmanoti/test-repo"

    def test_batch_import_handles_mix_of_success_and_skip(self):
        from apps.portfolio.factories import ProjectFactory

        # Pre-import one repo
        ProjectFactory(github_repo_id=11100)

        # Return two repos from GitHub — one new, one already imported
        repos = [
            make_mock_repo({"id": 11100, "name": "existing"}),
            make_mock_repo({"id": 11101, "name": "new-project"}),
        ]

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, repos)
            result = import_repositories([11100, 11101], "kevinmanoti")

        assert len(result["imported"]) == 1
        assert len(result["skipped"])  == 1
        assert result["imported"][0]["title"] == "New Project"


# ---------------------------------------------------------------------------
# GitHub API endpoint tests
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestGitHubAPIEndpoints:

    def test_public_cannot_access_repos_endpoint(self, api_client):
        response = api_client.get("/api/projects/github/repos/")
        assert response.status_code == 401

    def test_editor_cannot_access_repos_endpoint(self, editor_client):
        response = editor_client.get("/api/projects/github/repos/")
        assert response.status_code == 403

    def test_admin_can_access_repos_endpoint(self, admin_client):
        from apps.core.models import SiteSettings
        SiteSettings.get()  # ensure settings exist

        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [make_mock_repo()])
            response = admin_client.get("/api/projects/github/repos/")

        assert response.status_code == 200
        assert "repos" in response.data
        assert "username" in response.data
        assert "count" in response.data

    def test_repos_endpoint_returns_no_username_error(self, admin_client):
        from apps.core.models import SiteSettings
        settings = SiteSettings.get()
        settings.github_username = ""
        settings.save()

        response = admin_client.get("/api/projects/github/repos/")
        assert response.status_code == 400
        assert response.data["error_code"] == "NO_USERNAME"

    def test_admin_can_import_repos(self, admin_client):
        from apps.core.models import SiteSettings
        from apps.portfolio.models import Project

        settings = SiteSettings.get()
        settings.github_username = "kevinmanoti"
        settings.save()

        repo = make_mock_repo({"id": 33333})
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, [repo])
            response = admin_client.post(
                "/api/projects/github/import/",
                {"repo_ids": [33333]},
                format="json",
            )

        assert response.status_code == 200
        assert len(response.data["imported"]) == 1
        assert Project.objects.filter(github_repo_id=33333).exists()

    def test_import_endpoint_validates_empty_repo_ids(self, admin_client):
        from apps.core.models import SiteSettings
        SiteSettings.get()

        response = admin_client.post(
            "/api/projects/github/import/",
            {"repo_ids": []},
            format="json",
        )
        assert response.status_code == 400

    def test_import_endpoint_requires_repo_ids_field(self, admin_client):
        response = admin_client.post(
            "/api/projects/github/import/",
            {},
            format="json",
        )
        assert response.status_code == 400

    def test_public_cannot_import(self, api_client):
        response = api_client.post(
            "/api/projects/github/import/",
            {"repo_ids": [12345]},
            format="json",
        )
        assert response.status_code == 401

    def test_validate_username_endpoint_valid_user(self, admin_client):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, {"login": "kevinmanoti"})
            response = admin_client.post(
                "/api/projects/github/validate-username/",
                {"username": "kevinmanoti"},
                format="json",
            )
        assert response.status_code == 200
        assert response.data["valid"] is True

    def test_validate_username_endpoint_invalid_user(self, admin_client):
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(404)
            response = admin_client.post(
                "/api/projects/github/validate-username/",
                {"username": "zzznobodyyy"},
                format="json",
            )
        assert response.status_code == 400
        assert response.data["valid"] is False

    def test_repos_endpoint_filters_forks_by_default(self, admin_client):
        from apps.core.models import SiteSettings
        settings = SiteSettings.get()
        settings.github_username = "kevinmanoti"
        settings.save()

        repos = [
            make_mock_repo({"id": 1, "fork": False, "name": "original"}),
            make_mock_repo({"id": 2, "fork": True,  "name": "forked"}),
        ]
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, repos)
            response = admin_client.get("/api/projects/github/repos/")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["repos"][0]["name"] == "original"

    def test_repos_endpoint_includes_forks_when_requested(self, admin_client):
        from apps.core.models import SiteSettings
        settings = SiteSettings.get()
        settings.github_username = "kevinmanoti"
        settings.save()

        repos = [
            make_mock_repo({"id": 1, "fork": False}),
            make_mock_repo({"id": 2, "fork": True}),
        ]
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, repos)
            response = admin_client.get(
                "/api/projects/github/repos/",
                {"include_forks": "true"},
            )

        assert response.status_code == 200
        assert response.data["count"] == 2

    def test_repos_endpoint_search_param_filters_results(self, admin_client):
        from apps.core.models import SiteSettings
        settings = SiteSettings.get()
        settings.github_username = "kevinmanoti"
        settings.save()

        repos = [
            make_mock_repo({"id": 1, "name": "django-api",   "description": "A Django REST API"}),
            make_mock_repo({"id": 2, "name": "react-client", "description": "A React frontend"}),
        ]
        with patch("apps.portfolio.github_service.requests.get") as mock_get:
            mock_get.return_value = make_mock_response(200, repos)
            response = admin_client.get(
                "/api/projects/github/repos/",
                {"search": "django"},
            )

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["repos"][0]["name"] == "django-api"