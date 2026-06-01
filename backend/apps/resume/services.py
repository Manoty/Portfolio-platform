# =============================================================================
# RESUME — Business logic
# =============================================================================
from django.utils import timezone
from django.db import models
from .models import Resume


def get_active_resume() -> Resume | None:
    return Resume.objects.filter(is_active=True).first()


def record_download(resume: Resume) -> None:
    """Increment download count and update timestamp atomically."""
    Resume.objects.filter(pk=resume.pk).update(
        download_count=models.F("download_count") + 1,
        last_downloaded_at=timezone.now(),
    )