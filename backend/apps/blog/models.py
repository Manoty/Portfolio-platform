# =============================================================================
# BLOG — Posts, Categories, Tags
# =============================================================================
import uuid
import math
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "blog_category"
        ordering = ["name"]
        verbose_name_plural = "categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        db_table = "blog_tag"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    excerpt = models.CharField(max_length=500, help_text="Short summary for listing cards")
    content = models.TextField(help_text="Tiptap JSON string")
    cover_image = models.ImageField(upload_to="blog/covers/", blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts"
    )
    author = models.ForeignKey(
        "accounts.User", on_delete=models.PROTECT, related_name="posts"
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)
    view_count = models.PositiveIntegerField(default=0)
    read_time = models.PositiveIntegerField(default=1, help_text="Minutes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_post"
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["-published_at"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Auto set published_at when first published
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        # Calculate read time — rough estimate: 200 words/min
        if self.content:
            word_count = len(self.content.split())
            self.read_time = max(1, math.ceil(word_count / 200))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title