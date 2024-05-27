# uploads/serializers.py
from rest_framework import serializers
from .models import Upload

class UploadSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    book = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Upload
        fields = ['id', 'file', 'uploaded_at', 'uploaded_by', 'book']
