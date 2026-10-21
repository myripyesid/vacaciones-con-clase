from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Asesor, Cliente, Lead, Plan


class TestBaseSetup(TestCase):
    """Clase base con utilidades compartidas para la creación de datos de prueba."""

    def setUp(self):
        self.client = APIClient()

        # Usuarios y Asesores
        self.asesor_user = User.objects.create_user(
            username='asesor1', password='password123'
        )
        self.otro_asesor_user = User.objects.create_user(
            username='asesor2', password='password123'
        )
        self.usuario_sin_perfil = User.objects.create_user(
            username='sinperfil', password='password123'
        )

        self.asesor = Asesor.objects.create(usuario=self.asesor_user)
        self.otro_asesor = Asesor.objects.create(usuario=self.otro_asesor_user)

        # Plan base
        self.plan = Plan.objects.create(
            titulo='Cartagena Mágica',
            descripcion='Disfruta de 4 días y 3 noches',
            destino='Cartagena',
            precio_referencia='1850000.00',
            incluye='Tours y Hotel',
        )

    def crear_lead_helper(self, nombre='Cliente Test', estado='NUEVO', asesor=None, plan=None):
        cliente = Cliente.objects.create(
            nombre_completo=nombre,
            email=f'{nombre.lower().replace(" ", ".")}@test.com',
            telefono='3001234567',
        )
        return Lead.objects.create(
            cliente=cliente,
            plan=plan or self.plan,
            asesor=asesor,
            estado=estado,
            fechas_tentativas='2026-12-15',
            observaciones='Sin comentarios',
        )


# ==========================================
# SECCIÓN 1: VISTA PÚBLICA (CLIENTES)
# ==========================================

class HU5CatálogoPlanesAPITests(TestBaseSetup):
    """HU-5: Ver catálogo de planes turísticos."""

    def test_obtener_catalogo_planes_exitoso(self):
        """Happy Path: Un usuario anónimo puede consultar el catálogo completo de planes."""
        response = self.client.get('/api/planes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_catalogo_planes_metodo_no_permitido(self):
        """Flujo Alternativo: Intentar modificar el catálogo mediante POST no está permitido."""
        response = self.client.post('/api/planes/', {'titulo': 'Hack'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class HU7DetallePlanAPITests(TestBaseSetup):
    """HU-7: Ver detalle de un plan específico."""

    def test_consultar_detalle_plan_existente(self):
        """Happy Path: Consultar la información detallada de un plan existente."""
        response = self.client.get(f'/api/planes/{self.plan.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['destino'], 'Cartagena')

    def test_consultar_detalle_plan_inexistente_retorna_404(self):
        """Flujo Alternativo: Intentar consultar un plan inexistente retorna HTTP 404."""
        response = self.client.get('/api/planes/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class HU10RegistrarSolicitudAPITests(TestBaseSetup):
    """HU-10: Confirmar envío de solicitud (Registrar Lead)."""

    def test_crear_solicitud_lead_exitoso(self):
        """Happy Path: Registro exitoso desde el formulario web (retorna 201)."""
        payload = {
            'nombre_completo': 'María Fernanda Ospina',
            'email': 'maria@test.com',
            'telefono': '3009876543',
            'plan_id': self.plan.id,
            'numero_viajeros': '2',
            'fechas_tentativas': '2026-12-20',
            'observaciones': 'Viaje familiar'
        }
        response = self.client.post('/api/leads/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.get(id=response.data['data']['lead_id']).estado, 'NUEVO')

    def test_crear_solicitud_lead_campos_faltantes_retorna_400(self):
        """Flujo Alternativo: La solicitud es rechazada si faltan datos requeridos."""
        payload = {'email': 'incompleto@test.com'}
        response = self.client.post('/api/leads/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ==========================================
# SECCIÓN 2: PANEL DE ASESORES
# ==========================================

class HU8SubpanelRendimientoAPITests(TestBaseSetup):
    """HU-8: Ver métricas y subpanel de rendimiento."""

    def test_obtener_metricas_rendimiento_asesor_autenticado(self):
        """Happy Path: El asesor autenticado consulta su resumen de rendimiento."""
        self.crear_lead_helper(nombre='Lead 1', estado='NUEVO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/metricas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_metricas_sin_autenticacion_retorna_401(self):
        """Flujo Alternativo: Intento de consulta de métricas sin autenticación."""
        response = self.client.get('/api/asesor/metricas/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class HU9EmbudoVentasAPITests(TestBaseSetup):
    """HU-9: Visualizar pipeline / embudo de ventas."""

    def test_consultar_embudo_ventas_asesor(self):
        """Happy Path: Obtener la distribución de leads agrupados por estado."""
        self.crear_lead_helper(nombre='Lead Embudo', estado='EN_PROCESO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/pipeline/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_embudo_ventas_usuario_sin_perfil(self):
        """Flujo Alternativo: Usuario autenticado sin perfil de asesor recibe respuesta vacía/controlada."""
        self.client.force_authenticate(user=self.usuario_sin_perfil)
        response = self.client.get('/api/asesor/pipeline/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN])


class HU11TablaResumenLeadsAPITests(TestBaseSetup):
    """HU-11: Consultar la tabla general resumen de gestión."""

    def test_obtener_tabla_resumen_leads(self):
        """Happy Path: Obtener tabla consolidada de gestión de leads."""
        self.crear_lead_helper(nombre='Lead Resumen', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/resumen/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tabla_resumen_sin_autenticacion(self):
        """Flujo Alternativo: Acceso bloqueado a la tabla de resumen sin credenciales."""
        response = self.client.get('/api/asesor/resumen/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class HU12PanelControlGraficoAPITests(TestBaseSetup):
    """HU-12: Ver gráficos interactivos de control de gestión."""

    def test_obtener_datos_graficos_panel_control(self):
        """Happy Path: Obtener datos procesados para los gráficos del dashboard."""
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/dashboard-graficos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_graficos_metodo_http_invalido(self):
        """Flujo Alternativo: Solicitudes que no sean GET son rechazadas."""
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.post('/api/asesor/dashboard-graficos/', {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class HU13LeadsAsignadosAPITests(TestBaseSetup):
    """HU-13: Ver lista de leads asignados exclusivamente al asesor."""

    def test_lista_solo_leads_del_asesor_autenticado(self):
        """Happy Path: Se listan únicamente los leads asignados al asesor en sesión."""
        lead_propio = self.crear_lead_helper(nombre='Cliente Propio', asesor=self.asesor)
        lead_ajeno = self.crear_lead_helper(nombre='Cliente Ajeno', asesor=self.otro_asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids_devueltos = {lead['id'] for lead in response.data}
        self.assertIn(lead_propio.id, ids_devueltos)
        self.assertNotIn(lead_ajeno.id, ids_devueltos)

    def test_lista_leads_sin_autenticacion_retorna_401(self):
        """Flujo Alternativo: Intento de listar leads sin autenticación."""
        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class HU14NuevosLeadsFiltroAPITests(TestBaseSetup):
    """HU-14: Identificar y filtrar nuevos leads."""

    def test_filtra_solo_leads_nuevos(self):
        """Happy Path: Filtrar correctamente por estado=NUEVO."""
        lead_nuevo = self.crear_lead_helper(nombre='Ana', estado='NUEVO', asesor=self.asesor)
        self.crear_lead_helper(nombre='Luis', estado='CONTACTADO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/?estado=NUEVO')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([l['id'] for l in response.data], [lead_nuevo.id])

    def test_filtro_estado_invalido_retorna_400(self):
        """Flujo Alternativo: Usar un filtro de estado inexistente retorna error 400."""
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/?estado=ESTADO_INVALIDO')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class HU15ConsultarLeadDetailAPITests(TestBaseSetup):
    """HU-15: Consultar detalle completo de un lead."""

    def test_consultar_detalle_lead_propio(self):
        """Happy Path: Ver información detallada de un lead asignado."""
        lead = self.crear_lead_helper(nombre='Ana Pérez', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['cliente']['email'], 'ana.pérez@test.com')

    def test_consultar_detalle_lead_ajeno_retorna_404(self):
        """Flujo Alternativo: Intentar consultar un lead de otro asesor retorna 404."""
        lead_ajeno = self.crear_lead_helper(nombre='Pedro', asesor=self.otro_asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get(f'/api/asesor/leads/{lead_ajeno.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class HU16ContactoClienteAPITests(TestBaseSetup):
    """HU-16: Registrar primer contacto con el cliente."""

    def test_registrar_contacto_cliente_exitoso(self):
        """Happy Path: Cambiar estado del lead a CONTACTADO tras el primer contacto."""
        lead = self.crear_lead_helper(nombre='Carlos', estado='NUEVO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        payload = {'estado': 'CONTACTADO', 'observaciones': 'Se envió propuesta por WhatsApp'}
        response = self.client.patch(f'/api/asesor/leads/{lead.id}/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        lead.refresh_from_db()
        self.assertEqual(lead.estado, 'CONTACTADO')

    def test_registrar_contacto_lead_inexistente_retorna_404(self):
        """Flujo Alternativo: Intentar actualizar un lead inexistente retorna 404."""
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.patch('/api/asesor/leads/99999/', {'estado': 'CONTACTADO'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)