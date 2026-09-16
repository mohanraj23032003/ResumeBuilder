from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    EducationViewSet, ExperienceViewSet, StudentProjectSelectionViewSet,
    CertificationViewSet, my_profile, generate_resume_pdf
)

router = DefaultRouter()
router.register('education', EducationViewSet, basename='education')
router.register('experience', ExperienceViewSet, basename='experience')
router.register('project-selections', StudentProjectSelectionViewSet, basename='project-selections')
router.register('certifications', CertificationViewSet, basename='certifications')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', my_profile),
    path('resume/pdf/', generate_resume_pdf),
]