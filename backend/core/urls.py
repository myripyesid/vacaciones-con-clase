# core/urls.py
from django.urls import path
from .views import PlanListAPIView, PlanDetailAPIView, SolicitudCreateAPIView

urlpatterns = [
    # GET /api/planes/ -> Ejecuta PlanListAPIView
    path('planes/', PlanListAPIView.as_view(), name='plan-list'),
    
    # GET /api/planes/1/ -> Ejecuta PlanDetailAPIView para el plan con ID 1
    path('planes/<int:pk>/', PlanDetailAPIView.as_view(), name='plan-detail'),
    # Endpoint de Solicitudes (POST)
    path('solicitudes/', SolicitudCreateAPIView.as_view(), name='solicitud-create'),
]