from django.contrib import admin
from .models import UserProfile, BookCollection

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(BookCollection)