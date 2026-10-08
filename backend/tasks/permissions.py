from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTaskParticipant(BasePermission):
    """
    Object-level permission:
    - Client (owner of project) has full CRUD.
    - Freelancer assigned to project or task can view and update (status, progress).
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Client who owns the project has full access
        if obj.project.client == user:
            return True

        # Freelancer assigned to project or assigned to task
        is_assigned = (obj.assigned_to == user) or (obj.project.freelancer == user)

        if request.method in SAFE_METHODS and is_assigned:
            return True

        # Freelancer can update status and progress
        if request.method in ['PUT', 'PATCH'] and is_assigned:
            return True

        # Delete is reserved for project client owner
        if request.method == 'DELETE':
            return obj.project.client == user

        return False
