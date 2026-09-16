from rest_framework import serializers
from .models import StudentProfile, Education, Experience, StudentProjectSelection, Certification


class StudentProfileSerializer(serializers.ModelSerializer):
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    github_url = serializers.URLField(required=False, allow_blank=True)
    portfolio_url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'full_name', 'phone', 'address', 'linkedin_url', 'github_url', 'portfolio_url', 'summary', 'updated_at']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'start_year', 'end_year', 'grade']

    def validate(self, data):
        end_year = data.get('end_year')
        start_year = data.get('start_year')
        if end_year and start_year and end_year < start_year:
            raise serializers.ValidationError("End year cannot be before start year.")
        return data


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company', 'role', 'start_date', 'end_date', 'description']

    def validate(self, data):
        end_date = data.get('end_date')
        start_date = data.get('start_date')
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError("End date cannot be before start date.")
        return data


class StudentProjectSelectionSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_description = serializers.CharField(source='project.description', read_only=True)
    project_tech_stack = serializers.CharField(source='project.tech_stack', read_only=True)

    class Meta:
        model = StudentProjectSelection
        fields = ['id', 'project', 'project_title', 'project_description', 'project_tech_stack', 'selected_at']


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issued_by', 'issue_date', 'credential_url']