from django.shortcuts import render

from rest_framework import viewsets, status,permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
import logging
from rest_framework.response import Response
from .models import Genre, Book, Comment
from .serializers import GenreSerializer, BookSerializer, BookInteractionSerializer, CommentSerializer
from rest_framework.decorators import action
import PyPDF2



class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            genres = Genre.search(query)
            serializer = self.get_serializer(genres, many=True)
            return Response(serializer.data)
        return Response([])


logger = logging.getLogger(__name__)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()


    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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
        instance.view_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    
    @action(detail=True, methods=['get'])
    def interactions(self, request, pk=None):
        book = self.get_object()
        serializer = BookInteractionSerializer(book, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        book = self.get_object()
        user = request.user
        if book.likes.filter(id=user.id).exists():
            book.likes.remove(user)
            liked = False
        else:
            book.likes.add(user)
            liked = True
        return Response({
            'status': 'success',
            'liked': liked,
            'like_count': book.likes.count()
        })


    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def comments(self, request, pk=None):
        book = self.get_object()
        if request.method == 'GET':
            comments = book.comments.all().order_by('-created_at')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, book=book)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def page_count(self, request, pk=None):
        book = self.get_object()
        if book.pdf_file:
            with book.pdf_file.open('rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                page_count = len(pdf_reader.pages)
            return Response({'page_count': page_count})
        return Response({'page_count': 'N/A'}, status=400)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            books = Book.search(query)
            serializer = self.get_serializer(books, many=True)
            return Response(serializer.data)
        return Response([])




