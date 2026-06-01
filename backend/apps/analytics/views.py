# =============================================================================
# ANALYTICS — Views
# =============================================================================
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import PageViewSerializer, EventSerializer
from apps.accounts.permissions import IsAdminOrEditor
from . import services


class TrackPageViewView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PageViewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.record_pageview(
            path=serializer.validated_data["path"],
            session_key=serializer.validated_data["session_key"],
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            referrer=serializer.validated_data.get("referrer", ""),
        )
        return Response({"detail": "ok"})


class TrackEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.record_event(**serializer.validated_data)
        return Response({"detail": "ok"})


class AnalyticsSummaryView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request):
        return Response(services.get_summary_stats())


class AnalyticsDailyView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request):
        days = int(request.query_params.get("days", 30))
        data = list(services.get_daily_views(days))
        return Response(data)


class AnalyticsTopProjectsView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request):
        return Response(list(services.get_top_projects()))


class AnalyticsTopPostsView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request):
        return Response(list(services.get_top_posts()))