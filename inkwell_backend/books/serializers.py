# books/serializers.py
from rest_framework import serializers
from .models import Genre, Book, Comment
import logging

logger = logging.getLogger(__name__)


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'updated_at']


class BookInteractionSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    recent_comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'like_count', 'is_liked', 'view_count', 'recent_comments']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.likes.filter(id=user.id).exists()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['recent_comments'] = CommentSerializer(
            instance.comments.all()[:5], many=True
        ).data
        return data



class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    genres = serializers.ListField(child=serializers.CharField(), write_only=True)
    genre_names = serializers.SerializerMethodField(read_only=True)
    cover_picture = serializers.ImageField(required=False, allow_null=True)
    banner_picture = serializers.ImageField(required=False, allow_null=True)
    pdf_file = serializers.FileField(required=False, allow_null=True)
    uploaded_by = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    view_count = serializers.ReadOnlyField()
    content = serializers.CharField(allow_blank=True, required=False)


    class Meta:
        model = Book
        fields = ['id', 'title', 'genres', 'genre_names', 'content', 'pdf_file',
                  'description', 'cover_picture', 'banner_picture', 'uploaded_by',
                  'upload_date', 'like_count', 'is_liked', 'view_count']
        read_only_fields = ['uploaded_by', 'upload_date','like_count', 'is_liked', 'view_count']

    def get_genre_names(self, obj):
        return [genre.name for genre in obj.genres.all()]
    
    def get_cover_picture(self, obj):
        if obj.cover_picture:
            return self.context['request'].build_absolute_uri(obj.cover_picture.url)
        return None

    def get_banner_picture(self, obj):
        if obj.banner_picture:
            return self.context['request'].build_absolute_uri(obj.banner_picture.url)
        return None
    
    def get_pdf_file(self, obj):
        if obj.pdf_file:
            return self.context['request'].build_absolute_uri(obj.pdf_file.url)
        return None
    
    def get_uploaded_by(self, obj):
        return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}"

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.likes.filter(id=user.id).exists()

    def validate_content(self, value):
        # You might want to add additional validation here
        return value
    def create(self, validated_data):
        genres_data = validated_data.pop('genres', [])
        book = Book.objects.create(**validated_data)
        for genre_name in genres_data:
            genre, created = Genre.objects.get_or_create(name=genre_name.strip())
            book.genres.add(genre)
        logger.info(f"Book created: {book}")
        return book