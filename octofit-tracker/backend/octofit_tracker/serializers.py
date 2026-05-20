from rest_framework import serializers
from .models import UserProfile, Team, Activity, Workout

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'leaderboard_score', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    team = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'team', 'bio', 'joined_at']


class ActivitySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'duration_minutes', 'distance_km', 'timestamp', 'notes']


class WorkoutSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Workout
        fields = ['id', 'user', 'title', 'description', 'scheduled_for', 'completed']


class LeaderboardSerializer(serializers.Serializer):
    user = serializers.CharField()
    team = serializers.CharField(allow_null=True)
    total_activity = serializers.IntegerField()
