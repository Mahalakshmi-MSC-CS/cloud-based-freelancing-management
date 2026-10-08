from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Health check and API overview."""
    return Response({
        'status': 'online',
        'message': 'Cloud-Based Freelance Project Management API is running.',
        'endpoints': {
            'auth': '/api/auth/',
            'projects': '/api/projects/',
            'tasks': '/api/tasks/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/auth/', include('accounts.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/tasks/', include('tasks.urls')),
]
