# Create your models here.
# recommendations/models.py
from django.db import models
from users.models import UserProfile
from books.models import Book

class Recommendation(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Recommendation for {self.user.username} - {self.book.title}'
