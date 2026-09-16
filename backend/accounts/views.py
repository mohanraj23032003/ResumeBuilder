from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'role': request.user.role,
    })

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]   # anyone can hit this, no login needed
    serializer_class = RegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_students(request):
    if request.user.role != 'admin':
        return Response({'detail': 'Not authorized.'}, status=403)
    cutoff = timezone.now() - timedelta(minutes=15)
    students = User.objects.filter(role='student').order_by('-date_joined')
    data = [{
        'id': s.id,
        'username': s.username,
        'email': s.email,
        'date_joined': s.date_joined,
        'last_login': s.last_login,
        'is_active_now': bool(s.last_login and s.last_login >= cutoff),
    } for s in students]
    return Response(data)

    