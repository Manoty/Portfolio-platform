# =============================================================================
# TESTIMONIALS — Client / colleague testimonials
# =============================================================================
from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    testimonial = models.TextField()
    photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "testimonials_testimonial"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.name} — {self.company}"