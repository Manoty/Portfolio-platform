from django.urls import path
from . import views

urlpatterns = [
    path("",             views.ResumeListView.as_view(),   name="resume-list"),
    path("<int:pk>/",    views.ResumeDetailView.as_view(), name="resume-detail"),
    path("download/",    views.ResumeDownloadView.as_view(), name="resume-download"),
]