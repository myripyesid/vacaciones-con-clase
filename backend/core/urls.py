# core/urls.py
from django.urls import path
from .views import LeadCreateAPIView, PlanListAPIView, PlanDetailAPIView, LeadCreateAPIView, SolicitudCreateAPIView

urlpatterns = [
    # GET /api/planes/ -> Ejecuta PlanListAPIView
    path('planes/', PlanListAPIView.as_view(), name='plan-list'),
    
    # GET /api/planes/1/ -> Ejecuta PlanDetailAPIView para el plan con ID 1
    path('planes/<int:pk>/', PlanDetailAPIView.as_view(), name='plan-detail'),
    # Endpoint de Solicitudes (POST)
    path('solicitudes/', SolicitudCreateAPIView.as_view(), name='solicitud-create'),
    # Endpoint para procesar la captura pública de Leads 
    path('leads/', LeadCreateAPIView.as_view(), name='registro-solicitud-lead'),
]
