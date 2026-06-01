from django.urls import path
from . import views

urlpatterns = [
    path("login/",           views.LoginView.as_view(),               name="auth-login"),
    path("logout/",          views.LogoutView.as_view(),              name="auth-logout"),
    path("refresh/",         views.RefreshTokenView.as_view(),        name="auth-refresh"),
    path("me/",              views.MeView.as_view(),                  name="auth-me"),
    path("change-password/", views.ChangePasswordView.as_view(),      name="auth-change-password"),
    path("reset-password/",  views.PasswordResetRequestView.as_view(),name="auth-reset-request"),
    path("reset-password/confirm/", views.PasswordResetConfirmView.as_view(), name="auth-reset-confirm"),
    path("register/",        views.RegisterView.as_view(),            name="auth-register"),
]