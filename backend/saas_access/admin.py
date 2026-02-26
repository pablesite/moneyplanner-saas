from django.contrib import admin

from .models import SaasAuthAuditEvent


@admin.register(SaasAuthAuditEvent)
class SaasAuthAuditEventAdmin(admin.ModelAdmin):
    list_display = ("created_at", "event", "outcome", "actor_user")
    list_filter = ("event", "outcome")
    search_fields = ("event", "actor_user__username")
    readonly_fields = ("created_at",)
