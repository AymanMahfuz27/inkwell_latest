
from django.db import models
from users.models import UserProfile

class Feedback(models.Model):
    TYPE_CHOICES = (
        ('bug', 'Bug Report'),
        ('feature', 'Feature Suggestion'),
    )
    
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_type_display()}: {self.title}"