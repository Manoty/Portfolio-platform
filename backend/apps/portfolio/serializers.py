# =============================================================================
# PORTFOLIO — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Technology, Project, ProjectImage, Skill, Experience


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Technology
        fields = ["id", "name", "slug", "icon_url", "color"]
        read_only_fields = ["slug"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight — project grid cards."""
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model  = Project
        fields = [
            "id", "title", "slug", "summary", "cover_image",
            "technologies",
            "category",           # ← NEW
            "status", "is_featured",
            "project_start", "project_end",
            "created_at",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full — project detail page and admin editor."""
    technologies   = TechnologySerializer(many=True, read_only=True)
    images         = ProjectImageSerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Technology.objects.all(),
        write_only=True,
        source="technologies",
        required=False,
    )

    class Meta:
        model  = Project
        fields = [
            "id", "title", "slug", "summary", "description",
            "cover_image", "architecture_diagram",
            "github_url", "live_url",
            "technologies", "technology_ids",
            "category",           # ← NEW
            "images",
            "status", "is_featured",
            "project_start", "project_end",
            "view_count", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "view_count", "created_at", "updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Skill
        fields = ["id", "name", "category", "proficiency", "icon_url", "order"]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Experience
        fields = [
            "id", "company", "role", "location",
            "start_date", "end_date", "description",
            "is_current", "order",
        ]
        
# ---------------------------------------------------------------------------
# GitHub Import Serializers
# ---------------------------------------------------------------------------

class GitHubImportSerializer(serializers.Serializer):
    """Validates the import request body."""
    repo_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        min_length=1,
        error_messages={"min_length": "Select at least one repository to import."},
    )


class GitHubUsernameValidateSerializer(serializers.Serializer):
    """Validates a GitHub username string."""
    username = serializers.CharField(
        max_length=100,
        min_length=1,
        error_messages={
            "min_length": "Username cannot be empty.",
            "max_length": "Username is too long.",
        },
    )        