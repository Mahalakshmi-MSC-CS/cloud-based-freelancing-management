from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from .models import Project


class ProjectsAPITests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(
            username='client1',
            email='client1@example.com',
            password='Password123!',
            role=User.Role.CLIENT
        )
        self.freelancer_user = User.objects.create_user(
            username='freelancer1',
            email='freelancer1@example.com',
            password='Password123!',
            role=User.Role.FREELANCER
        )
        self.other_client = User.objects.create_user(
            username='client2',
            email='client2@example.com',
            password='Password123!',
            role=User.Role.CLIENT
        )

        self.project_data = {
            'title': 'Cloud Migration Platform',
            'description': 'Migrate legacy application to AWS.',
            'budget': '4500.00',
            'deadline': (date.today() + timedelta(days=30)).isoformat(),
            'freelancer_id': self.freelancer_user.id,
            'status': Project.Status.PENDING,
        }

    def test_client_create_project_success(self):
        self.client.force_authenticate(user=self.client_user)
        url = reverse('projects:project-list')
        response = self.client.post(url, self.project_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Cloud Migration Platform')
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Project.objects.first().client, self.client_user)

    def test_freelancer_cannot_create_project(self):
        self.client.force_authenticate(user=self.freelancer_user)
        url = reverse('projects:project-list')
        response = self.client.post(url, self.project_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_can_retrieve_own_projects(self):
        Project.objects.create(
            title='Project 1',
            description='Desc 1',
            client=self.client_user,
            budget=1000,
            deadline=date.today(),
            status=Project.Status.PENDING
        )
        Project.objects.create(
            title='Project 2',
            description='Desc 2',
            client=self.other_client,
            budget=2000,
            deadline=date.today(),
            status=Project.Status.PENDING
        )

        self.client.force_authenticate(user=self.client_user)
        url = reverse('projects:project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see client1's project (pagination results or direct list)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Project 1')

    def test_freelancer_can_update_project_status(self):
        project = Project.objects.create(
            title='Assigned Project',
            description='Test Desc',
            client=self.client_user,
            freelancer=self.freelancer_user,
            budget=3000,
            deadline=date.today(),
            status=Project.Status.PENDING
        )

        self.client.force_authenticate(user=self.freelancer_user)
        url = reverse('projects:project-detail', kwargs={'pk': project.id})
        response = self.client.patch(url, {'status': Project.Status.IN_PROGRESS})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        project.refresh_from_db()
        self.assertEqual(project.status, Project.Status.IN_PROGRESS)

    def test_dashboard_stats_endpoint(self):
        Project.objects.create(
            title='Active Project',
            description='Test Desc',
            client=self.client_user,
            budget=5000,
            deadline=date.today(),
            status=Project.Status.IN_PROGRESS
        )
        self.client.force_authenticate(user=self.client_user)
        url = reverse('projects:project-dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_projects'], 1)
        self.assertEqual(response.data['active_projects'], 1)
        self.assertEqual(response.data['total_budget'], 5000.0)
