from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .permissions import IsTaskParticipant
from .serializers import TaskSerializer, TaskProgressUpdateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskParticipant]
    search_fields = ['title', 'description']
    filterset_fields = ['status', 'priority', 'project']
    ordering_fields = ['created_at', 'deadline', 'priority', 'progress_percentage']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Task.objects.none()

        if user.is_client:
            return Task.objects.filter(project__client=user).select_related('project', 'assigned_to')
        elif user.is_freelancer:
            return Task.objects.filter(
                Q(assigned_to=user) | Q(project__freelancer=user)
            ).select_related('project', 'assigned_to')
        return Task.objects.all().select_related('project', 'assigned_to')

    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        # Ensure only the client or the assigned freelancer of this project can create tasks
        user = self.request.user
        if project.client != user and project.freelancer != user:
            self.permission_denied(
                self.request,
                message="You can only create tasks for projects you own or are assigned to."
            )
        serializer.save()

    @action(detail=True, methods=['patch'], url_path='progress')
    def update_progress(self, request, pk=None):
        """Allows assigned freelancer or client to update status and progress percentage."""
        task = self.get_object()
        serializer = TaskProgressUpdateSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
