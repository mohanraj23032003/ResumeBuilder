from django.urls import path
from .views import me,RegisterView,list_students

urlpatterns = [
    path('me/', me),
    path('register/', RegisterView.as_view()),
    path('students-list/', list_students),
]