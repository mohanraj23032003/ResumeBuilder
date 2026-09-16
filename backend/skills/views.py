from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import Course, Topic, StudentSkill, AdminProject
from .serializers import CourseSerializer, TopicSerializer, StudentSkillSerializer, AdminProjectSerializer
from .permissions import IsAdminRole

User = get_user_model()


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]


class StudentSkillViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentSkill.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class AdminProjectViewSet(viewsets.ModelViewSet):
    queryset = AdminProject.objects.all()
    serializer_class = AdminProjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


@api_view(['GET'])
@permission_classes([IsAdminRole])
def admin_dashboard_stats(request):
    active_cutoff = timezone.now() - timedelta(minutes=15)
    return Response({
        'total_students': User.objects.filter(role='student').count(),
        'active_students': User.objects.filter(role='student', last_login__gte=active_cutoff).count(),
        'total_courses': Course.objects.count(),
        'total_topics': Topic.objects.count(),
        'total_catalog_projects': AdminProject.objects.count(),
    })