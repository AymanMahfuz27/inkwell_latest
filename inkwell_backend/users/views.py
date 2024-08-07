# users/views.py
from rest_framework import viewsets, generics,status
from .models import UserProfile, BookCollection
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer, BookCollectionSerializer,CustomTokenObtainPairSerializer, RegisterSerializer, FollowSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from books.models import Book
from rest_framework.parsers import MultiPartParser, FormParser
from books.serializers import BookSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, get_user_model
from django.db.models import F





class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        username = self.kwargs.get('username')
        if username == 'undefined':
            return UserProfile.objects.filter(id=self.request.user.id)
        return UserProfile.objects.filter(username=username)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if the user is updating their own profile
        if instance != request.user:
            return Response({"detail": "You do not have permission to edit this profile."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            users = UserProfile.search(query)
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
        return Response([])
    
    @action(detail=True, methods=['get'])
    def books(self, request, username=None):
        user = self.get_object()
        books = Book.objects.filter(uploaded_by=user)
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


    @action(detail=True, methods=['delete'], parser_classes=[JSONParser])
    def delete_book(self, request, username=None):
        user = self.get_object()
        if user != request.user:
            return Response({"detail": "You don't have permission to delete this book."}, status=status.HTTP_403_FORBIDDEN)
        
        book_id = request.data.get('book_id')
        if not book_id:
            return Response({"detail": "Book ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            book = Book.objects.get(id=book_id, uploaded_by=user)
            book.delete()
            return Response({"detail": "Book deleted successfully."}, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'])
    def liked_books(self, request, username=None):
        user = self.get_object()
        if user != request.user:
            return Response({"detail": "You don't have permission to view this."}, status=status.HTTP_403_FORBIDDEN)
        liked_books = user.books_liked.all()
        serializer = BookSerializer(liked_books, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def follow(self, request, username=None):
        user_to_follow = self.get_object()
        if request.user.is_following(user_to_follow):
            return Response({'detail': 'You are already following this user.'}, status=status.HTTP_400_BAD_REQUEST)
        request.user.follow(user_to_follow)
        return Response({'detail': 'You are now following this user.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, username=None):
        user_to_unfollow = self.get_object()
        if not request.user.is_following(user_to_unfollow):
            return Response({'detail': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)
        request.user.unfollow(user_to_unfollow)
        return Response({'detail': 'You have unfollowed this user.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def followers(self, request, username=None):
        user = self.get_object()
        followers = user.get_followers()
        serializer = self.get_serializer(followers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def following(self, request, username=None):
        user = self.get_object()
        following = user.get_following()
        serializer = self.get_serializer(following, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

   







class BookCollectionViewSet(viewsets.ModelViewSet):
    serializer_class = BookCollectionSerializer
    permission_classes = [IsAuthenticated]
    queryset = BookCollection.objects.all()  # Add this line

    def get_queryset(self):
        return BookCollection.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_book(self, request, pk=None):
        collection = self.get_object()
        book = get_object_or_404(Book, pk=request.data.get('book_id'))
        collection.books.add(book)
        return Response({'status': 'book added to collection'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_book(self, request, pk=None):
        collection = self.get_object()
        book = get_object_or_404(Book, pk=request.data.get('book_id'))
        collection.books.remove(book)
        return Response({'status': 'book removed from collection'})



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        print("Request data: ", request.data)
        response = super().create(request, *args, **kwargs)
        user = UserProfile.objects.get(username=response.data['username'])
        refresh = RefreshToken.for_user(user)
        response.data['refresh'] = str(refresh)
        response.data['access'] = str(refresh.access_token)
        return response

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                validate_password(request.data['password'])
            except ValidationError as e:
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()

# Simplified login view
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print("Login request received.")
    print("Request data:", request.data)
    
    username_or_email = request.data.get('username')  # Assuming the field is named 'username' in the frontend
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response({"detail": "Both username/email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the input is an email
    if '@' in username_or_email:
        try:
            user = User.objects.get(email=username_or_email)
            username = user.username
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        username = username_or_email

    user = authenticate(username=username, password=password)

    if user:
        serializer = CustomTokenObtainPairSerializer(data={'username': username, 'password': password})
        try:
            serializer.is_valid(raise_exception=True)
            print("Serializer validation successful.")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Serializer validation failed. Error:", str(e))
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

