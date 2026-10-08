from django.db.models import Q, Sum
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from tasks.models import Task
from .models import Project
from .permissions import IsProjectOwnerOrAssignedFreelancer
from .serializers import (
    ProjectSerializer,
    ProjectCreateUpdateSerializer,
    ProjectStatusUpdateSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsProjectOwnerOrAssignedFreelancer]
    search_fields = ['title', 'description']
    filterset_fields = ['status', 'deadline']
    ordering_fields = ['created_at', 'deadline', 'budget']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.none()

        if user.is_client:
            return Project.objects.filter(client=user).select_related('client', 'freelancer').prefetch_related('tasks')
        elif user.is_freelancer:
            return Project.objects.filter(freelancer=user).select_related('client', 'freelancer').prefetch_related('tasks')
        return Project.objects.all().select_related('client', 'freelancer').prefetch_related('tasks')

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ProjectCreateUpdateSerializer
        if self.action == 'partial_update':
            if self.request.user.is_freelancer:
                return ProjectStatusUpdateSerializer
            return ProjectCreateUpdateSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_client:
            self.permission_denied(
                self.request,
                message="Only clients are authorized to create new projects."
            )
        serializer.save()

    @action(detail=False, methods=['get'], url_path='stats')
    def dashboard_stats(self, request):
        """Calculates metric cards data for Client or Freelancer dashboard."""
        qs = self.get_queryset()
        total_projects = qs.count()
        active_projects = qs.filter(status=Project.Status.IN_PROGRESS).count()
        completed_projects = qs.filter(status=Project.Status.COMPLETED).count()
        pending_projects = qs.filter(status=Project.Status.PENDING).count()

        if request.user.is_client:
            user_tasks = Task.objects.filter(project__client=request.user)
        else:
            user_tasks = Task.objects.filter(Q(assigned_to=request.user) | Q(project__freelancer=request.user))

        total_tasks = user_tasks.count()
        completed_tasks = user_tasks.filter(status=Task.Status.COMPLETED).count()
        total_budget = qs.aggregate(total=Sum('budget'))['total'] or 0

        return Response({
            'role': request.user.role,
            'total_projects': total_projects,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'pending_projects': pending_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'total_budget': float(total_budget),
        })
