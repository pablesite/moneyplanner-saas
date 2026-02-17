from django.urls import path

from .auth_views import (
    SaasAuthModeAPIView,
    SaasCoreAccountLinkAPIView,
    SaasMeAPIView,
    SaasRegisterAPIView,
    SaasTokenObtainPairView,
    SaasTokenRefreshView,
)

urlpatterns = [
    path("token/", SaasTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", SaasTokenRefreshView.as_view(), name="token_refresh"),
    path("register/", SaasRegisterAPIView.as_view(), name="saas_register"),
    path("me/", SaasMeAPIView.as_view(), name="saas_me"),
    path("mode/", SaasAuthModeAPIView.as_view(), name="saas_auth_mode"),
    path("core-link/", SaasCoreAccountLinkAPIView.as_view(), name="saas_core_account_link"),
]
