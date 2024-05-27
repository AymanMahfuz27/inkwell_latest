from django.shortcuts import render
# comments/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Comment, Like, Dislike
from .serializers import CommentSerializer, LikeSerializer, DislikeSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

class DislikeViewSet(viewsets.ModelViewSet):
    queryset = Dislike.objects.all()
    serializer_class = DislikeSerializer
    permission_classes = [IsAuthenticated]
