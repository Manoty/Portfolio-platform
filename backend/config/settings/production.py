# =============================================================================
# PRODUCTION SETTINGS — Render deployment
# =============================================================================
from .base import *  # noqa

DEBUG = False

# Render handles SSL termination — trust its proxy headers
SECURE_SSL_REDIRECT             = False
USE_X_FORWARDED_HOST            = True
SECURE_PROXY_SSL_HEADER         = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE           = True
CSRF_COOKIE_SECURE              = True
SECURE_BROWSER_XSS_FILTER       = True
SECURE_CONTENT_TYPE_NOSNIFF     = True
X_FRAME_OPTIONS                 = "DENY"

# Static files served by WhiteNoise
STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"