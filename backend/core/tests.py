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
