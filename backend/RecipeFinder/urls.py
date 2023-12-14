"""
URL configuration for RecipeFinder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from RecipeFinder.views import sign_in, sign_up, CategoryListCreateView, CategoryRetrieveUpdateDestroyView, \
    RecipeListCreateView, RecipeRetrieveUpdateDestroyView, TagListCreateView, TagRetrieveUpdateDestroyView, UserProfileUpdateView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('login/', sign_in, name='login'),
    path('register/', sign_up, name='register'),

    path('tags/', TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/<int:pk>/', TagRetrieveUpdateDestroyView.as_view(), name='tag-retrieve-update-destroy'),

    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-retrieve-update-destroy'),

    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/<int:pk>/', RecipeRetrieveUpdateDestroyView.as_view(), name='recipe-retrieve-update-destroy'),

    path('profile/update/', UserProfileUpdateView.as_view(), name='update-profile'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)