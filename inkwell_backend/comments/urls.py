# comments/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet, LikeViewSet, DislikeViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'dislikes', DislikeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
