from django.core.management.base import BaseCommand
from django.utils import timezone
from ...models import Team, UserProfile, Activity, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with sample teams, users, activities, and workouts.'

    def handle(self, *args, **options):
        now = timezone.now()

        team_a, _ = Team.objects.get_or_create(
            name='Team Phoenix',
            defaults={'description': 'High-energy fitness squad focused on speed and recovery.', 'leaderboard_score': 220},
        )
        team_b, _ = Team.objects.get_or_create(
            name='Team Atlas',
            defaults={'description': 'Strength and endurance team with weekly challenges.', 'leaderboard_score': 185},
        )

        alice, _ = UserProfile.objects.get_or_create(
            name='Alice Park',
            email='alice@example.com',
            defaults={'team': team_a, 'bio': 'Runner and mindfulness coach.'},
        )
        bob, _ = UserProfile.objects.get_or_create(
            name='Bob Miller',
            email='bob@example.com',
            defaults={'team': team_b, 'bio': 'Focused on strength training and recovery.'},
        )

        Activity.objects.get_or_create(
            user=alice,
            activity_type='Running',
            timestamp=now,
            defaults={'duration_minutes': 35, 'distance_km': 7.4, 'notes': 'Morning tempo run.'},
        )
        Activity.objects.get_or_create(
            user=bob,
            activity_type='Weightlifting',
            timestamp=now,
            defaults={'duration_minutes': 55, 'distance_km': 0.0, 'notes': 'Upper-body strength session.'},
        )

        Workout.objects.get_or_create(
            user=alice,
            title='Core Stability',
            scheduled_for=now + timezone.timedelta(days=1),
            defaults={'description': 'Pilates and bodyweight core work.', 'completed': False},
        )
        Workout.objects.get_or_create(
            user=bob,
            title='HIIT Blast',
            scheduled_for=now + timezone.timedelta(days=2),
            defaults={'description': 'High intensity interval training.', 'completed': False},
        )

        self.stdout.write(self.style.SUCCESS('Sample OctoFit Tracker data created successfully.'))
