from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer, FreelancerListSerializer
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    freelancer = FreelancerListSerializer(read_only=True)
    total_tasks = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'client', 'freelancer',
            'budget', 'deadline', 'status', 'total_tasks',
            'completed_tasks', 'progress_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']

    def get_total_tasks(self, obj):
        return obj.tasks.count()

    def get_completed_tasks(self, obj):
        return obj.tasks.filter(status='completed').count()

    def get_progress_percentage(self, obj):
        total = obj.tasks.count()
        if total == 0:
            return 100 if obj.status == Project.Status.COMPLETED else 0
        completed = obj.tasks.filter(status='completed').count()
        return round((completed / total) * 100)


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    freelancer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.FREELANCER),
        source='freelancer',
        required=False,
        allow_null=True
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'budget', 'deadline',
            'status', 'freelancer_id'
        ]

    def validate_budget(self, value):
        if value <= 0:
            raise serializers.ValidationError("Project budget must be greater than zero.")
        return value

    def create(self, validated_data):
        # Automatically assign current user as the client
        request = self.context.get('request')
        validated_data['client'] = request.user
        return super().create(validated_data)


class ProjectStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['status']
