# =============================================================================
# ACCOUNTS — Custom DRF Permission Classes
# =============================================================================
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminRole(BasePermission):
    """
    Allows access only to users with role='admin'.
    Used for destructive actions and settings.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsAdminOrEditor(BasePermission):
    """
    Allows access to admin and editor roles.
    Editors can create and update but views handle delete separately.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "editor")
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Read-only for everyone (including anonymous).
    Write access only for admin role.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsAdminOrEditorOrReadOnly(BasePermission):
    """
    Read-only for everyone (including anonymous).
    Write access for admin and editor roles.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "editor")
        )