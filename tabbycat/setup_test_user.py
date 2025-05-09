from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import UserPermission, Group, Membership
from tournaments.models import Tournament
from utils.permissions import Permission

User = get_user_model()

class Command(BaseCommand):
    help = 'Sets up test users and permissions for development'

    def handle(self, *args, **options):
        try:
            # Create superuser
            User.objects.create_superuser(
                email='admin@example.com',
                password='admin123',
                name='Admin User'
            )

            # Create test user
            test_user = User.objects.create_user(
                email='emnma007@gmail.com',
                password='admin',
                name='Test User'
            )

            # Create a test tournament
            tournament = Tournament.objects.create(
                name='Test Tournament',
                slug='test-tournament',
                seq=1
            )

            # Create a group with all permissions
            group = Group.objects.create(
                name='Test Admins',
                tournament=tournament
            )
            group.permissions.set([perm for perm, _ in Permission.choices])

            # Add test user to group
            Membership.objects.create(
                user=test_user,
                group=group
            )

            # Grant test user all permissions for the tournament
            for perm, _ in Permission.choices:
                UserPermission.objects.create(
                    user=test_user,
                    permission=perm,
                    tournament=tournament
                )

            self.stdout.write(self.style.SUCCESS('Successfully created test users and permissions'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error setting up test users: {str(e)}'))
