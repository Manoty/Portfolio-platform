from django.urls import path
from . import views

urlpatterns = [
    path("",                  views.PostListView.as_view(),    name="post-list"),
    path("<slug:slug>/",      views.PostDetailView.as_view(),  name="post-detail"),
    path("meta/categories/",  views.CategoryListView.as_view(),name="category-list"),
    path("meta/tags/",        views.TagListView.as_view(),     name="tag-list"),
]