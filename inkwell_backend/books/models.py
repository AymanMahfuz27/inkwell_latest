from django.db import models

# Create your models here.
from users.models import UserProfile

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    genres = models.ManyToManyField(Genre)
    content = models.TextField(null=True, blank=True)
    pdf_file = models.FileField(upload_to='book_pdfs/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cover_picture = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    banner_picture = models.ImageField(upload_to='book_banners/', blank=True, null=True)
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(UserProfile, related_name='liked_books_set', blank=True)
    comments = models.ManyToManyField('comments.Comment', related_name='book_comments', blank=True)
    recommendations = models.ManyToManyField('recommendations.Recommendation', related_name='book_recommendations', blank=True)
    dislikes = models.ManyToManyField(UserProfile, related_name='disliked_books_set', blank=True)
    read_count = models.IntegerField(default=0)

    def __str__(self):
        return self.title
