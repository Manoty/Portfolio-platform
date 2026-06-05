from rest_framework import serializers
from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteSettings
        fields = [
            "full_name", "tagline", "bio_short", "bio_long", "bio_long_2",
            "location", "open_to_work", "availability_text",
            "email", "github_url", "linkedin_url", "twitter_url", "website_url",
            "github_username",
            "stat_experience", "stat_projects", "stat_technologies", "stat_open_source",
            "meta_description", "profile_image",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]