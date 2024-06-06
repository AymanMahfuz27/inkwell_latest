from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

#create a custom user model
class UserProfile(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True, db_index=True)
    first_name = models.CharField(max_length=100, blank=True, db_index=True)
    last_name = models.CharField(max_length=100, blank=True, db_index=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True)
    followers = models.ManyToManyField('self', related_name='user_following', symmetrical=False, blank=True, db_index=True)
    following = models.ManyToManyField('self', related_name='user_followers', symmetrical=False, blank=True, db_index=True)
    liked_books = models.ManyToManyField('books.Book', related_name='liked_by_users', blank=True, db_index=True)

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

    def __str__(self):
        return self.username

    def get_followers(self):
        return self.followers.all()

    def get_following(self):
        return self.following.all()
    

class BookCollection(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_collections')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    books = models.ManyToManyField('books.Book', related_name='book_in_collections')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
