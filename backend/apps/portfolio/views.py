# =============================================================================
# PORTFOLIO — Views
# =============================================================================
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Project, Technology, ProjectImage, Skill, Experience
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    TechnologySerializer, ProjectImageSerializer,
    SkillSerializer, ExperienceSerializer,
)
from apps.accounts.permissions import IsAdminOrEditorOrReadOnly, IsAdminRole
from . import services


class ProjectListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        search     = request.query_params.get("search")
        technology = request.query_params.get("technology")
        category   = request.query_params.get("category")   # ← NEW
        ordering   = request.query_params.get("ordering", "latest")
        show_all   = request.query_params.get("all")

        if show_all and request.user.is_authenticated:
            qs = Project.objects.prefetch_related(
                "technologies", "images"
            ).order_by("-created_at")
        else:
            qs = services.get_published_projects(
                search=search,
                technology_slug=technology,
                category=category,          # ← NEW
                ordering=ordering,
            )

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = ProjectListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        self.check_permissions(request)
        serializer = ProjectDetailSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self, slug):
        return get_object_or_404(Project, slug=slug)

    def get(self, request, slug):
        project = self.get_object(slug)
        services.increment_project_view(project.pk)
        serializer = ProjectDetailSerializer(project, context={"request": request})
        related = services.get_related_projects(project)
        related_data = ProjectListSerializer(
            related, many=True, context={"request": request}
        ).data
        return Response({**serializer.data, "related_projects": related_data})

    def patch(self, request, slug):
        project = self.get_object(slug)
        serializer = ProjectDetailSerializer(
            project, data=request.data, partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, slug):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        self.get_object(slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectImageView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        serializer = ProjectImageSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(project=project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, slug, image_id):
        image = get_object_or_404(ProjectImage, pk=image_id, project__slug=slug)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TechnologyListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        return Response(
            TechnologySerializer(Technology.objects.all(), many=True).data
        )

    def post(self, request):
        serializer = TechnologySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class TechnologyDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def patch(self, request, pk):
        tech = get_object_or_404(Technology, pk=pk)
        serializer = TechnologySerializer(tech, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        get_object_or_404(Technology, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    


class SkillListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        return Response(
            SkillSerializer(Skill.objects.all(), many=True).data
        )

    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SkillDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def patch(self, request, pk):
        skill = get_object_or_404(Skill, pk=pk)
        serializer = SkillSerializer(skill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        get_object_or_404(Skill, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExperienceListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        return Response(
            ExperienceSerializer(Experience.objects.all(), many=True).data
        )

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ExperienceDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def patch(self, request, pk):
        exp = get_object_or_404(Experience, pk=pk)
        serializer = ExperienceSerializer(exp, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        get_object_or_404(Experience, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# =============================================================================
# GITHUB IMPORT VIEWS
# =============================================================================
from apps.core.models import SiteSettings
from . import github_service
from .serializers import GitHubImportSerializer, GitHubUsernameValidateSerializer


class GitHubValidateUsernameView(APIView):
    """
    POST /api/projects/github/validate-username/
    Validate a GitHub username before saving.
    Admin only.
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = GitHubUsernameValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"].strip()
        is_valid, error_message = github_service.validate_github_username(username)

        if is_valid:
            return Response({
                "valid":    True,
                "username": username,
                "message":  f"✓ GitHub user '{username}' found.",
            })
        else:
            return Response({
                "valid":         False,
                "username":      username,
                "error_message": error_message,
            }, status=status.HTTP_400_BAD_REQUEST)


class GitHubReposView(APIView):
    """
    GET /api/projects/github/repos/
    Fetch repositories for the configured GitHub username.
    Admin only.

    Optional query params:
        ?username=override  — use a different username than the saved one
        ?include_forks=true — include forked repositories (excluded by default)
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        # Use override username from query params, or fall back to saved setting
        username = request.query_params.get("username", "").strip()
        if not username:
            settings = SiteSettings.get()
            username = settings.github_username.strip()

        if not username:
            return Response(
                {
                    "error_code":    "NO_USERNAME",
                    "error_message": "No GitHub username configured. Set it in Site Settings.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = github_service.fetch_repositories(username)

        if not result.success:
            return Response(
                {
                    "error_code":    result.error_code,
                    "error_message": result.error_message,
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Filter out forks unless explicitly requested
        include_forks = request.query_params.get("include_forks", "false").lower() == "true"
        repos = result.data
        if not include_forks:
            repos = [r for r in repos if not r["is_fork"]]

        # Apply search filter if provided
        search = request.query_params.get("search", "").lower().strip()
        if search:
            repos = [
                r for r in repos
                if search in r["name"].lower()
                or search in (r.get("description") or "").lower()
                or any(search in t.lower() for t in r.get("topics", []))
            ]

        return Response({
            "username":   username,
            "count":      len(repos),
            "repos":      repos,
        })


class GitHubImportView(APIView):
    """
    Import selected GitHub repositories as draft projects.
    Admin only.

    Request body:
        { "repo_ids": [123, 456, 789] }

    Response:
        {
            "imported": [{"id": uuid, "title": str, "slug": str}, ...],
            "skipped":  [{"repo_id": int, "name": str, "reason": str}, ...],
            "errors":   [{"repo_id": int, "reason": str}, ...],
        }
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = GitHubImportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        repo_ids = serializer.validated_data["repo_ids"]

        settings = SiteSettings.get()
        username = settings.github_username.strip()

        if not username:
            return Response(
                {"detail": "No GitHub username configured. Set it in Site Settings."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = github_service.import_repositories(repo_ids, username)

        http_status = status.HTTP_200_OK
        # If everything errored, signal that something went wrong
        if not result["imported"] and result["errors"]:
            http_status = status.HTTP_502_BAD_GATEWAY

        return Response(result, status=http_status)    