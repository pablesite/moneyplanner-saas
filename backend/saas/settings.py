from pathlib import Path
import os
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent
LOG_DIR = BASE_DIR / "logs"
if LOG_DIR.exists() and not LOG_DIR.is_dir():
    LOG_DIR = BASE_DIR / ".logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)


def env_bool(name: str, default: str = "0") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


DEFAULT_DEV_SECRET_KEY = "dev-only-not-for-production-change-me-please-32b"
INSECURE_SECRET_VALUES = {
    "",
    "changeme",
    "dev-insecure-secret",
    DEFAULT_DEV_SECRET_KEY,
}


def validate_secret(name: str, value: str, *, min_length: int = 32) -> None:
    if DEBUG:
        return
    if value in INSECURE_SECRET_VALUES:
        raise ImproperlyConfigured(f"{name} uses an insecure default value.")
    if len(value) < min_length:
        raise ImproperlyConfigured(f"{name} must be at least {min_length} characters long.")


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", DEFAULT_DEV_SECRET_KEY).strip()
DEBUG = env_bool("DJANGO_DEBUG", "0")
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "saas_access",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "saas.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "saas.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "saas"),
        "USER": os.getenv("DB_USER", "saas"),
        "PASSWORD": os.getenv("DB_PASSWORD", "saas"),
        "HOST": os.getenv("DB_HOST", "db"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "es-es"
TIME_ZONE = "Europe/Madrid"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "")
CORS_ALLOW_CREDENTIALS = env_bool("CORS_ALLOW_CREDENTIALS", "0")
CORS_ALLOW_ALL_ORIGINS = env_bool("CORS_ALLOW_ALL_ORIGINS", "0")
# Restrict CORS headers to API endpoints only.
CORS_URLS_REGEX = r"^/api/.*$"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.ScopedRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {
        "auth_login": os.getenv("THROTTLE_AUTH_LOGIN", "20/min"),
        "auth_refresh": os.getenv("THROTTLE_AUTH_REFRESH", "60/min"),
        "auth_register": os.getenv("THROTTLE_AUTH_REGISTER", "10/min"),
        "auth_me": os.getenv("THROTTLE_AUTH_ME", "120/min"),
        "auth_core_link": os.getenv("THROTTLE_AUTH_CORE_LINK", "20/min"),
        "auth_core_link_token": os.getenv("THROTTLE_AUTH_CORE_LINK_TOKEN", "20/min"),
        "auth_subscription": os.getenv("THROTTLE_AUTH_SUBSCRIPTION", "60/min"),
        "auth_ops_metrics": os.getenv("THROTTLE_AUTH_OPS_METRICS", "60/min"),
        "saas_admin_api": os.getenv("THROTTLE_SAAS_ADMIN_API", "60/min"),
        "premium_api": os.getenv("THROTTLE_PREMIUM_API", "240/min"),
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "saas.exception_handler.custom_exception_handler",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "MoneyPlanner SaaS API",
    "DESCRIPTION": "API del SaaS (features premium).",
    "VERSION": "0.1.0",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "SIGNING_KEY": "",
    "ISSUER": os.getenv("JWT_ISSUER", "moneyplanner-saas"),
    "AUDIENCE": os.getenv("JWT_AUDIENCE", "moneyplanner-saas-api"),
}
JWT_SIGNING_KEY = os.getenv("JWT_SIGNING_KEY", SECRET_KEY).strip()
SIMPLE_JWT["SIGNING_KEY"] = JWT_SIGNING_KEY

# Roadmap 03 flags: auth autonomy + optional account linking.
AUTH_MODE_SAAS_LOCAL = env_bool("AUTH_MODE_SAAS_LOCAL", "1")
ACCOUNT_LINKING_ENABLED = env_bool("ACCOUNT_LINKING_ENABLED", "0")
CORE_LINKING_SHARED_SECRET = os.getenv("CORE_LINKING_SHARED_SECRET", "").strip()
CORE_LINKING_TOKEN_MAX_AGE_SECONDS = int(os.getenv("CORE_LINKING_TOKEN_MAX_AGE_SECONDS", "300"))
AUTH_TRANSITION_MODE = os.getenv("AUTH_TRANSITION_MODE", "stable").strip().lower()
AUTH_SESSION_COMPAT_ENABLED = env_bool("AUTH_SESSION_COMPAT_ENABLED", "1")
CORE_API_BASE_URL = os.getenv("CORE_API_BASE_URL", "http://host.docker.internal:8000").strip()
CORE_BOOTSTRAP_TIMEOUT_SECONDS = float(os.getenv("CORE_BOOTSTRAP_TIMEOUT_SECONDS", "5"))

validate_secret("DJANGO_SECRET_KEY", SECRET_KEY)
validate_secret("JWT_SIGNING_KEY", JWT_SIGNING_KEY)
if ACCOUNT_LINKING_ENABLED and CORE_LINKING_SHARED_SECRET:
    validate_secret("CORE_LINKING_SHARED_SECRET", CORE_LINKING_SHARED_SECRET)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "auth_audit_file": {
            "class": "logging.FileHandler",
            "formatter": "default",
            "filename": str(LOG_DIR / "auth_audit.log"),
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "auth.audit": {
            "handlers": ["console", "auth_audit_file"],
            "level": "INFO",
            "propagate": False,
        }
    },
}
