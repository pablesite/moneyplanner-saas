from django.conf import settings
from django.db import models


class SaasCoreAccountLink(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="core_account_link",
    )
    core_user_ref = models.CharField(max_length=128, unique=True)
    core_username = models.CharField(max_length=150, blank=True, default="")
    core_email = models.EmailField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    linked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "memberships_saascoreaccountlink"
        indexes = [
            models.Index(fields=["user", "is_active"], name="memberships_user_id_729b44_idx")
        ]

    def __str__(self) -> str:
        return f"{self.user_id} -> core:{self.core_user_ref}"


class SaasSubscription(models.Model):
    class Status(models.TextChoices):
        TRIAL = "trial", "Trial"
        ACTIVE = "active", "Active"
        PAST_DUE = "past_due", "Past Due"
        CANCELED = "canceled", "Canceled"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saas_subscription",
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.TRIAL)
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "memberships_saassubscription"
        indexes = [models.Index(fields=["status"], name="memberships_status_753bb9_idx")]

    def is_premium_enabled(self) -> bool:
        return self.status in {self.Status.TRIAL, self.Status.ACTIVE}


class SaasConsumedCoreLinkToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="consumed_core_link_tokens",
    )
    jti = models.CharField(max_length=64, unique=True)
    consumed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "memberships_saasconsumedcorelinktoken"
        indexes = [
            models.Index(fields=["user", "consumed_at"], name="memberships_user_id_9d3894_idx")
        ]


class SaasAccessProfile(models.Model):
    class Role(models.TextChoices):
        ADMIN = "saas_admin", "SaaS Admin"
        MEMBER = "saas_member", "SaaS Member"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saas_access_profile",
    )
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "memberships_saasaccessprofile"
        indexes = [models.Index(fields=["role"], name="memberships_role_6f3e7b_idx")]

    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN


class SaasAuthAuditEvent(models.Model):
    event = models.CharField(max_length=64)
    outcome = models.CharField(max_length=16)
    actor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="saas_auth_audit_events",
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "memberships_saasauthauditevent"
        indexes = [
            models.Index(fields=["created_at"], name="memberships_created_85056c_idx"),
            models.Index(fields=["event", "created_at"], name="memberships_event_e89c20_idx"),
            models.Index(
                fields=["actor_user", "created_at"], name="memberships_actor_u_4920ce_idx"
            ),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.created_at.isoformat()} {self.event} ({self.outcome})"
