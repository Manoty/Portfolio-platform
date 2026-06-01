# =============================================================================
# BLOG — Business logic
# =============================================================================
from django.db.models import Q, Count
from .models import Post, Category, Tag


def get_published_posts(search=None, category_slug=None, tag_slug=None, ordering="-published_at"):
    """Return filtered, searched, sorted queryset of published posts."""
    qs = Post.objects.filter(status=Post.Status.PUBLISHED).select_related(
        "category", "author"
    ).prefetch_related("tags")

    if search:
        qs = qs.filter(
            Q(title__icontains=search)
            | Q(excerpt__icontains=search)
            | Q(tags__name__icontains=search)
        ).distinct()

    if category_slug:
        qs = qs.filter(category__slug=category_slug)

    if tag_slug:
        qs = qs.filter(tags__slug=tag_slug)

    allowed_orderings = {
        "latest": "-published_at",
        "oldest": "published_at",
        "popular": "-view_count",
    }
    qs = qs.order_by(allowed_orderings.get(ordering, "-published_at"))
    return qs


def get_related_posts(post, limit=3):
    """Return posts in the same category or sharing tags, excluding current."""
    return (
        Post.objects.filter(
            status=Post.Status.PUBLISHED,
        )
        .filter(
            Q(category=post.category) | Q(tags__in=post.tags.all())
        )
        .exclude(pk=post.pk)
        .distinct()
        .order_by("-published_at")[:limit]
    )


def get_categories_with_counts():
    return Category.objects.annotate(post_count=Count("posts")).order_by("name")


def get_tags_with_counts():
    return Tag.objects.annotate(post_count=Count("posts")).order_by("name")


def increment_post_view(post_id: str) -> None:
    from django.db import models
    Post.objects.filter(pk=post_id).update(view_count=models.F("view_count") + 1)