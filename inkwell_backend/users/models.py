from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import JSONField  # Update this import

# Create your models here.

#create a custom user model
class UserProfile(AbstractUser):
    email = models.EmailField(max_length=255, db_index=True)
    username = models.CharField(max_length=100, unique=True, db_index=True)
    first_name = models.CharField(max_length=100, blank=True, db_index=True)
    last_name = models.CharField(max_length=100, blank=True, db_index=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    followers = models.ManyToManyField('self', related_name='user_following', symmetrical=False, blank=True, db_index=True)
    following = models.ManyToManyField('self', related_name='user_followers', symmetrical=False, blank=True, db_index=True)

    #add a field to store the user's favorite genres
    favorite_genres = models.ManyToManyField('books.Genre', related_name='users_fav_genres', blank=True, db_index=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='userprofile_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userprofile_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    #add a field to store the users that visited this users profile 
    visitors = models.ManyToManyField('self', related_name='user_visitors', symmetrical=False, blank=True, db_index=True)
    #add a field to store the users that this user visited their profile
    visited_profiles = models.ManyToManyField('self', related_name='user_visited_profiles', symmetrical=False, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # New analytics fields
    profile_views = models.IntegerField(default=0)
    follower_count_history = JSONField(default=dict)  # Store counts with timestamps
    total_book_likes = models.IntegerField(default=0)
    total_book_views = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    geographic_distribution = JSONField(default=dict)


    def __str__(self):
        return self.username

    def get_followers(self):
        return self.followers.all()

    def get_following(self):
        return self.following.all()
    
    @classmethod
    def search(cls, query):
        search_vector = SearchVector('username', weight='A') + \
                        SearchVector('first_name', weight='B') + \
                        SearchVector('last_name', weight='B') + \
                        SearchVector('bio', weight='C')
        search_query = SearchQuery(query)
        return cls.objects.annotate(
            rank=SearchRank(search_vector, search_query)
        ).filter(rank__gte=0.1).order_by('-rank').distinct()
    
    def follow(self, user):
        if user != self:
            self.following.add(user)

    def unfollow(self, user):
        self.following.remove(user)

    def is_following(self, user):
        return self.following.filter(id=user.id).exists()



class BookCollection(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='book_collections')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    books = models.ManyToManyField('books.Book', related_name='collections')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.user.username}'s collection: {self.name}"