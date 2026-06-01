from django.urls import path
from . import views

urlpatterns = [
    path("track/pageview/",  views.TrackPageViewView.as_view(),    name="track-pageview"),
    path("track/event/",     views.TrackEventView.as_view(),       name="track-event"),
    path("summary/",         views.AnalyticsSummaryView.as_view(), name="analytics-summary"),
    path("daily/",           views.AnalyticsDailyView.as_view(),   name="analytics-daily"),
    path("top/projects/",    views.AnalyticsTopProjectsView.as_view(), name="analytics-top-projects"),
    path("top/posts/",       views.AnalyticsTopPostsView.as_view(),    name="analytics-top-posts"),
]