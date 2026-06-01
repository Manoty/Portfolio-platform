# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
from .base import *  # noqa

DEBUG = True

# In dev, also allow console email so you can see emails in the terminal
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Relax CORS in development
CORS_ALLOW_ALL_ORIGINS = True

# Django Debug Toolbar (optional, add later if needed)
# INSTALLED_APPS += ["debug_toolbar"]