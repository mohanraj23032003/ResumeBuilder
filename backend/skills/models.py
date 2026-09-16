from django.db import models
from django.conf import settings

class Course(models.Model):
    name = models.CharField(max_length=100, unique=True)   # e.g. Python, Java, Linux
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=100)          # e.g. Loops, OOP, Django ORM
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('course', 'name')

    def __str__(self):
        return f"{self.course.name} → {self.name}"


class StudentSkill(models.Model):
    """A student's self-rated level (1-5) for a specific topic."""
    LEVEL_CHOICES = [(i, str(i)) for i in range(1, 6)]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skill_ratings')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='student_ratings')
    level = models.PositiveSmallIntegerField(choices=LEVEL_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'topic')   # one rating per topic per student

    def __str__(self):
        return f"{self.student.username} - {self.topic.name}: {self.level}"

class AdminProject(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    tech_stack = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='catalog_projects')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title