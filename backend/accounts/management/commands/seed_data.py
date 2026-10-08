from datetime import date, timedelta
from django.core.management.base import BaseCommand
from accounts.models import User
from projects.models import Project
from tasks.models import Task


class Command(BaseCommand):
    help = 'Seeds initial demonstration data for Client and Freelancer accounts'

    def handle(self, *args, **options):
        # Create or update Client
        client, created = User.objects.get_or_create(
            username='client_demo',
            defaults={
                'email': 'client@example.com',
                'first_name': 'Sarah',
                'last_name': 'Jenkins',
                'role': User.Role.CLIENT,
                'company_name': 'Acme Cloud Solutions',
                'bio': 'VP of Engineering at Acme Cloud Solutions, managing modern web infrastructure projects.',
            }
        )
        if created:
            client.set_password('Password123!')
            client.save()
            self.stdout.write(self.style.SUCCESS('Created client_demo account'))

        # Create or update Freelancer
        freelancer, created = User.objects.get_or_create(
            username='freelancer_demo',
            defaults={
                'email': 'freelancer@example.com',
                'first_name': 'Alex',
                'last_name': 'Rivera',
                'role': User.Role.FREELANCER,
                'skills': 'React, Python, Django, PostgreSQL, Docker, AWS',
                'bio': 'Full-stack cloud developer specializing in high-throughput microservices and responsive SPAs.',
            }
        )
        if created:
            freelancer.set_password('Password123!')
            freelancer.save()
            self.stdout.write(self.style.SUCCESS('Created freelancer_demo account'))

        # Sample Project 1: Cloud Migration
        proj1, created = Project.objects.get_or_create(
            title='Enterprise Cloud Infrastructure Migration',
            defaults={
                'description': 'Migrate monolithic on-premise application to AWS cloud-native architecture using Docker, RDS PostgreSQL, and ECS.',
                'client': client,
                'freelancer': freelancer,
                'budget': 8500.00,
                'deadline': date.today() + timedelta(days=25),
                'status': Project.Status.IN_PROGRESS,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {proj1.title}'))

        # Tasks for Project 1
        Task.objects.get_or_create(
            project=proj1,
            title='Configure PostgreSQL RDS & Database Schema',
            defaults={
                'description': 'Setup relational schema with migrations and foreign key constraints.',
                'assigned_to': freelancer,
                'status': Task.Status.COMPLETED,
                'priority': Task.Priority.HIGH,
                'progress_percentage': 100,
                'deadline': date.today() + timedelta(days=5),
            }
        )
        Task.objects.get_or_create(
            project=proj1,
            title='Containerize Backend with Docker Multi-Stage Builds',
            defaults={
                'description': 'Create minimal, hardened Dockerfile for Django WSGI service.',
                'assigned_to': freelancer,
                'status': Task.Status.IN_PROGRESS,
                'priority': Task.Priority.URGENT,
                'progress_percentage': 60,
                'deadline': date.today() + timedelta(days=12),
            }
        )
        Task.objects.get_or_create(
            project=proj1,
            title='Deploy CI/CD Pipeline via Jenkins',
            defaults={
                'description': 'Build, test, and push images to AWS ECR automatically on pull requests.',
                'assigned_to': freelancer,
                'status': Task.Status.TODO,
                'priority': Task.Priority.MEDIUM,
                'progress_percentage': 0,
                'deadline': date.today() + timedelta(days=20),
            }
        )

        # Sample Project 2: React Dashboard
        proj2, created = Project.objects.get_or_create(
            title='Real-Time Financial Analytics Dashboard',
            defaults={
                'description': 'Interactive React + Vite frontend for financial metrics with dynamic charts and KPI summaries.',
                'client': client,
                'freelancer': freelancer,
                'budget': 4200.00,
                'deadline': date.today() + timedelta(days=40),
                'status': Project.Status.PENDING,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {proj2.title}'))

        Task.objects.get_or_create(
            project=proj2,
            title='Implement JWT Authentication & Protected Routes',
            defaults={
                'description': 'Integrate Axios interceptors with silent token refresh.',
                'assigned_to': freelancer,
                'status': Task.Status.COMPLETED,
                'priority': Task.Priority.HIGH,
                'progress_percentage': 100,
                'deadline': date.today() + timedelta(days=7),
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded demonstration database!'))
