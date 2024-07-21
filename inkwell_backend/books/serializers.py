# books/serializers.py
from rest_framework import serializers
from .models import Genre, Book
import logging

logger = logging.getLogger(__name__)



class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    genres = serializers.ListField(child=serializers.CharField(), write_only=True)
    genre_names = serializers.SerializerMethodField(read_only=True)
    cover_picture = serializers.SerializerMethodField()
    banner_picture = serializers.SerializerMethodField()
    pdf_file = serializers.SerializerMethodField()
    uploaded_by = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'genres', 'genre_names', 'content', 'pdf_file',
                  'description', 'cover_picture', 'banner_picture', 'uploaded_by',
                  'upload_date', 'likes', 'dislikes', 'read_count', 'comments', 'recommendations']
        read_only_fields = ['uploaded_by', 'upload_date', 'likes', 'dislikes', 'read_count', 'comments', 'recommendations']

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

    def create(self, validated_data):
        genres_data = validated_data.pop('genres', [])
        book = Book.objects.create(**validated_data)
        for genre_name in genres_data:
            genre, created = Genre.objects.get_or_create(name=genre_name.strip())
            book.genres.add(genre)
        return book