# =============================================================================
# RESUME — Upload, activate, and track downloads
# =============================================================================
from django.db import models
from django.db import transaction


class Resume(models.Model):
    file = models.FileField(upload_to="resume/")
    label = models.CharField(max_length=200, help_text="e.g. 'Resume — May 2025'")
    is_active = models.BooleanField(default=False)
    download_count = models.PositiveIntegerField(default=0)
    last_downloaded_at = models.DateTimeField(blank=True, null=True)
    uploaded_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, related_name="resumes"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "resume_resume"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        # Enforce only one active resume at a time
        if self.is_active:
            with transaction.atomic():
                Resume.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.label