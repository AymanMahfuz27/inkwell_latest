# comments/serializers.py
from rest_framework import serializers
from .models import Comment, Like, Dislike

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    book = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'book', 'text', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    book = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Like
        fields = ['id', 'user', 'book', 'created_at']

class DislikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    book = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Dislike
        fields = ['id', 'user', 'book', 'created_at']
