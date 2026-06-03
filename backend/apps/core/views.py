from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny

from .models import SiteSettings
from .serializers import SiteSettingsSerializer
from apps.accounts.permissions import IsAdminRole


class SiteSettingsView(APIView):
    """
    GET  — public, returns current settings (used by frontend everywhere)
    PATCH — admin only, updates settings
    """

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminRole()]

    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        settings = SiteSettings.get()
        return Response(SiteSettingsSerializer(settings, context={"request": request}).data)

    def patch(self, request):
        settings = SiteSettings.get()
        serializer = SiteSettingsSerializer(
            settings, data=request.data, partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)