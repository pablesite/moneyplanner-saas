from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("memberships", "0009_rename_memberships_user_id_247f36_idx_memberships_user_id_bd713b_idx_and_more"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name="SaasCoreAccountLink",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("core_user_ref", models.CharField(max_length=128, unique=True)),
                        ("core_username", models.CharField(blank=True, default="", max_length=150)),
                        ("core_email", models.EmailField(blank=True, default="", max_length=254)),
                        ("is_active", models.BooleanField(default=True)),
                        ("linked_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        (
                            "user",
                            models.OneToOneField(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="core_account_link",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={"db_table": "memberships_saascoreaccountlink"},
                ),
                migrations.AddIndex(
                    model_name="saascoreaccountlink",
                    index=models.Index(fields=["user", "is_active"], name="memberships_user_id_729b44_idx"),
                ),
                migrations.CreateModel(
                    name="SaasSubscription",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("status", models.CharField(choices=[("trial", "Trial"), ("active", "Active"), ("past_due", "Past Due"), ("canceled", "Canceled")], default="trial", max_length=16)),
                        ("started_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        (
                            "user",
                            models.OneToOneField(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="saas_subscription",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={"db_table": "memberships_saassubscription"},
                ),
                migrations.AddIndex(
                    model_name="saassubscription",
                    index=models.Index(fields=["status"], name="memberships_status_753bb9_idx"),
                ),
                migrations.CreateModel(
                    name="SaasConsumedCoreLinkToken",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("jti", models.CharField(max_length=64, unique=True)),
                        ("consumed_at", models.DateTimeField(auto_now_add=True)),
                        (
                            "user",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="consumed_core_link_tokens",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={"db_table": "memberships_saasconsumedcorelinktoken"},
                ),
                migrations.AddIndex(
                    model_name="saasconsumedcorelinktoken",
                    index=models.Index(fields=["user", "consumed_at"], name="memberships_user_id_9d3894_idx"),
                ),
                migrations.CreateModel(
                    name="SaasAccessProfile",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("role", models.CharField(choices=[("saas_admin", "SaaS Admin"), ("saas_member", "SaaS Member")], default="saas_member", max_length=16)),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        (
                            "user",
                            models.OneToOneField(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="saas_access_profile",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={"db_table": "memberships_saasaccessprofile"},
                ),
                migrations.AddIndex(
                    model_name="saasaccessprofile",
                    index=models.Index(fields=["role"], name="memberships_role_6f3e7b_idx"),
                ),
                migrations.CreateModel(
                    name="SaasAuthAuditEvent",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("event", models.CharField(max_length=64)),
                        ("outcome", models.CharField(max_length=16)),
                        ("metadata", models.JSONField(blank=True, default=dict)),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        (
                            "actor_user",
                            models.ForeignKey(
                                blank=True,
                                null=True,
                                on_delete=django.db.models.deletion.SET_NULL,
                                related_name="saas_auth_audit_events",
                                to=settings.AUTH_USER_MODEL,
                            ),
                        ),
                    ],
                    options={
                        "ordering": ["-created_at"],
                        "db_table": "memberships_saasauthauditevent",
                    },
                ),
                migrations.AddIndex(
                    model_name="saasauthauditevent",
                    index=models.Index(fields=["created_at"], name="memberships_created_85056c_idx"),
                ),
                migrations.AddIndex(
                    model_name="saasauthauditevent",
                    index=models.Index(fields=["event", "created_at"], name="memberships_event_e89c20_idx"),
                ),
                migrations.AddIndex(
                    model_name="saasauthauditevent",
                    index=models.Index(fields=["actor_user", "created_at"], name="memberships_actor_u_4920ce_idx"),
                ),
            ],
        )
    ]
