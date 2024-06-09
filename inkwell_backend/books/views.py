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
        logger.info("Received book upload request")
        logger.info(f"Request data: {request.data}")

        try:
            response = super().create(request, *args, **kwargs)
            logger.info(f"Response data: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



