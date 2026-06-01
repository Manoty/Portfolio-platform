# =============================================================================
# PORTFOLIO — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Technology, Project, ProjectImage, Skill, Experience


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name", "slug", "icon_url", "color"]
        read_only_fields = ["slug"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project grid/listing."""
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "summary", "cover_image",
            "technologies", "status", "is_featured",
            "project_start", "project_end", "created_at",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full serializer for project detail page."""
    technologies = TechnologySerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Technology.objects.all(),
        write_only=True,
        source="technologies",
        required=False,
    )

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "summary", "description",
            "cover_image", "architecture_diagram",
            "github_url", "live_url",
            "technologies", "technology_ids",
            "images", "status", "is_featured",
            "project_start", "project_end",
            "view_count", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "view_count", "created_at", "updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "category", "proficiency", "icon_url", "order"]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id", "company", "role", "location",
            "start_date", "end_date", "description",
            "is_current", "order",
        ]