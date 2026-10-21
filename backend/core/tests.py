from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Asesor, Cliente, Lead, Plan


class AsesorLeadsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.asesor_user = User.objects.create_user(
            username='asesor-uno', password='test-password'
        )
        self.otro_asesor_user = User.objects.create_user(
            username='asesor-dos', password='test-password'
        )
        self.usuario_sin_perfil = User.objects.create_user(
            username='usuario-sin-perfil', password='test-password'
        )
        self.asesor = Asesor.objects.create(usuario=self.asesor_user)
        self.otro_asesor = Asesor.objects.create(usuario=self.otro_asesor_user)
        self.plan = Plan.objects.create(
            titulo='Plan de prueba',
            descripcion='Plan para pruebas de HU-13',
            destino='Cartagena',
            precio_referencia='1000000.00',
            incluye='Alojamiento',
        )

    def crear_lead(self, *, nombre, asesor):
        cliente = Cliente.objects.create(
            nombre_completo=nombre,
            email=f'{nombre.lower().replace(" ", ".")}@example.com',
            telefono='3001234567',
        )
        return Lead.objects.create(
            cliente=cliente,
            plan=self.plan,
            asesor=asesor,
            estado='NUEVO',
        )

    def test_lista_solo_leads_del_asesor_autenticado(self):
        lead_propio = self.crear_lead(nombre='Cliente Propio', asesor=self.asesor)
        lead_de_otro = self.crear_lead(
            nombre='Cliente Ajeno', asesor=self.otro_asesor
        )
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids_devueltos = {lead['id'] for lead in response.data}
        self.assertEqual(ids_devueltos, {lead_propio.id})
        self.assertNotIn(lead_de_otro.id, ids_devueltos)

    def test_solicitud_sin_autenticacion_es_rechazada(self):
        response = self.client.get('/api/asesor/leads/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_leads_sin_asesor_no_aparecen_en_listas(self):
        lead_sin_asesor = self.crear_lead(nombre='Cliente Sin Asesor', asesor=None)

        for usuario in (self.asesor_user, self.otro_asesor_user):
            self.client.force_authenticate(user=usuario)
            response = self.client.get('/api/asesor/leads/')

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertNotIn(
                lead_sin_asesor.id, {lead['id'] for lead in response.data}
            )

    def test_usuario_autenticado_sin_perfil_recibe_lista_vacia(self):
        self.crear_lead(nombre='Cliente Asignado', asesor=self.asesor)
        self.client.force_authenticate(user=self.usuario_sin_perfil)

        response = self.client.get('/api/asesor/leads/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class LeadCreateAPITests(TestCase):
    """Pruebas para HU-11: creación automática de Lead al enviar el formulario público."""

    def setUp(self):
        self.client = APIClient()
        self.plan = Plan.objects.create(
            titulo='Plan de prueba',
            descripcion='Plan para pruebas de HU-11',
            destino='Cartagena',
            precio_referencia='1000000.00',
            incluye='Alojamiento',
            activo=True,
        )
        self.plan_inactivo = Plan.objects.create(
            titulo='Plan inactivo',
            descripcion='No deberia poder asignarse',
            destino='San Andrés',
            precio_referencia='900000.00',
            incluye='Alojamiento',
            activo=False,
        )
        self.payload_valido = {
            'nombre_completo': 'Juana Pérez',
            'email': 'juana.perez@example.com',
            'telefono': '3001234567',
            'plan_id': self.plan.id,
            'presupuesto': '1200000.00',
            'observaciones': 'Prefiero vuelos en la mañana',
        }

    def test_envio_valido_crea_lead_con_estado_inicial_definido(self):
        response = self.client.post(
            '/api/leads/', self.payload_valido, format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)

        lead = Lead.objects.first()
        self.assertEqual(lead.estado, 'NUEVO')
        self.assertIn(lead.estado, dict(Lead.ESTADOS))

    def test_lead_contiene_la_informacion_del_cliente_y_queda_asociado_al_plan(self):
        self.client.post('/api/leads/', self.payload_valido, format='json')

        lead = Lead.objects.first()
        self.assertEqual(lead.plan_id, self.plan.id)
        self.assertEqual(lead.cliente.nombre_completo, 'Juana Pérez')
        self.assertEqual(lead.cliente.email, 'juana.perez@example.com')
        self.assertEqual(lead.cliente.telefono, '3001234567')

    def test_reutiliza_cliente_existente_con_el_mismo_email(self):
        Cliente.objects.create(
            nombre_completo='Juana Pérez',
            email='juana.perez@example.com',
            telefono='3001234567',
        )

        self.client.post('/api/leads/', self.payload_valido, format='json')

        self.assertEqual(Cliente.objects.count(), 1)
        self.assertEqual(Lead.objects.count(), 1)

    def test_no_crea_lead_si_faltan_campos_requeridos(self):
        payload_incompleto = {**self.payload_valido}
        del payload_incompleto['email']

        response = self.client.post(
            '/api/leads/', payload_incompleto, format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.count(), 0)

    def test_no_crea_lead_si_el_plan_no_existe(self):
        payload_plan_invalido = {**self.payload_valido, 'plan_id': 999999}

        response = self.client.post(
            '/api/leads/', payload_plan_invalido, format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.count(), 0)

    def test_no_crea_lead_si_el_plan_esta_inactivo(self):
        payload_plan_inactivo = {
            **self.payload_valido, 'plan_id': self.plan_inactivo.id
        }

        response = self.client.post(
            '/api/leads/', payload_plan_inactivo, format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.count(), 0)


class PlanListFilterAPITests(TestCase):
    """Pruebas para HU-05: filtrado del catálogo de planes."""

    def setUp(self):
        self.client = APIClient()
        self.plan_cartagena = Plan.objects.create(
            titulo='Escapada playera a Cartagena',
            descripcion='Disfruta del mar Caribe y la ciudad amurallada',
            destino='Cartagena',
            precio_referencia='1500000.00',
            incluye='Hospedaje, desayuno',
            activo=True,
        )
        self.plan_eje_cafetero = Plan.objects.create(
            titulo='Ruta del café',
            descripcion='Recorre fincas cafeteras y paisajes de montaña',
            destino='Eje Cafetero',
            precio_referencia='2500000.00',
            incluye='Tour guiado, transporte',
            activo=True,
        )
        self.plan_san_andres = Plan.objects.create(
            titulo='Playas de San Andrés',
            descripcion='Mar de siete colores todo incluido',
            destino='San Andrés',
            precio_referencia='4000000.00',
            incluye='Todo incluido',
            activo=True,
        )
        self.plan_inactivo = Plan.objects.create(
            titulo='Plan descontinuado',
            descripcion='No debería aparecer nunca',
            destino='Cartagena',
            precio_referencia='1000000.00',
            incluye='Nada',
            activo=False,
        )

    def test_sin_filtros_retorna_solo_planes_activos(self):
        response = self.client.get('/api/planes/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titulos = {plan['titulo'] for plan in response.data}
        self.assertEqual(
            titulos,
            {
                self.plan_cartagena.titulo,
                self.plan_eje_cafetero.titulo,
                self.plan_san_andres.titulo,
            },
        )

    def test_filtra_por_destino(self):
        response = self.client.get('/api/planes/', {'destino': 'cartagena'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], self.plan_cartagena.titulo)

    def test_filtra_por_rango_de_precio(self):
        response = self.client.get(
            '/api/planes/', {'precio_min': '2000000', 'precio_max': '3000000'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], self.plan_eje_cafetero.titulo)

    def test_filtra_por_texto_de_busqueda(self):
        response = self.client.get('/api/planes/', {'q': 'café'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], self.plan_eje_cafetero.titulo)

    def test_combina_multiples_filtros(self):
        response = self.client.get(
            '/api/planes/', {'destino': 'cartagena', 'precio_max': '2000000'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['titulo'], self.plan_cartagena.titulo)

    def test_sin_resultados_retorna_lista_vacia(self):
        response = self.client.get('/api/planes/', {'destino': 'Cancún'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
