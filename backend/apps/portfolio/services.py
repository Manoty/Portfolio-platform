# =============================================================================
# PORTFOLIO — Business logic
# =============================================================================
from django.db.models import Q, F
from django.db import models
from .models import Project


def get_published_projects(
    search=None,
    technology_slug=None,
    category=None,           # ← NEW
    ordering="-created_at",
):
    """
    Return filtered, searched, sorted queryset of published projects.
    """
    qs = Project.objects.filter(
        status=Project.Status.PUBLISHED
    ).prefetch_related("technologies", "images")

    if search:
        qs = qs.filter(
            Q(title__icontains=search)
            | Q(summary__icontains=search)
            | Q(technologies__name__icontains=search)
        ).distinct()

    if technology_slug:
        qs = qs.filter(technologies__slug=technology_slug)

    # ---- NEW ----
    if category:
        qs = qs.filter(category=category)
    # -------------

    allowed_orderings = {
        "latest":   "-created_at",
        "oldest":   "created_at",
        "featured": "-is_featured",
    }
    qs = qs.order_by(allowed_orderings.get(ordering, "-created_at"))
    return qs


def get_related_projects(project, limit=3):
    """Related projects — same category first, then same technologies."""
    tech_ids = project.technologies.values_list("id", flat=True)

    return (
        Project.objects.filter(
            status=Project.Status.PUBLISHED,
        )
        .filter(
            Q(category=project.category)
            | Q(technologies__in=tech_ids)
        )
        .exclude(pk=project.pk)
        .distinct()
        .order_by("-is_featured", "-created_at")[:limit]
    )


def increment_project_view(project_id: str) -> None:
    Project.objects.filter(pk=project_id).update(
        view_count=F("view_count") + 1
    )