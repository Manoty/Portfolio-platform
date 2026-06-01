# =============================================================================
# CONTACT — Views
# =============================================================================
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Message
from .serializers import MessageCreateSerializer, MessageAdminSerializer
from apps.accounts.permissions import IsAdminOrEditor, IsAdminRole
from . import services


class ContactSubmitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ip = request.META.get("REMOTE_ADDR")
        services.create_message(serializer.validated_data, ip_address=ip)
        return Response(
            {"detail": "Message received. Thank you!"},
            status=status.HTTP_201_CREATED,
        )


class MessageListView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request):
        status_filter = request.query_params.get("status")
        qs = Message.objects.all()
        if status_filter:
            qs = qs.filter(status=status_filter)

        paginator = PageNumberPagination()
        paginator.page_size = 20
        page = paginator.paginate_queryset(qs, request)
        serializer = MessageAdminSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class MessageDetailView(APIView):
    permission_classes = [IsAdminOrEditor]

    def get(self, request, pk):
        message = get_object_or_404(Message, pk=pk)
        if message.status == Message.Status.UNREAD:
            message.status = Message.Status.READ
            message.save(update_fields=["status"])
        return Response(MessageAdminSerializer(message).data)

    def patch(self, request, pk):
        message = get_object_or_404(Message, pk=pk)
        serializer = MessageAdminSerializer(message, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        get_object_or_404(Message, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)