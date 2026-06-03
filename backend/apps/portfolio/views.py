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