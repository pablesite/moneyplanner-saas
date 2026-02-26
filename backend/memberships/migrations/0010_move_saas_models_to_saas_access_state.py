from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("memberships", "0009_rename_memberships_user_id_247f36_idx_memberships_user_id_bd713b_idx_and_more"),
        ("saas_access", "0001_adopt_existing_saas_models"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.DeleteModel(name="SaasAuthAuditEvent"),
                migrations.DeleteModel(name="SaasAccessProfile"),
                migrations.DeleteModel(name="SaasConsumedCoreLinkToken"),
                migrations.DeleteModel(name="SaasSubscription"),
                migrations.DeleteModel(name="SaasCoreAccountLink"),
            ],
        )
    ]
