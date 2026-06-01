# =============================================================================
# BLOG — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Category, Tag, Post


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "post_count"]
        read_only_fields = ["slug"]


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "post_count"]
        read_only_fields = ["slug"]


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog listing cards."""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "excerpt", "cover_image",
            "category", "tags", "author_name",
            "status", "is_featured", "published_at",
            "view_count", "read_time",
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for blog detail page and admin editor."""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.full_name", read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        source="tags",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "excerpt", "content",
            "cover_image", "category", "category_id",
            "tags", "tag_ids", "author_name",
            "status", "is_featured",
            "published_at", "view_count", "read_time",
            "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "view_count", "read_time", "published_at", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)