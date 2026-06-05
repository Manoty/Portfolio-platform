# =============================================================================
# PORTFOLIO — Projects, Technologies, Skills, Experience
# =============================================================================
import uuid
from django.db import models
from django.utils.text import slugify


class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon_url = models.URLField(max_length=500, blank=True)
    color = models.CharField(max_length=7, blank=True, help_text="Hex color e.g. #3776AB")

    class Meta:
        db_table = "portfolio_technology"
        ordering = ["name"]
        verbose_name_plural = "technologies"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    class Status(models.TextChoices):
        DRAFT     = "draft",     "Draft"
        PUBLISHED = "published", "Published"

    # ----- NEW -----
    class Category(models.TextChoices):
        FRONTEND         = "frontend",         "Frontend"
        BACKEND          = "backend",          "Backend"
        FULL_STACK       = "full_stack",       "Full Stack"
        DATA_ENGINEERING = "data_engineering", "Data Engineering"
    # ---------------

    id                   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title                = models.CharField(max_length=200)
    slug                 = models.SlugField(max_length=200, unique=True, blank=True)
    summary              = models.CharField(max_length=500)
    description          = models.TextField()
    cover_image          = models.ImageField(upload_to="projects/covers/",  blank=True, null=True)
    architecture_diagram = models.ImageField(upload_to="projects/diagrams/", blank=True, null=True)
    github_url           = models.URLField(max_length=500, blank=True)
    live_url             = models.URLField(max_length=500, blank=True)
    technologies         = models.ManyToManyField(Technology, blank=True, related_name="projects")
    github_repo_id = models.PositiveBigIntegerField(
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="GitHub repository ID — set on import, prevents duplicates",
    )

    # ----- NEW -----
    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.FULL_STACK,
        db_index=True,
    )
    # ---------------

    status       = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured  = models.BooleanField(default=False)
    project_start = models.DateField(blank=True, null=True)
    project_end   = models.DateField(blank=True, null=True)
    view_count   = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "portfolio_project"
        ordering = ["-created_at"]
        indexes  = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["category"]),   # new index
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image   = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True)
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "portfolio_projectimage"
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} — image {self.order}"


class Skill(models.Model):
    class Category(models.TextChoices):
        LANGUAGES  = "Languages",  "Languages"
        FRAMEWORKS = "Frameworks", "Frameworks"
        DATABASES  = "Databases",  "Databases"
        TOOLS      = "Tools",      "Tools"
        DEVOPS     = "DevOps",     "DevOps"
        OTHER      = "Other",      "Other"

    name        = models.CharField(max_length=100)
    category    = models.CharField(max_length=50, choices=Category.choices)
    proficiency = models.PositiveSmallIntegerField(default=3)
    icon_url    = models.URLField(max_length=500, blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "portfolio_skill"
        ordering = ["category", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class Experience(models.Model):
    company     = models.CharField(max_length=200)
    role        = models.CharField(max_length=200)
    location    = models.CharField(max_length=200, blank=True)
    start_date  = models.DateField()
    end_date    = models.DateField(blank=True, null=True)
    description = models.TextField()
    is_current  = models.BooleanField(default=False)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "portfolio_experience"
        ordering = ["order", "-start_date"]

    def __str__(self):
        return f"{self.role} at {self.company}"