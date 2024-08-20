from django.shortcuts import render

from rest_framework import viewsets, status,permissions, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
import logging
from rest_framework.response import Response
from .models import Genre, Book, Comment, BookDraft
from .serializers import GenreSerializer, BookSerializer, BookInteractionSerializer, CommentSerializer, BookDraftSerializer
from rest_framework.decorators import action
import PyPDF2

logger = logging.getLogger(__name__)

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'name'

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            genres = Genre.search(query)
            serializer = self.get_serializer(genres, many=True)
            return Response(serializer.data)
        return Response([])
    
    @action(detail=True, methods=['get'])
    def books(self, request, name=None):
        genre = self.get_object()
        books = Book.objects.filter(genres__name=name)
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)

    
    def list(self, request):
        genres = self.get_queryset()
        serializer = self.get_serializer(genres, many=True)
        for genre_data in serializer.data:
            genre_data['book_count'] = Book.objects.filter(genres__name=genre_data['name']).count()
        return Response(serializer.data)





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
                book = serializer.save(uploaded_by=request.user)
                headers = self.get_success_headers(serializer.data)
                logger.info(f"Book created successfully: {book.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except Exception as e:
                logger.error(f"Error creating book: {str(e)}")
                return Response({"detail": "An error occurred while creating the book."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





    def perform_create(self, serializer):
        return serializer.save(uploaded_by=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save()
        serializer = self.get_serializer(instance, context={'request': request})
        data = serializer.data
        data['is_following_author'] = request.user.is_following(instance.uploaded_by) if request.user.is_authenticated else False
        return Response(data)


    
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

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def by_genre(self, request):
        genre_id = request.query_params.get('genre_id')
        if genre_id:
            books = Book.objects.filter(genres__id=genre_id)
            serializer = self.get_serializer(books, many=True)
            return Response(serializer.data)
        return Response({"error": "genre_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)





class BookDraftViewSet(viewsets.ModelViewSet):
    queryset = BookDraft.objects.all()
    serializer_class = BookDraftSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        return BookDraft.objects.filter(user=self.request.user)



    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        logger.info(f"Updating draft with ID: {instance.id}")
        logger.info(f"Request data: {request.data}")

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()


    @action(detail=False, methods=['get'])
    def user_drafts(self, request):
        drafts = self.get_queryset()
        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)

