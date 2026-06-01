# =============================================================================
# ACCOUNTS — Business logic
# =============================================================================
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()


def send_password_reset_email(email: str) -> bool:
    """
    Generate a password reset token and email it.
    Returns True if user found, False otherwise (but don't expose this to public).
    """
    try:
        user = User.objects.get(email=email, is_active=True)
    except User.DoesNotExist:
        return False

    token = default_token_generator.make_token(user)
    uid = str(user.pk)

    reset_url = f"{settings.FRONTEND_URL}/admin/reset-password?uid={uid}&token={token}"

    send_mail(
        subject="Password Reset — Portfolio Platform",
        message=f"Click the link to reset your password:\n\n{reset_url}\n\nThis link expires in 24 hours.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )
    return True


def confirm_password_reset(uid: str, token: str, new_password: str) -> bool:
    """Validate token and set new password. Returns True on success."""
    try:
        user = User.objects.get(pk=uid, is_active=True)
    except (User.DoesNotExist, ValueError):
        return False

    if not default_token_generator.check_token(user, token):
        return False

    user.set_password(new_password)
    user.save(update_fields=["password"])
    return True