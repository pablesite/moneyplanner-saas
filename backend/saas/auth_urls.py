from django.urls import path

from .auth_views import (
    SaasAuthModeAPIView,
    SaasAuthOpsMetricsAPIView,
    SaasCoreAccountLinkFromTokenAPIView,
    SaasCoreAccountLinkAPIView,
    SaasMeAPIView,
    SaasRegisterAPIView,
    SaasSubscriptionAPIView,
    SaasTokenObtainPairView,
    SaasTokenRefreshView,
)

urlpatterns = [
    path("token/", SaasTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/", SaasTokenObtainPairView.as_view(), name="saas_login_compat"),
    path("refresh/", SaasTokenRefreshView.as_view(), name="token_refresh"),
    path("register/", SaasRegisterAPIView.as_view(), name="saas_register"),
    path("me/", SaasMeAPIView.as_view(), name="saas_me"),
    path("subscription/", SaasSubscriptionAPIView.as_view(), name="saas_subscription"),
    path("ops/metrics/", SaasAuthOpsMetricsAPIView.as_view(), name="saas_auth_ops_metrics"),
    path("mode/", SaasAuthModeAPIView.as_view(), name="saas_auth_mode"),
    path("core-link/", SaasCoreAccountLinkAPIView.as_view(), name="saas_core_account_link"),
    path(
        "core-link/from-token/",
        SaasCoreAccountLinkFromTokenAPIView.as_view(),
        name="saas_core_account_link_from_token",
    ),
]
