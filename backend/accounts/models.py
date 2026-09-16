from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)

    @property
    def is_admin_role(self):
        return self.role == 'admin'

    @property
    def is_student_role(self):
        return self.role == 'student'

    def __str__(self):
        return f"{self.username} ({self.role})"