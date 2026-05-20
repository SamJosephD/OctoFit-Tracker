from django.contrib import admin
from .models import UserProfile, Team, Activity, Workout

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'team', 'joined_at']
    search_fields = ['name', 'email']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'leaderboard_score', 'created_at']
    search_fields = ['name']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['activity_type', 'user', 'duration_minutes', 'distance_km', 'timestamp']
    list_filter = ['activity_type']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'scheduled_for', 'completed']
    list_filter = ['completed']
