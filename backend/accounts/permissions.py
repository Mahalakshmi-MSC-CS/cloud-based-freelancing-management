from rest_framework.permissions import BasePermission


class IsClient(BasePermission):
    """Allows access only to authenticated users with role='client'."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_client)


class IsFreelancer(BasePermission):
    """Allows access only to authenticated users with role='freelancer'."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_freelancer)
