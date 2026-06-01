# =============================================================================
# RESUME — Views
# =============================================================================
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from django.shortcuts import get_object_or_404

from .models import Resume
from .serializers import ResumeSerializer
from apps.accounts.permissions import IsAdminRole
from . import services


class ResumeListView(APIView):
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        resumes = Resume.objects.all()
        return Response(ResumeSerializer(resumes, many=True, context={"request": request}).data)

    def post(self, request):
        serializer = ResumeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResumeDetailView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk)
        serializer = ResumeSerializer(resume, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        get_object_or_404(Resume, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResumeDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        resume = services.get_active_resume()
        if not resume:
            return Response({"detail": "No active resume."}, status=status.HTTP_404_NOT_FOUND)
        services.record_download(resume)
        response = FileResponse(resume.file.open("rb"), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{resume.label}.pdf"'
        return response