from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CLIENT = 'client', 'Client'
        FREELANCER = 'freelancer', 'Freelancer'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
        help_text='Designates whether this user is a Client or Freelancer.'
    )
    email = models.EmailField(
        unique=True,
        help_text='Required unique email address for communication and login.'
    )
    phone = models.CharField(
        max_length=30,
        blank=True,
        default='',
        help_text='Contact phone number.'
    )
    company_name = models.CharField(
        max_length=150,
        blank=True,
        default='',
        help_text='Company or business name (primarily for clients).'
    )
    bio = models.TextField(
        blank=True,
        default='',
        help_text='Brief personal or professional summary.'
    )
    skills = models.TextField(
        blank=True,
        default='',
        help_text='Comma-separated skills (e.g., Python, React, AWS, Docker).'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_client(self):
        return self.role == self.Role.CLIENT

    @property
    def is_freelancer(self):
        return self.role == self.Role.FREELANCER

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
