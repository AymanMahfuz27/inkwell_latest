# users/views.py
from rest_framework import viewsets, generics
from .models import UserProfile, BookCollection
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer, BookCollectionSerializer,CustomTokenObtainPairSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

class BookCollectionViewSet(viewsets.ModelViewSet):
    queryset = BookCollection.objects.all()
    serializer_class = BookCollectionSerializer
    permission_classes = [IsAuthenticated]


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
