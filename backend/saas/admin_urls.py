from django.urls import path

from .admin_views import (
    SaasAdminUserListCreateAPIView,
    SaasAdminUserRoleAPIView,
    SaasAdminUserStatusAPIView,
)

urlpatterns = [
    path("users/", SaasAdminUserListCreateAPIView.as_view(), name="saas_admin_users"),
    path(
        "users/<int:user_id>/role/",
        SaasAdminUserRoleAPIView.as_view(),
        name="saas_admin_user_role",
    ),
    path(
        "users/<int:user_id>/status/",
        SaasAdminUserStatusAPIView.as_view(),
        name="saas_admin_user_status",
    ),
]
