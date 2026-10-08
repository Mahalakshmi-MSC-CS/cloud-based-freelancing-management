from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User


class AccountsAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('accounts:register')
        self.login_url = reverse('accounts:login')
        self.profile_url = reverse('accounts:profile')

        self.client_user_data = {
            'username': 'testclient',
            'email': 'client@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'role': User.Role.CLIENT,
            'company_name': 'Acme Corp',
        }

        self.freelancer_user_data = {
            'username': 'testfreelancer',
            'email': 'freelancer@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'role': User.Role.FREELANCER,
            'skills': 'Python, Django, React',
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.client_user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['username'], 'testclient')
        self.assertEqual(response.data['user']['role'], User.Role.CLIENT)
        self.assertTrue(User.objects.filter(username='testclient').exists())

    def test_registration_password_mismatch(self):
        data = self.client_user_data.copy()
        data['password_confirm'] = 'DifferentPassword123!'
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    def test_registration_duplicate_email(self):
        self.client.post(self.register_url, self.client_user_data)
        data = self.client_user_data.copy()
        data['username'] = 'anotherclient'
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_jwt_login_and_profile_access(self):
        # Register user
        self.client.post(self.register_url, self.client_user_data)

        # Login
        login_response = self.client.post(self.login_url, {
            'username': 'testclient',
            'password': 'SecurePassword123!'
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)
        access_token = login_response.data['access']

        # Access profile with Bearer token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['username'], 'testclient')
        self.assertEqual(profile_response.data['company_name'], 'Acme Corp')
