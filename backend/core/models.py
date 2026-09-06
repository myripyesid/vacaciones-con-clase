# core/models.py
from django.db import models
from django.contrib.auth.models import User  # Usaremos la clase User de Django para los Asesores

class Plan(models.Model):
    """
    Representa los paquetes turísticos ofrecidos por la agencia.
    """
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    destino = models.CharField(max_length=100)
    precio_referencia = models.DecimalField(max_digits=10, decimal_places=2)
    incluye = models.TextField(help_text="Servicios incluidos en el plan")
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.destino}"


class Cliente(models.Model):
    """
    Representa a la persona que proporciona sus datos mediante el formulario web.
    """
    nombre_completo = models.CharField(max_length=150)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"


class Asesor(models.Model):
    """
    Perfil del asesor en el sistema. Vinculado a un Usuario autenticable de Django.
    """
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_asesor')
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"Asesor: {self.usuario.get_full_name() or self.usuario.username}"


class Lead(models.Model):
    """
    Representa la solicitud / oportunidad de venta asociada a un plan y asignada a un asesor.
    """
    ESTADOS = [
        ('NUEVO', 'Nuevo'),
        ('CONTACTADO', 'Contactado'),
        ('NEGOCIACION', 'En Negociación'),
        ('GANADO', 'Venta Concretada'),
        ('PERDIDO', 'Venta Perdida'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='leads')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='leads')
    asesor = models.ForeignKey(Asesor, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    
    presupuesto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fechas_tentativas = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='NUEVO')
    observaciones = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lead #{self.id} - {self.cliente.nombre_completo} ({self.estado})"


class Venta(models.Model):
    """
    Registro formal de una venta concretada a partir de un Lead.
    """
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='venta')
    monto_final = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_venta = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Venta de Lead #{self.lead.id} - ${self.monto_final}"