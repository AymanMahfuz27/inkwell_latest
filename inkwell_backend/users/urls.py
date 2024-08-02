# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, BookCollectionViewSet, RegisterView, CustomTokenObtainPairView, login_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'collections', BookCollectionViewSet, basename='collection')  # Add basename here

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
