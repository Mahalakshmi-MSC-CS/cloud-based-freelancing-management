from rest_framework import serializers
from accounts.models import User
from projects.models import Project
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
        write_only=True
    )
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assigned_to',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'project_id', 'project_title',
            'title', 'description', 'assigned_to', 'assigned_to_id',
            'assigned_to_username', 'status', 'priority',
            'progress_percentage', 'deadline', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'project', 'assigned_to', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Auto-sync status and progress percentage if logically needed
        status_val = attrs.get('status')
        progress_val = attrs.get('progress_percentage')

        if status_val == Task.Status.COMPLETED and progress_val is None:
            attrs['progress_percentage'] = 100
        elif progress_val == 100 and status_val is None:
            attrs['status'] = Task.Status.COMPLETED

        return attrs


class TaskProgressUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['status', 'progress_percentage']

    def validate(self, attrs):
        status_val = attrs.get('status')
        progress_val = attrs.get('progress_percentage')

        if status_val == Task.Status.COMPLETED and (progress_val is None or progress_val < 100):
            attrs['progress_percentage'] = 100
        elif progress_val == 100 and status_val != Task.Status.COMPLETED:
            attrs['status'] = Task.Status.COMPLETED

        return attrs
