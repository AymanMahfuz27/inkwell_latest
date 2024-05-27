from django.shortcuts import render
# uploads/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Upload
from .serializers import UploadSerializer

class UploadViewSet(viewsets.ModelViewSet):
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer
    permission_classes = [IsAuthenticated]
