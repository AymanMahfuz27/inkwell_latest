from django.db import models

# Create your models here.
from users.models import UserProfile

class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    genres = models.ManyToManyField(Genre)
    content = models.TextField(null=True, blank=True)
    pdf_file = models.FileField(upload_to='book_pdfs/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cover_picture = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    banner_picture = models.ImageField(upload_to='book_banners/', blank=True, null=True)
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(UserProfile, related_name='books_liked', blank=True)  # Changed this line
    view_count = models.PositiveIntegerField(default=0)

    
    def __str__(self):
        return self.title

class Comment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='comments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']