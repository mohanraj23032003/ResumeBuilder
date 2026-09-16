from django.contrib import admin
from .models import Course, Topic, StudentSkill

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at')
    inlines = [TopicInline]

@admin.register(StudentSkill)
class StudentSkillAdmin(admin.ModelAdmin):
    list_display = ('student', 'topic', 'level', 'updated_at')
    list_filter = ('topic__course', 'level')