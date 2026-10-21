from django.db import transaction
from django.db.models import Q
from django.shortcuts import render
from rest_framework import generics # type: ignore
from .models import Plan
from .serializers import LeadCreateSerializer, PlanSerializer, LeadCreateSerializer
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from .models import Plan, Cliente, Lead, Asesor
from .serializers import SolicitudCrearSerializer, LeadSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Vista para HU-01, HU-02 y HU-05 (Listar el catálogo y filtrarlo por criterios)
class PlanListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PlanSerializer

    def get_queryset(self):
        """
        Acepta filtros opcionales por query params:
        ?destino=Cartagena&precio_min=1000000&precio_max=3000000&q=playa
        """
        queryset = Plan.objects.filter(activo=True)
        params = self.request.query_params

        destino = params.get('destino')
        if destino:
            queryset = queryset.filter(destino__iexact=destino)

        precio_min = params.get('precio_min')
        if precio_min:
            try:
                queryset = queryset.filter(precio_referencia__gte=float(precio_min))
            except ValueError:
                pass

        precio_max = params.get('precio_max')
        if precio_max:
            try:
                queryset = queryset.filter(precio_referencia__lte=float(precio_max))
            except ValueError:
                pass

        texto = params.get('q')
        if texto:
            queryset = queryset.filter(
                Q(titulo__icontains=texto)
                | Q(descripcion__icontains=texto)
                | Q(destino__icontains=texto)
            )

        return queryset

# Vista para HU-03 y HU-04 (Detalle de un plan específico)
class PlanDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Plan.objects.filter(activo=True)
    serializer_class = PlanSerializer

class SolicitudCreateAPIView(APIView):
    permission_classes = [AllowAny]
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
            "asesor_asignado": str(asesor_asignado.usuario) if asesor_asignado and asesor_asignado.usuario else "Sin asignar"
        }, status=status.HTTP_201_CREATED)

class LeadCreateAPIView(APIView):
    permission_classes = [AllowAny]
    """
    Endpoint para procesar la captura pública de Leads (HU-06).
    Acepta peticiones POST con la información de contacto y preferencia de plan.
    """
    def post(self, request):
        # 1. Pasar los datos de la petición HTTP (request.data) al serializador
        serializer = LeadCreateSerializer(data=request.data)
        
        # 2. Ejecutar validaciones. Si falla, interrumpe el flujo y retorna un HTTP 400 con los detalles.
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 3. Extracción de datos validados
        data = serializer.validated_data

        # 4. Uso de Bloque Transaccional (ACID)
        # Garantiza que si falla la creación del Lead, tampoco se cree el Cliente a medias en la BD.
        with transaction.atomic():
            # a. Buscar o Crear el Cliente (Evita duplicados si el usuario vuelve a cotizar)
            cliente, _ = Cliente.objects.get_or_create(
                email=data['email'],
                defaults={
                    'nombre_completo': data['nombre_completo'],
                    'telefono': data['telefono']
                }
            )

            # b. Obtener el objeto Plan ya validado previamente
            plan = Plan.objects.get(id=data['plan_id'])

            # c. Algoritmo simple de asignación de Asesor
            # Busca al primer asesor disponible; si no hay ninguno registrado, asigna None.
            asesor_asignado = Asesor.objects.first()

            # d. Crear el registro del Lead
            lead = Lead.objects.create(
                cliente=cliente,
                plan=plan,
                asesor=asesor_asignado,
                presupuesto=data.get('presupuesto'),
                fechas_tentativas=data.get('fechas_tentativas'),
                observaciones=data.get('observaciones', ''),
                estado='NUEVO'  # Estado inicial por defecto
            )

        # 5. Construcción de la respuesta exitosa (HTTP 201 Created)
        respuesta = {
            "status": "success",
            "mensaje": "Solicitud registrada correctamente.",
            "data": {
                "lead_id": lead.id,
                "cliente": cliente.nombre_completo,
                "plan": plan.titulo,
                "asesor_asignado": str(asesor_asignado.usuario) if asesor_asignado and asesor_asignado.usuario else "Sin asignar"
            }
        }
        return Response(respuesta, status=status.HTTP_201_CREATED)

class AsesorLeadsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leads = Lead.objects.filter(asesor__usuario = request.user)
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data)