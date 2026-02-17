from django.conf import settings
from django.db import migrations, models


def backfill_access_profiles(apps, schema_editor):
    access_model = apps.get_model("memberships", "SaasAccessProfile")
    app_label, model_name = settings.AUTH_USER_MODEL.split(".")
    user_model = apps.get_model(app_label, model_name)

    for user in user_model.objects.all().iterator():
        role = "saas_admin" if (user.is_superuser or user.is_staff) else "saas_member"
        access_model.objects.get_or_create(
            user_id=user.id,
            defaults={"role": role},
        )


class Migration(migrations.Migration):
    dependencies = [
        ("memberships", "0006_saasconsumedcorelinktoken"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SaasAccessProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[("saas_admin", "SaaS Admin"), ("saas_member", "SaaS Member")],
                        default="saas_member",
                        max_length=16,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=models.deletion.CASCADE,
                        related_name="saas_access_profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddIndex(
            model_name="saasaccessprofile",
            index=models.Index(fields=["role"], name="memberships_role_b013fd_idx"),
        ),
        migrations.RunPython(backfill_access_profiles, migrations.RunPython.noop),
    ]
