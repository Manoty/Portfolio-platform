# =============================================================================
# BLOG — Views
# =============================================================================
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Post, Category, Tag
from .serializers import (
    PostListSerializer, PostDetailSerializer,
    CategorySerializer, TagSerializer,
)
from apps.accounts.permissions import IsAdminOrEditorOrReadOnly, IsAdminRole
from . import services


class PostListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        search = request.query_params.get("search")
        category = request.query_params.get("category")
        tag = request.query_params.get("tag")
        ordering = request.query_params.get("ordering", "latest")
        show_all = request.query_params.get("all")

        if show_all and request.user.is_authenticated:
            qs = Post.objects.select_related("category", "author").prefetch_related("tags").order_by("-created_at")
        else:
            qs = services.get_published_posts(search, category, tag, ordering)

        paginator = PageNumberPagination()
        paginator.page_size = 9
        page = paginator.paginate_queryset(qs, request)
        serializer = PostListSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        self.check_permissions(request)
        serializer = PostDetailSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PostDetailView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get_object(self, slug):
        return get_object_or_404(Post, slug=slug)

    def get(self, request, slug):
        post = self.get_object(slug)
        services.increment_post_view(post.pk)
        serializer = PostDetailSerializer(post, context={"request": request})

        related = services.get_related_posts(post)
        related_data = PostListSerializer(related, many=True, context={"request": request}).data

        return Response({**serializer.data, "related_posts": related_data})

    def patch(self, request, slug):
        post = self.get_object(slug)
        serializer = PostDetailSerializer(
            post, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, slug):
        self.permission_classes = [IsAdminRole]
        self.check_permissions(request)
        self.get_object(slug).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        cats = services.get_categories_with_counts()
        return Response(CategorySerializer(cats, many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TagListView(APIView):
    permission_classes = [IsAdminOrEditorOrReadOnly]

    def get(self, request):
        tags = services.get_tags_with_counts()
        return Response(TagSerializer(tags, many=True).data)

    def post(self, request):
        serializer = TagSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)