# =============================================================================
# ACCOUNTS — Custom JWT authentication reading from httpOnly cookies
# =============================================================================
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads the access token from an httpOnly cookie named 'access_token'
    instead of the Authorization header.
    Falls back to header-based auth so tools like curl/Postman still work
    during development.
    """

    def authenticate(self, request):
        # Try cookie first
        raw_token = request.COOKIES.get("access_token")

        if raw_token is None:
            # Fall back to header (useful for Postman / tests)
            return super().authenticate(request)

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            return None

        return self.get_user(validated_token), validated_token