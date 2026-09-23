# core/urls.py
from django.urls import path
from .views import (
    AsesorLeadsView,
    LeadCreateAPIView,
    PlanListAPIView,
    PlanDetailAPIView,
    SolicitudCreateAPIView,
)

urlpatterns = [
    path('planes/', PlanListAPIView.as_view(), name='plan-list'),
    path('planes/<int:pk>/', PlanDetailAPIView.as_view(), name='plan-detail'),
    path('solicitudes/', SolicitudCreateAPIView.as_view(), name='solicitud-create'),
    path('leads/', LeadCreateAPIView.as_view(), name='registro-solicitud-lead'),
    path('asesor/leads/', AsesorLeadsView.as_view(), name='asesor-leads'),  # <-- Se agrega /
]