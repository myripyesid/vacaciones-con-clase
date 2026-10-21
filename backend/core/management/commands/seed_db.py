from datetime import date, timedelta
import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker

from core.models import Plan, Cliente, Asesor, Lead, Venta

fake = Faker(['es_CO', 'es_ES'])

DESTINOS = [
    'San Andrés', 'Cartagena', 'Eje Cafetero', 'Santa Marta',
    'Cancún', 'Punta Cana', 'Curazao', 'Amazonas', 'Capurganá'
]

INCLUYE_OPTIONS = [
    "Tiquetes aéreos, Hospedaje 4 noches, Alimentación completa, Traslados.",
    "Alojamiento con desayuno, Tour guiado, Seguro de viaje.",
    "Todo incluido (comidas, bebidas ilimitadas, deportes acuáticos).",
    "Tiquetes aéreos, Hotel boutique, Tour de ciudad y tarjeta de asistencia."
]

FECHAS_TENTATIVAS = [
    "Semanas de junio", "Mediados de julio", "Primera semana de agosto",
    "Vacaciones de diciembre", "Semana Santa", "Fines de octubre"
]

class Command(BaseCommand):
    help = 'Pobla la base de datos de Vacaciones con Clase con datos falsos de prueba'

    def add_arguments(self, parser):
        parser.add_argument('--total', type=int, default=20, help='Número de leads a generar')

    def handle(self, *args, **kwargs):
        total = kwargs['total']
        self.stdout.write(self.style.WARNING('Iniciando generación de datos de prueba...'))

        # 1. Crear Asesores (Usuarios de Django + Asesor)
        asesores = []
        for _ in range(4):
            first_name = fake.first_name()
            last_name = fake.last_name()
            username = f"{first_name.lower()}.{last_name.lower()}"

            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': fake.email(),
                    'first_name': first_name,
                    'last_name': last_name
                }
            )
            if created:
                user.set_password('password123')
                user.save()

            asesor, _ = Asesor.objects.get_or_create(usuario=user, defaults={'disponible': True})
            asesores.append(asesor)

        self.stdout.write(self.style.SUCCESS(f' Creados/Verificados {len(asesores)} Asesores.'))

        # 2. Crear Planes Turísticos
        planes = []
        for _ in range(8):
            destino = random.choice(DESTINOS)
            plan = Plan.objects.create(
                titulo=f"Plan Vacacional {destino} {fake.word().capitalize()}",
                descripcion=fake.paragraph(nb_sentences=3),
                destino=destino,
                precio_referencia=round(random.uniform(1200000, 5500000), -4),
                incluye=random.choice(INCLUYE_OPTIONS),
                activo=True
            )
            planes.append(plan)

        self.stdout.write(self.style.SUCCESS(f' Creados {len(planes)} Planes turísticos.'))

        # 3. Crear Clientes
        clientes = []
        for _ in range(total):
            cliente = Cliente.objects.create(
                nombre_completo=fake.name(),
                email=fake.unique.email(),
                telefono=fake.phone_number()
            )
            clientes.append(cliente)

        self.stdout.write(self.style.SUCCESS(f' Creados {len(clientes)} Clientes.'))

        # 4. Crear Leads y Ventas
        ventas_count = 0
        for cliente in clientes:
            plan = random.choice(planes)
            estado = random.choice(['NUEVO', 'CONTACTADO', 'NEGOCIACION', 'GANADO', 'PERDIDO'])
            asesor = random.choice(asesores) if estado != 'NUEVO' else None

            lead = Lead.objects.create(
                cliente=cliente,
                plan=plan,
                asesor=asesor,
                presupuesto=round(random.uniform(1000000, 6000000), -4),
                fechas_tentativas = fake.date_between(start_date='today', end_date='+1y'),
                estado=estado,
                observaciones=fake.sentence()
            )

            # Si el lead se concretó, registrar la Venta
            if estado == 'GANADO':
                Venta.objects.create(
                    lead=lead,
                    monto_final=lead.presupuesto or plan.precio_referencia
                )
                ventas_count += 1

        self.stdout.write(self.style.SUCCESS(f' Creados {total} Leads y {ventas_count} Ventas.'))
        self.stdout.write(self.style.SUCCESS(' Base de datos poblada exitosamente!'))