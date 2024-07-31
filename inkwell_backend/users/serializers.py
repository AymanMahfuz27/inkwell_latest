# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, BookCollection
from books.serializers import BookSerializer, GenreSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from books.models import Book

class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    books_liked = BookSerializer(many=True, read_only=True)
    favorite_genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture', 
                'followers', 'following', 'books_liked', 'favorite_genres', 'visitors', 
                'visited_profiles', 'created_at']
        read_only_fields = ['id', 'username', 'followers', 'following', 'books_liked', 
                            'favorite_genres', 'visitors', 'visited_profiles', 'created_at']

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.bio = validated_data.get('bio', instance.bio)
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data.get('profile_picture')
        instance.save()
        return instance
    
    def get_books(self, obj):
        books = Book.objects.filter(uploaded_by=obj)
        return BookSerializer(books, many=True).data

    def get_followers(self, obj):
        followers = obj.followers.all()
        return UserProfileSerializer(followers, many=True).data
    
    def get_following(self, obj):
        following = obj.following.all()
        return UserProfileSerializer(following, many=True).data
    
    def get_books_liked(self, obj):
        books_liked = obj.books_liked.all()
        return BookSerializer(books_liked, many=True).data
    
    def get_total_books_uploaded(self, obj):
        return obj.books_uploaded.count()

class BookCollectionSerializer(serializers.ModelSerializer):
    book_count = serializers.SerializerMethodField()
    books = BookSerializer(many=True, read_only=True)

    class Meta:
        model = BookCollection
        fields = ['id', 'name', 'description', 'books', 'book_count', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def get_book_count(self, obj):
        return obj.books.count()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

# users/serializers.py


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['user_id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        # Add extra responses here
        data['username'] = self.user.username
        data['user_id'] = self.user.id
        data['first_name'] = self.user.first_name

        return data




class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'bio', 'profile_picture')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_picture = validated_data.pop('profile_picture', None)
        user = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            bio=validated_data.get('bio', ''),
        )
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        return user
