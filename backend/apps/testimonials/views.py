from django.shortcuts import render

# Create your views here.
# =============================================================================
# TESTIMONIALS — Views
# =============================================================================
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from .models import Testimonial
from .serializers import TestimonialSerializer
from apps.accounts.permissions import IsAdminOrEditorOrReadOnly, IsAdminRole


class TestimonialListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        show_all = request.query_params.get("all")
        if show_all and request.user.is_authenticated:
            qs = Testimonial.objects.all()
        else:
            qs = Testimonial.objects.filter(is_published=True)
        featured_only = request.query_params.get("featured")
        if featured_only:
            qs = qs.filter(is_featured=True)
        return Response(TestimonialSerializer(qs, many=True, context={"request": request}).data)

    def post(self, request):
        serializer = TestimonialSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TestimonialDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request, pk):
        t = get_object_or_404(Testimonial, pk=pk)
        serializer = TestimonialSerializer(t, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        get_object_or_404(Testimonial, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)