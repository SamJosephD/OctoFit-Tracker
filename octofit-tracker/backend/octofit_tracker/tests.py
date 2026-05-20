from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class OctoFitTrackerTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root_returns_endpoints(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('workouts', response.data)
        self.assertIn('leaderboard', response.data)
