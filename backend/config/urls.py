# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Toda URL que empiece con 'api/' será manejada por las rutas de tu app 'core'
    path('api/', include('core.urls')), 
]