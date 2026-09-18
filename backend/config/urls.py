# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from core.views import AsesorLeadsView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Toda URL que empiece con 'api/' será manejada por las rutas de tu app 'core'
    path('api/', include('core.urls')), 
    path('api/login/', obtain_auth_token, name='api-login'),  # Endpoint para obtener token de autenticación
   path('asesor/leads/', AsesorLeadsView.as_view(), name='asesor-leads'),
]

