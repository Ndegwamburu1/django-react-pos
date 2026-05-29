from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


def home(request):
    return redirect('http://localhost:5173')


urlpatterns = [
    path('', home),

    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),

    path('api/', include('products.urls')),
    path('api/', include('sales.urls')),

    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    
]
