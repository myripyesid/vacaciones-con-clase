# core/urls.py
from django.urls import path
from .views import AsesorLeadsView, LeadCreateAPIView, PlanListAPIView, PlanDetailAPIView, LeadCreateAPIView, SolicitudCreateAPIView

urlpatterns = [
    
    path('planes/', PlanListAPIView.as_view(), name='plan-list'),
    path('planes/<int:pk>/', PlanDetailAPIView.as_view(), name='plan-detail'),

    # Endpoint de Solicitudes (POST)
    path('solicitudes/', SolicitudCreateAPIView.as_view(), name='solicitud-create'),
    # Endpoint para procesar la captura pública de Leads 
    path('leads/', LeadCreateAPIView.as_view(), name='registro-solicitud-lead'),
    #Endpoint para ver los leads asignados a un asesor
    path('asesor/leads', AsesorLeadsView.as_view(), name='asesor-leads' ),
]
