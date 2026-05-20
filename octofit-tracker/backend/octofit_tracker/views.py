import os
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile, Team, Activity, Workout
from .serializers import (
    UserProfileSerializer,
    TeamSerializer,
    ActivitySerializer,
    WorkoutSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        profile = getattr(request.user, 'profile', None)
        return profile is not None and profile.role == UserProfile.ROLE_ADMIN


class UserProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    queryset = UserProfile.objects.all().order_by('-joined_at')
    serializer_class = UserProfileSerializer


class TeamViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    queryset = Activity.objects.all().order_by('-timestamp')
    serializer_class = ActivitySerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminOrReadOnly]
    queryset = Workout.objects.all().order_by('scheduled_for')
    serializer_class = WorkoutSerializer


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')
        bio = request.data.get('bio', '')

        if not email or not password or not name:
            return Response({'detail': 'Name, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({'detail': 'A user with that email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
        profile = UserProfile.objects.create(
            user=user,
            name=name,
            email=email,
            bio=bio,
            role=UserProfile.ROLE_USER,
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': profile.id,
                'name': profile.name,
                'email': profile.email,
                'role': profile.role,
            },
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        profile = getattr(user, 'profile', None)
        return Response({
            'token': token.key,
            'user': {
                'id': profile.id if profile else None,
                'name': profile.name if profile else user.first_name,
                'email': user.email,
                'role': profile.role if profile else UserProfile.ROLE_USER,
            },
        })


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

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
