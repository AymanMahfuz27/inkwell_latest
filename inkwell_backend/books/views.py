from django.shortcuts import render
# books/views.py
# books/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Genre, Book
from .serializers import GenreSerializer, BookSerializer
import logging
from rest_framework.response import Response



class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated]

logger = logging.getLogger(__name__)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        logger.info(f"User {request.user.username} is attempting to create a book")
        logger.info(f"Request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            logger.info("Serializer is valid")
            try:
                book = self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                logger.info(f"Book created successfully: {book.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except Exception as e:
                logger.error(f"Error creating book: {str(e)}")
                return Response({"detail": "Book created successfully, but there was an error processing some data."}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        return serializer.save(uploaded_by=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        if instance.content:
            data['content'] = instance.content
        logger.info(f"Retrieving book: {instance.id}, Content length: {len(data.get('content', ''))}")
        return Response(data)

