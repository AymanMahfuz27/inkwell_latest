# books/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GenreViewSet, BookViewSet, BookDraftViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'genres', GenreViewSet, basename='genre')
router.register(r'drafts', BookDraftViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
