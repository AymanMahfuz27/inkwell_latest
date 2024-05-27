from django.shortcuts import render
# ads/views.py
# ads/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ad
from .serializers import AdSerializer

class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticated]
