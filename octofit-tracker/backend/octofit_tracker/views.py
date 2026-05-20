import os
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile, Team, Activity, Workout
from .serializers import (
    UserProfileSerializer,
    TeamSerializer,
    ActivitySerializer,
    WorkoutSerializer,
)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().order_by('-joined_at')
    serializer_class = UserProfileSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('-timestamp')
    serializer_class = ActivitySerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('scheduled_for')
    serializer_class = WorkoutSerializer


class LeaderboardView(APIView):
    def get(self, request, format=None):
        users = (
            UserProfile.objects.annotate(total_activity=Sum('activities__duration_minutes'))
            .order_by('-total_activity')
        )
        leaderboard = [
            {
                'user': user.name,
                'team': user.team.name if user.team else None,
                'total_activity': user.total_activity or 0,
            }
            for user in users
        ]
        return Response(leaderboard)
