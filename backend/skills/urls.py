from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CourseViewSet, TopicViewSet, StudentSkillViewSet ,AdminProjectViewSet,admin_dashboard_stats

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('topics', TopicViewSet)
router.register('skills', StudentSkillViewSet, basename='skills')
router.register('admin-projects', AdminProjectViewSet, basename='admin-projects')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/dashboard-stats/', admin_dashboard_stats),
]