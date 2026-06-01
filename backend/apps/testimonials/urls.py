from django.urls import path
from . import views

urlpatterns = [
    path("",          views.TestimonialListView.as_view(),   name="testimonial-list"),
    path("<int:pk>/", views.TestimonialDetailView.as_view(), name="testimonial-detail"),
]