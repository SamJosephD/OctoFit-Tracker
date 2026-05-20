from rest_framework import serializers
from .models import UserProfile, Team, Activity, Workout

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'leaderboard_score', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    team = serializers.CharField(source='team.name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'name', 'email', 'role', 'team', 'bio', 'joined_at']


class ActivitySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all(), source='user', write_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'activity_type', 'duration_minutes', 'distance_km', 'timestamp', 'notes']


class WorkoutSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all(), source='user', write_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'user', 'user_id', 'title', 'description', 'scheduled_for', 'completed']


class LeaderboardSerializer(serializers.Serializer):
    user = serializers.CharField()
    team = serializers.CharField(allow_null=True)
    total_activity = serializers.IntegerField()
