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


class AsesorLeadsNuevosAPITests(TestCase):
    """HU-14: identificar nuevos leads."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='asesor', password='x')
        self.asesor = Asesor.objects.create(usuario=self.user)
        self.otro = Asesor.objects.create(
            usuario=User.objects.create_user(username='otro', password='x')
        )
        self.plan = Plan.objects.create(
            titulo='Plan', descripcion='d', destino='Cartagena',
            precio_referencia='1000000.00', incluye='Hotel',
        )

    def crear(self, nombre, estado, asesor=None):
        cliente = Cliente.objects.create(
            nombre_completo=nombre, email=f'{nombre}@x.co', telefono='300'
        )
        return Lead.objects.create(
            cliente=cliente, plan=self.plan, asesor=asesor or self.asesor, estado=estado
        )

    def test_filtra_solo_nuevos_propios(self):
        nuevo = self.crear('ana', 'NUEVO')
        self.crear('luis', 'CONTACTADO')
        self.crear('eva', 'NUEVO', asesor=self.otro)
        self.client.force_authenticate(self.user)

        r = self.client.get('/api/asesor/leads/?estado=NUEVO')

        self.assertEqual(r.status_code, 200)
        self.assertEqual([l['id'] for l in r.data], [nuevo.id])

    def test_filtro_tolera_minusculas_legacy(self):
        legacy = self.crear('old', 'nuevo')
        self.client.force_authenticate(self.user)
        r = self.client.get('/api/asesor/leads/?estado=nuevo')
        self.assertEqual([l['id'] for l in r.data], [legacy.id])

    def test_estado_invalido_400(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get('/api/asesor/leads/?estado=XYZ').status_code, 400)

    def test_orden_mas_reciente_primero_e_incluye_destino(self):
        a = self.crear('a', 'NUEVO')
        b = self.crear('b', 'NUEVO')
        self.client.force_authenticate(self.user)
        r = self.client.get('/api/asesor/leads/')
        self.assertEqual([l['id'] for l in r.data], [b.id, a.id])
        self.assertEqual(r.data[0]['plan_destino'], 'Cartagena')

    def test_formulario_publico_crea_lead_NUEVO_en_mayusculas(self):
        r = self.client.post('/api/leads/', {
            'nombre_completo': 'Cliente Web', 'email': 'web@x.co',
            'telefono': '3001112233', 'plan_id': self.plan.id,
        }, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Lead.objects.get(id=r.data['data']['lead_id']).estado, 'NUEVO')


class AsesorLeadDetailAPITests(TestCase):
    """HU-15: consultar un lead."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='asesor', password='x')
        self.asesor = Asesor.objects.create(usuario=self.user)
        self.otro = Asesor.objects.create(
            usuario=User.objects.create_user(username='otro', password='x')
        )
        self.plan = Plan.objects.create(
            titulo='Cartagena Total', descripcion='d', destino='Cartagena',
            precio_referencia='1500000.00', incluye='Hotel y tour',
        )
        cliente = Cliente.objects.create(
            nombre_completo='Ana Pérez', email='ana@x.co', telefono='3001234567'
        )
        self.lead = Lead.objects.create(
            cliente=cliente, plan=self.plan, asesor=self.asesor,
            presupuesto='2000000.00', observaciones='Prefiere diciembre',
        )
        self.lead_ajeno = Lead.objects.create(
            cliente=cliente, plan=self.plan, asesor=self.otro
        )

    def test_detalle_propio(self):
        self.client.force_authenticate(self.user)
        r = self.client.get(f'/api/asesor/leads/{self.lead.id}/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['cliente']['email'], 'ana@x.co')
        self.assertEqual(r.data['cliente']['telefono'], '3001234567')
        self.assertEqual(r.data['plan']['titulo'], 'Cartagena Total')
        self.assertEqual(r.data['estado'], 'NUEVO')
        self.assertEqual(r.data['estado_display'], 'Nuevo')
        self.assertEqual(r.data['observaciones'], 'Prefiere diciembre')

    def test_detalle_de_otro_asesor_404(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get(f'/api/asesor/leads/{self.lead_ajeno.id}/').status_code, 404)

    def test_detalle_inexistente_404(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get('/api/asesor/leads/99999/').status_code, 404)

    def test_detalle_sin_auth_401(self):
        self.assertEqual(self.client.get(f'/api/asesor/leads/{self.lead.id}/').status_code, 401)
