from django.db import models
from django.conf import settings
from skills.models import AdminProject


class StudentProfile(models.Model):
    """Core personal info + resume header."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, blank=True)
    address = models.CharField(max_length=255, blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    summary = models.TextField(blank=True, help_text="Short professional summary / objective")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class Education(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150, blank=True)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(null=True, blank=True)
    grade = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ['-end_year']

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Experience(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='experience')
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"


class StudentProjectSelection(models.Model):
    """A student picking one of the admin's catalog projects as their own."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_selections')
    project = models.ForeignKey(AdminProject, on_delete=models.CASCADE, related_name='selected_by')
    selected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'project')

    def __str__(self):
        return f"{self.student.username} -> {self.project.title}"


class Certification(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=200)
    issued_by = models.CharField(max_length=150)
    issue_date = models.DateField()
    credential_url = models.URLField(blank=True)

    def __str__(self):
        return self.title