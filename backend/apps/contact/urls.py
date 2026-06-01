from django.urls import path
from . import views

urlpatterns = [
    path("",           views.ContactSubmitView.as_view(), name="contact-submit"),
    path("messages/",  views.MessageListView.as_view(),   name="message-list"),
    path("messages/<uuid:pk>/", views.MessageDetailView.as_view(), name="message-detail"),
]