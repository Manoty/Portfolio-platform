# =============================================================================
# ANALYTICS — Serializers
# =============================================================================
from rest_framework import serializers
from .models import PageView, Event


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = ["path", "session_key", "referrer"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["event_type", "object_id", "object_title", "session_key"]