from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from projects.models import Project
from .models import Task


class TasksAPITests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user(
            username='client_task',
            email='client_task@example.com',
            password='Password123!',
            role=User.Role.CLIENT
        )
        self.freelancer_user = User.objects.create_user(
            username='freelancer_task',
            email='freelancer_task@example.com',
            password='Password123!',
            role=User.Role.FREELANCER
        )
        self.other_user = User.objects.create_user(
            username='stranger',
            email='stranger@example.com',
            password='Password123!',
            role=User.Role.CLIENT
        )

        self.project = Project.objects.create(
            title='Web Portal',
            description='Build portal',
            client=self.client_user,
            freelancer=self.freelancer_user,
            budget=2000,
            deadline=date.today() + timedelta(days=20),
            status=Project.Status.IN_PROGRESS
        )

    def test_create_task_success(self):
        self.client.force_authenticate(user=self.client_user)
        url = reverse('tasks:task-list')
        data = {
            'project_id': self.project.id,
            'title': 'Design Database Schema',
            'description': 'Create ER diagram and migrations.',
            'assigned_to_id': self.freelancer_user.id,
            'status': Task.Status.TODO,
            'priority': Task.Priority.HIGH,
            'deadline': (date.today() + timedelta(days=5)).isoformat(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Design Database Schema')
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().assigned_to, self.freelancer_user)

    def test_unauthorized_user_cannot_create_task(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('tasks:task-list')
        data = {
            'project_id': self.project.id,
            'title': 'Malicious Task',
            'status': Task.Status.TODO,
            'priority': Task.Priority.LOW,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_freelancer_update_task_progress(self):
        task = Task.objects.create(
            project=self.project,
            title='Implement Authentication',
            assigned_to=self.freelancer_user,
            status=Task.Status.IN_PROGRESS,
            priority=Task.Priority.URGENT,
            progress_percentage=25
        )

        self.client.force_authenticate(user=self.freelancer_user)
        url = reverse('tasks:task-update-progress', kwargs={'pk': task.id})
        response = self.client.patch(url, {
            'progress_percentage': 100,
            'status': Task.Status.COMPLETED
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.progress_percentage, 100)
        self.assertEqual(task.status, Task.Status.COMPLETED)
