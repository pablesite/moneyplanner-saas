from __future__ import annotations

from .models import SaasSubscription


def get_or_create_subscription(*, user) -> SaasSubscription:
    return SaasSubscription.objects.get_or_create(user=user)[0]


def has_premium_access(*, user) -> bool:
    subscription = get_or_create_subscription(user=user)
    return subscription.is_premium_enabled()

