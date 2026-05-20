from django.contrib.auth.models import User
from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    leaderboard_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    ROLE_USER = 'user'
    ROLE_ADMIN = 'admin'
    ROLE_CHOICES = [
        (ROLE_USER, 'User'),
        (ROLE_ADMIN, 'Admin'),
    ]

    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_USER)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL, related_name='members')
    bio = models.TextField(blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=120)
    duration_minutes = models.PositiveIntegerField(default=0)
    distance_km = models.FloatField(default=0.0)
    timestamp = models.DateTimeField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.activity_type} for {self.user.name}"


class Workout(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='workouts')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    scheduled_for = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
