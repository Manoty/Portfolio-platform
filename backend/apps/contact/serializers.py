# =============================================================================
# CONTACT — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Message


class MessageCreateSerializer(serializers.ModelSerializer):
    """Public-facing — only accepts the form fields."""
    class Meta:
        model = Message
        fields = ["name", "email", "subject", "message"]


class MessageAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin dashboard."""
    class Meta:
        model = Message
        fields = [
            "id", "name", "email", "subject", "message",
            "status", "ip_address", "created_at",
        ]
        read_only_fields = ["id", "name", "email", "subject", "message", "ip_address", "created_at"]