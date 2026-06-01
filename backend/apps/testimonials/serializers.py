# =============================================================================
# TESTIMONIALS — Serializers
# =============================================================================
from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            "id", "name", "role", "company", "testimonial",
            "photo", "is_featured", "is_published", "order", "created_at",
        ]
        read_only_fields = ["id", "created_at"]