"""
URL configuration for inkwell_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# urls.py

from django.conf import settings
from django.urls import include, path
from django.http import HttpResponse
from django.conf.urls.static import static
from django.urls import get_resolver
from rest_framework.routers import DefaultRouter
from books.views import GenreViewSet, BookViewSet





def home(request):
    return HttpResponse('Welcome to the Inkwell API!')

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'genres', GenreViewSet, basename='genre')
urlpatterns = [
    #need a home page
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/ads/', include('ads.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/uploads/', include('uploads.urls')),
    path('api/books/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

#print out all the endpoints
endpoints = set(v[1] for k,v in get_resolver(None).reverse_dict.items())

print("All Endpoints:")
for i in endpoints:
    print(i)
print('\n\n')