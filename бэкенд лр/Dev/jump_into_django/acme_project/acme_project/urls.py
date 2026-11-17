from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('homepage.urls')),      # Главная
    path('about/', include('about.urls')),   # О нас
    path('catalog/', include('catalog.urls')) # Каталог
]