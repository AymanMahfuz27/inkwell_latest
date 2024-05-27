# recommendations/serializers.py
from rest_framework import serializers
from .models import Recommendation

class RecommendationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    book = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = Recommendation
        fields = ['id', 'user', 'book', 'score', 'created_at']
