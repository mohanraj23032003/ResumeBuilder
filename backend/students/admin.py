from django.contrib import admin
from .models import StudentProfile, Education, Experience, StudentProjectSelection, Certification

admin.site.register(StudentProfile)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(StudentProjectSelection)
admin.site.register(Certification)