from rest_framework import serializers
from .models import Course, Topic, StudentSkill

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'course', 'name', 'description']

class CourseSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'created_by', 'created_at', 'topics']
        read_only_fields = ['created_by']

class StudentSkillSerializer(serializers.ModelSerializer):
    topic_name = serializers.CharField(source='topic.name', read_only=True)
    course_name = serializers.CharField(source='topic.course.name', read_only=True)
    class Meta:
        model = StudentSkill
        fields = ['id', 'topic', 'topic_name', 'course_name', 'level', 'updated_at']

from .models import Course, Topic, StudentSkill, AdminProject

class AdminProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProject
        fields = ['id', 'title', 'description', 'tech_stack', 'created_by', 'created_at']
        read_only_fields = ['created_by']