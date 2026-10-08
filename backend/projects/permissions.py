from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsClientOrReadOnly(BasePermission):
    """
    Clients can create and modify projects.
    Others can only read.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.is_client


class IsProjectOwnerOrAssignedFreelancer(BasePermission):
    """
    Custom permission:
    - Client owner has full access (read, edit, delete).
    - Assigned freelancer can read and update status.
    - Others denied.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # Read permissions are allowed to client owner and assigned freelancer
        if request.method in SAFE_METHODS:
            return obj.client == user or obj.freelancer == user

        # Deletion is only allowed for the client owner
        if request.method == 'DELETE':
            return obj.client == user

        # Updates:
        # Client owner can update everything.
        if obj.client == user:
            return True

        # Freelancer can only update status
        if obj.freelancer == user:
            # If PATCH/PUT only contains 'status'
            if set(request.data.keys()).issubset({'status'}):
                return True
            return False

        return False
