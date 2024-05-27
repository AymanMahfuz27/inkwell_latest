# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, BookCollection
from books.serializers import BookSerializer, GenreSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    liked_books = BookSerializer(many=True, read_only=True)
    favorite_genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture', 'followers', 'following', 'liked_books', 'favorite_genres']

class BookCollectionSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)

    class Meta:
        model = BookCollection
        fields = ['id', 'name', 'description', 'books', 'created_at', 'updated_at']
