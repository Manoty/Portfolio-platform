# =============================================================================
# ROOT URL CONFIGURATION
# =============================================================================
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin (superuser fallback only)
    path("django-admin/", admin.site.urls),

    # API v1
    path("api/auth/",         include("apps.accounts.urls")),
    path("api/projects/",     include("apps.portfolio.urls")),
    path("api/blog/",         include("apps.blog.urls")),
    path("api/contact/",      include("apps.contact.urls")),
    path("api/resume/",       include("apps.resume.urls")),
    path("api/testimonials/", include("apps.testimonials.urls")),
    path("api/analytics/",    include("apps.analytics.urls")),
    path("api/core/",        include("apps.core.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)