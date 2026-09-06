from django.shortcuts import render
from rest_framework import generics
from .models import Plan
from .serializers import PlanSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Plan, Cliente, Lead, Asesor
from .serializers import SolicitudCrearSerializer

# Vista para HU-01 y HU-02 (Listar todo el catálogo)
class PlanListAPIView(generics.ListAPIView):
    # 1. ¿Qué datos vamos a buscar en la base de datos?
    queryset = Plan.objects.filter(activo=True) 
    
    # 2. ¿Quién se encarga de traducir estos objetos a JSON?
    serializer_class = PlanSerializer

# Vista para HU-03 y HU-04 (Detalle de un plan específico)
class PlanDetailAPIView(generics.RetrieveAPIView):
    queryset = Plan.objects.filter(activo=True)
    serializer_class = PlanSerializer



class SolicitudCreateAPIView(APIView):
    """
    Endpoint para HU-06: Recibe la solicitud del cliente, registra o actualiza 
    sus datos, asigna un asesor automáticamente y crea el Lead.
    """
    def post(self, request):
        # 1. Pasar los datos recibidos (request.data) al serializador para validar
        serializer = SolicitudCrearSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Si faltan campos o son inválidos, responde con error HTTP 400 Bad Request
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. Extraer los datos ya validados
        data = serializer.validated_data
        
        # 3. Crear o recuperar el Cliente (evita duplicar si el email ya existe)
        cliente, _ = Cliente.objects.get_or_create(
            email=data['email'],
            defaults={
                'nombre_completo': data['nombre_completo'],
                'telefono': data['telefono']
            }
        )
        
        # 4. Obtener el Plan asociado
        plan = Plan.objects.get(id=data['plan_id'])
        
        # 5. REGLA DE NEGOCIO: Asignación automática de Asesor (Round Robin / Rotación)
        # Busca al asesor disponible que tenga la menor cantidad de leads asignados
        asesor_asignado = Asesor.objects.filter(disponible=True).first()
        
        # 6. Guardar la entidad Lead en la BD
        nuevo_lead = Lead.objects.create(
            cliente=cliente,
            plan=plan,
            asesor=asesor_asignado,
            presupuesto=data.get('presupuesto'),
            fechas_tentativas=data.get('fechas_tentativas'),
            estado='NUEVO'
        )
        
        # 7. Retornar respuesta exitosa HTTP 201 Created con el ID generado
        return Response({
            "mensaje": "Solicitud registrada con éxito.",
            "lead_id": nuevo_lead.id,
            "asesor_asignado": asesor_asignado.usuario.get_full_name() if asesor_asignado else "Sin asignar"
        }, status=status.HTTP_201_CREATED)