# =============================================================================
# CORE — SiteSettings (single-row configuration table)
# Stores all portfolio content that was previously hardcoded in the frontend.
# Admin edits this once; frontend reads it via API.
# =============================================================================
from django.db import models


class SiteSettings(models.Model):
    """
    Enforces a single row via the save() override.
    All fields are optional so the record can be created empty and filled in.
    """

    # -------------------------------------------------------------------------
    # Identity
    # -------------------------------------------------------------------------
    full_name    = models.CharField(max_length=200, default="Kevin Manoti")
    tagline      = models.CharField(
        max_length=300,
        default="Full Stack Engineer",
        help_text="Short role/title shown in the hero",
    )
    bio_short    = models.CharField(
        max_length=500,
        blank=True,
        help_text="One-liner shown in hero sub-tagline",
    )
    bio_long     = models.TextField(
        blank=True,
        help_text="Full bio shown in the About section (supports line breaks)",
    )
    bio_long_2   = models.TextField(
        blank=True,
        help_text="Second paragraph of bio (optional)",
    )
    location     = models.CharField(max_length=200, default="Nairobi, Kenya")
    open_to_work = models.BooleanField(
        default=True,
        help_text="Controls the 'Available for opportunities' badge",
    )
    availability_text = models.CharField(
        max_length=200,
        default="Available for opportunities",
    )

    # -------------------------------------------------------------------------
    # Contact / Social
    # -------------------------------------------------------------------------
    email          = models.EmailField(blank=True, default="kevin@kevinmanoti.dev")
    github_url     = models.URLField(blank=True, default="https://github.com/kevinmanoti")
    linkedin_url   = models.URLField(blank=True, default="https://linkedin.com/in/kevinmanoti")
    twitter_url    = models.URLField(blank=True, default="https://twitter.com/kevinmanoti")
    website_url    = models.URLField(blank=True)

    # -------------------------------------------------------------------------
    # Stats (shown in About section)
    # -------------------------------------------------------------------------
    stat_experience  = models.CharField(max_length=20, default="5+",  help_text="e.g. 5+")
    stat_projects    = models.CharField(max_length=20, default="30+", help_text="e.g. 30+")
    stat_technologies = models.CharField(max_length=20, default="20+", help_text="e.g. 20+")
    stat_open_source = models.CharField(max_length=20, default="50+", help_text="e.g. 50+")

    # -------------------------------------------------------------------------
    # SEO
    # -------------------------------------------------------------------------
    meta_description = models.CharField(
        max_length=300,
        blank=True,
        default="Full Stack Engineer specialising in Django, React, and PostgreSQL.",
    )

    # -------------------------------------------------------------------------
    # Profile image
    # -------------------------------------------------------------------------
    profile_image = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
        help_text="Used in the About section card",
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table    = "core_sitesettings"
        verbose_name = "Site Settings"

    def __str__(self):
        return f"Site Settings — {self.full_name}"

    def save(self, *args, **kwargs):
        # Enforce single-row pattern
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls) -> "SiteSettings":
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj