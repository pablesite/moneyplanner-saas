import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


def env_flag(name: str, default: str = "0") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


class Command(BaseCommand):
    help = "Seed initial SaaS data (admin user)."

    def handle(self, *args, **options):
        if not env_flag("SEED_CREATE_ADMIN", "1"):
            self.stdout.write("SEED_CREATE_ADMIN=0. Skipping admin seed.")
            return

        username = os.getenv("SEED_ADMIN_USERNAME", "admin").strip()
        email = os.getenv("SEED_ADMIN_EMAIL", "admin@example.com").strip()
        password = os.getenv("SEED_ADMIN_PASSWORD", "admin")
        force_password = env_flag("SEED_FORCE_ADMIN_PASSWORD", "0")

        if not username:
            self.stderr.write("SEED_ADMIN_USERNAME is empty. Aborting.")
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        changed = False

        if email and user.email != email:
            user.email = email
            changed = True

        if not user.is_staff:
            user.is_staff = True
            changed = True

        if not user.is_superuser:
            user.is_superuser = True
            changed = True

        if created or force_password:
            user.set_password(password)
            changed = True

        if changed:
            user.save()

        if created:
            self.stdout.write(f"Admin user created: {username}")
        else:
            self.stdout.write(f"Admin user ensured: {username}")

