# =============================================================================
# PRODUCTION SETTINGS
# =============================================================================
from .base import *  # noqa
from decouple import config

DEBUG = False

SECURE_BROWSER_XSS_FILTER      = True
SECURE_CONTENT_TYPE_NOSNIFF    = True
SECURE_SSL_REDIRECT            = False  # Railway handles SSL termination
SESSION_COOKIE_SECURE          = True
CSRF_COOKIE_SECURE             = True
X_FRAME_OPTIONS                = "DENY"

# Trust Railway's proxy headers
USE_X_FORWARDED_HOST  = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Static files
STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"