# users/views.py
from rest_framework import viewsets, generics,status
from .models import UserProfile, BookCollection
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer, BookCollectionSerializer,CustomTokenObtainPairSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from books.models import Book
from django.db.models import Q



class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'

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

    def create(self, request, *args, **kwargs):
        print("Request data: ", request.data)
        response = super().create(request, *args, **kwargs)
        user = UserProfile.objects.get(username=response.data['username'])
        refresh = RefreshToken.for_user(user)
        response.data['refresh'] = str(refresh)
        response.data['access'] = str(refresh.access_token)
        return response

# Simplified login view
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print("Login request received.")
    print("Request data:", request.data)
    serializer = CustomTokenObtainPairSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
        print("Serializer validation successful.")
    except Exception as e:
        print("Serializer validation failed. Error:", str(e))
        return Response({"detail": "Invalid credentials"}, status=400)
    print("Login successful. Sending response...")
    return Response(serializer.validated_data, status=200)
