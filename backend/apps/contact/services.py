# =============================================================================
# CONTACT — Business logic
# =============================================================================
from django.core.mail import send_mail
from django.conf import settings
from .models import Message


def create_message(data: dict, ip_address: str = None) -> Message:
    """Create and save a contact message, then notify admin."""
    message = Message.objects.create(
        name=data["name"],
        email=data["email"],
        subject=data["subject"],
        message=data["message"],
        ip_address=ip_address,
    )
    _notify_admin(message)
    return message


def _notify_admin(message: Message) -> None:
    """Send email notification to admin. Fails silently."""
    if not settings.ADMIN_EMAIL:
        return
    try:
        send_mail(
            subject=f"[Portfolio] New message: {message.subject}",
            message=(
                f"From: {message.name} <{message.email}>\n\n"
                f"{message.message}"
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
        )
    except Exception:
        pass  # Never let email failure break the contact form