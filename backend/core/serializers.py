# core/serializers.py
from rest_framework import serializers # type: ignore
from .models import Plan, Cliente, Lead, Asesor

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'titulo', 'descripcion', 'destino', 'precio_referencia', 'incluye']


class SolicitudCrearSerializer(serializers.Serializer):
    """
    Serializador de entrada: Define los campos exactos que el formulario 
    del frontend enviará en el JSON de la petición POST.
    """
    # Datos del Cliente
    nombre_completo = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=20)
    
    # Datos de la Solicitud / Lead
    plan_id = serializers.IntegerField()
    presupuesto = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    fechas_tentativas = serializers.DateField(required=False)

    def validate_plan_id(self, value):
        """
        Validación personalizada: Comprueba que el plan realmente exista en la BD.
        """
        if not Plan.objects.filter(id=value, activo=True).exists():
            raise serializers.ValidationError("El plan seleccionado no existe o no está activo.")
        return value

class LeadCreateSerializer(serializers.Serializer):
    #Campos de entrada
    nombre_completo = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=20)
    plan_id = serializers.IntegerField()
    presupuesto = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    fechas_tentativas = serializers.DateField(required=False, allow_null=True)
    observaciones = serializers.CharField(required=False, allow_blank=True)

    def validate_plan_id(self, value):
        if not Plan.objects.filter(id=value, activo=True).exists():
            raise serializers.ValidationError("El plan seleccionado no existe en el catalogo")
        return value