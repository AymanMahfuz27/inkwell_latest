from django.db import models
from users.models import UserProfile
from books.models import Book

class Upload(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, blank=True, null=True)


    def __str__(self):
        return f'Upload {self.id}'
