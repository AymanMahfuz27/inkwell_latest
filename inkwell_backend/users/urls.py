# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, BookCollectionViewSet

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'collections', BookCollectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
