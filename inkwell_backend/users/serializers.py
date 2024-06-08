# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, BookCollection
from books.serializers import BookSerializer, GenreSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    liked_books = BookSerializer(many=True, read_only=True)
    favorite_genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture', 'followers', 'following', 'liked_books', 'favorite_genres','visitors', 'visited_profiles', 'created_at']

class BookCollectionSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)

    class Meta:
        model = BookCollection
        fields = ['id', 'name', 'description', 'books', 'created_at', 'updated_at']

# users/serializers.py


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        print("Validating user credentials...")
        print("Username:", username)
        print("Password:", password)

        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            data = super().validate(attrs)
            data.update({
                'user_id': user.id,
                'username': user.username
            })
            print("Validation successful. User data:", data)
            return data
        else:
            print("Invalid username or password")
            raise serializers.ValidationError('Invalid username or password')



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'bio')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            bio=validated_data.get('bio', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
