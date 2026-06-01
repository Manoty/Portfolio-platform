from django.urls import path
from . import views

urlpatterns = [
    path("",                              views.ProjectListView.as_view(),    name="project-list"),
    path("<slug:slug>/",                  views.ProjectDetailView.as_view(),  name="project-detail"),
    path("<slug:slug>/images/",           views.ProjectImageView.as_view(),   name="project-images"),
    path("<slug:slug>/images/<int:image_id>/", views.ProjectImageView.as_view(), name="project-image-delete"),
    path("meta/technologies/",            views.TechnologyListView.as_view(), name="technology-list"),
    path("meta/skills/",                  views.SkillListView.as_view(),      name="skill-list"),
    path("meta/skills/<int:pk>/",         views.SkillDetailView.as_view(),    name="skill-detail"),
    path("meta/experience/",              views.ExperienceListView.as_view(), name="experience-list"),
    path("meta/experience/<int:pk>/",     views.ExperienceDetailView.as_view(),name="experience-detail"),
]