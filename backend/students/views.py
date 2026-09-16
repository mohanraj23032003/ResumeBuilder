from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.template.loader import render_to_string
from django.http import HttpResponse
from io import BytesIO
from xhtml2pdf import pisa

from .models import StudentProfile, Education, Experience, StudentProjectSelection, Certification
from .serializers import (
    StudentProfileSerializer, EducationSerializer,
    ExperienceSerializer, StudentProjectSelectionSerializer, CertificationSerializer,
)
from skills.models import StudentSkill


class OwnerScopedViewSet(viewsets.ModelViewSet):
    """Base class: every queryset is scoped to request.user, every create attaches request.user."""
    permission_classes = [permissions.IsAuthenticated]
    owner_field = 'student'

    def get_queryset(self):
        return self.queryset.filter(**{self.owner_field: self.request.user})

    def perform_create(self, serializer):
        serializer.save(**{self.owner_field: self.request.user})


class EducationViewSet(OwnerScopedViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class ExperienceViewSet(OwnerScopedViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class StudentProjectSelectionViewSet(OwnerScopedViewSet):
    queryset = StudentProjectSelection.objects.all()
    serializer_class = StudentProjectSelectionSerializer


class CertificationViewSet(OwnerScopedViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def my_profile(request):
    profile, _ = StudentProfile.objects.get_or_create(
        user=request.user, defaults={'full_name': request.user.username}
    )
    if request.method == 'GET':
        return Response(StudentProfileSerializer(profile).data)
    serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def generate_resume_pdf(request):
    student = request.user
    profile, _ = StudentProfile.objects.get_or_create(
        user=student, defaults={'full_name': student.username}
    )
    context = {
        'student': student,
        'profile': profile,
        'education': student.education.all(),
        'experience': student.experience.all(),
        'projects': student.project_selections.select_related('project').all(),
        'certifications': student.certifications.all(),
        'skills': StudentSkill.objects.filter(student=student).select_related('topic__course'),
    }
    html_string = render_to_string('resume_template.html', context)

    buffer = BytesIO()
    pisa.CreatePDF(html_string, dest=buffer)
    pdf_file = buffer.getvalue()

    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{student.username}_resume.pdf"'
    return response