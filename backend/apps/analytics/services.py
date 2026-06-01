# =============================================================================
# ANALYTICS — Business logic and aggregation queries
# =============================================================================
from django.db.models import Count, Q
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
from django.utils import timezone
from datetime import timedelta
from .models import PageView, Event


def record_pageview(path: str, session_key: str, ip_address: str = None,
                    user_agent: str = "", referrer: str = "") -> None:
    PageView.objects.create(
        path=path,
        session_key=session_key,
        ip_address=ip_address,
        user_agent=user_agent,
        referrer=referrer,
    )


def record_event(event_type: str, session_key: str,
                 object_id: str = "", object_title: str = "") -> None:
    Event.objects.create(
        event_type=event_type,
        session_key=session_key,
        object_id=object_id,
        object_title=object_title,
    )


def get_summary_stats() -> dict:
    now = timezone.now()
    last_30 = now - timedelta(days=30)

    total_views = PageView.objects.count()
    unique_visitors = PageView.objects.values("session_key").distinct().count()
    recent_views = PageView.objects.filter(created_at__gte=last_30).count()

    resume_downloads = Event.objects.filter(
        event_type=Event.EventType.RESUME_DOWNLOAD
    ).count()

    contact_submissions = Event.objects.filter(
        event_type=Event.EventType.CONTACT_SUBMIT
    ).count()

    return {
        "total_views": total_views,
        "unique_visitors": unique_visitors,
        "recent_views_30d": recent_views,
        "resume_downloads": resume_downloads,
        "contact_submissions": contact_submissions,
    }


def get_daily_views(days=30) -> list:
    since = timezone.now() - timedelta(days=days)
    return (
        PageView.objects.filter(created_at__gte=since)
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )


def get_top_projects(limit=5) -> list:
    return (
        Event.objects.filter(event_type=Event.EventType.PROJECT_VIEW)
        .values("object_id", "object_title")
        .annotate(count=Count("id"))
        .order_by("-count")[:limit]
    )


def get_top_posts(limit=5) -> list:
    return (
        Event.objects.filter(event_type=Event.EventType.BLOG_VIEW)
        .values("object_id", "object_title")
        .annotate(count=Count("id"))
        .order_by("-count")[:limit]
    )