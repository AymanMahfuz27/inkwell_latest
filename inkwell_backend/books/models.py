from datetime import timedelta
from django.db import models
from users.models import UserProfile
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import JSONField  # Update this import
import bleach


class Genre(models.Model):
    name = models.CharField(max_length=255)

    @classmethod
    def search(cls, query):
        return cls.objects.filter(name__icontains=query)


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
    # New analytics fields
    view_count = models.IntegerField(default=0)
    unique_view_count = models.IntegerField(default=0)
    completed_reads = models.IntegerField(default=0)
    total_reading_time = models.DurationField(default=timedelta())
    geographic_distribution = JSONField(default=dict)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @classmethod
    def search(cls, query):
        search_vector = SearchVector('title', weight='A') + \
                        SearchVector('description', weight='B') + \
                        SearchVector('uploaded_by__username', weight='C') + \
                        SearchVector('genres__name', weight='D')
        search_query = SearchQuery(query)
        return cls.objects.annotate(
            rank=SearchRank(search_vector, search_query)
        ).filter(rank__gte=0.1).order_by('-rank').distinct()

    def clean(self):
        super().clean()
        if self.content:
            allowed_tags = ['p', 'b', 'i', 'u', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'br', 'ul', 'ol', 'li']
            allowed_attributes = {'a': ['href', 'title']}
            self.content = bleach.clean(self.content, tags=allowed_tags, attributes=allowed_attributes, strip=True)


    
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