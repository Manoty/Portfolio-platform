# =============================================================================
# ANALYTICS — Page views and discrete events (no paid services)
# =============================================================================
from django.db import models


class PageView(models.Model):
    path = models.CharField(max_length=500)
    session_key = models.CharField(max_length=64)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_pageview"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["path"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["session_key"]),
        ]

    def __str__(self):
        return f"{self.path} — {self.created_at:%Y-%m-%d %H:%M}"


class Event(models.Model):
    class EventType(models.TextChoices):
        PROJECT_VIEW = "project_view", "Project View"
        BLOG_VIEW = "blog_view", "Blog View"
        RESUME_DOWNLOAD = "resume_download", "Resume Download"
        CONTACT_SUBMIT = "contact_submit", "Contact Submit"

    event_type = models.CharField(max_length=50, choices=EventType.choices)
    object_id = models.CharField(max_length=100, blank=True, help_text="UUID of project or post")
    object_title = models.CharField(max_length=300, blank=True, help_text="Snapshot of title")
    session_key = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_event"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event_type"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        return f"{self.event_type} — {self.created_at:%Y-%m-%d %H:%M}"