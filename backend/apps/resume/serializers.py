# =============================================================================
# RESUME — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.full_name", read_only=True)

    class Meta:
        model = Resume
        fields = [
            "id", "file", "label", "is_active",
            "download_count", "last_downloaded_at",
            "uploaded_by_name", "created_at",
        ]
        read_only_fields = ["id", "download_count", "last_downloaded_at", "uploaded_by_name", "created_at"]

    def create(self, validated_data):
        validated_data["uploaded_by"] = self.context["request"].user
        return super().create(validated_data)