from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone
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

        # Plan base (activo por defecto)
        self.plan = self.crear_plan_helper()

    def crear_plan_helper(self, titulo='Cartagena Mágica', destino='Cartagena', activo=True):
        return Plan.objects.create(
            titulo=titulo,
            descripcion='Disfruta de 4 días y 3 noches',
            destino=destino,
            precio_referencia='1850000.00',
            incluye='Tours y Hotel',
            activo=activo,
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

    def payload_solicitud(self, **overrides):
        """Payload válido para POST /api/solicitudes/ y /api/leads/."""
        payload = {
            'nombre_completo': 'María Fernanda Ospina',
            'email': 'maria@test.com',
            'telefono': '3009876543',
            'plan_id': self.plan.id,
        }
        payload.update(overrides)
        return payload


# ==========================================
# SECCIÓN 1: VISTA PÚBLICA (CLIENTES)
# ==========================================

class PlanListAPITests(TestBaseSetup):
    """GET /api/planes/ — catálogo público de planes (HU-5)."""

    def test_anonimo_obtiene_catalogo(self):
        """Happy Path: un usuario anónimo consulta el catálogo."""
        response = self.client.get('/api/planes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.plan.id)

    def test_estructura_de_cada_plan(self):
        """Cada plan expone exactamente los campos del PlanSerializer."""
        response = self.client.get('/api/planes/')
        self.assertEqual(
            set(response.data[0].keys()),
            {'id', 'titulo', 'descripcion', 'destino', 'precio_referencia', 'incluye'},
        )

    def test_precio_se_serializa_como_texto_decimal(self):
        """DRF devuelve los DecimalField como string, no como número."""
        response = self.client.get('/api/planes/')
        self.assertEqual(response.data[0]['precio_referencia'], '1850000.00')

    def test_no_expone_campos_internos(self):
        """Campos internos (activo, fecha_creacion) no deben salir en la API."""
        response = self.client.get('/api/planes/')
        self.assertNotIn('activo', response.data[0])
        self.assertNotIn('fecha_creacion', response.data[0])

    def test_solo_lista_planes_activos(self):
        """Los planes con activo=False no aparecen en el catálogo."""
        inactivo = self.crear_plan_helper(titulo='Plan Oculto', destino='Leticia', activo=False)
        response = self.client.get('/api/planes/')
        ids = {plan['id'] for plan in response.data}
        self.assertIn(self.plan.id, ids)
        self.assertNotIn(inactivo.id, ids)

    def test_lista_multiple_planes_activos(self):
        """Todos los planes activos se devuelven."""
        self.crear_plan_helper(titulo='San Andrés Total', destino='San Andrés')
        self.crear_plan_helper(titulo='Eje Cafetero', destino='Salento')
        response = self.client.get('/api/planes/')
        self.assertEqual(len(response.data), 3)

    def test_catalogo_vacio_retorna_lista_vacia(self):
        """Sin planes activos el endpoint responde 200 con lista vacía (no 404)."""
        Plan.objects.all().delete()
        response = self.client.get('/api/planes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_post_no_permitido(self):
        """POST no está permitido (la vista es solo lectura)."""
        response = self.client.post('/api/planes/', {'titulo': 'Hack'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Plan.objects.count(), 1)

    def test_put_patch_delete_no_permitidos_en_listado(self):
        for metodo in ('put', 'patch', 'delete'):
            with self.subTest(metodo=metodo):
                response = getattr(self.client, metodo)('/api/planes/', {}, format='json')
                self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class PlanDetailAPITests(TestBaseSetup):
    """GET /api/planes/<pk>/ — detalle público de un plan (HU-7)."""

    def test_anonimo_consulta_detalle(self):
        """Happy Path: devuelve los datos del plan solicitado."""
        response = self.client.get(f'/api/planes/{self.plan.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.plan.id)
        self.assertEqual(response.data['titulo'], 'Cartagena Mágica')
        self.assertEqual(response.data['destino'], 'Cartagena')
        self.assertEqual(response.data['incluye'], 'Tours y Hotel')
        self.assertEqual(response.data['precio_referencia'], '1850000.00')

    def test_estructura_del_detalle(self):
        response = self.client.get(f'/api/planes/{self.plan.id}/')
        self.assertEqual(
            set(response.data.keys()),
            {'id', 'titulo', 'descripcion', 'destino', 'precio_referencia', 'incluye'},
        )

    def test_devuelve_el_plan_correcto_entre_varios(self):
        otro = self.crear_plan_helper(titulo='San Andrés Total', destino='San Andrés')
        response = self.client.get(f'/api/planes/{otro.id}/')
        self.assertEqual(response.data['destino'], 'San Andrés')

    def test_plan_inexistente_retorna_404(self):
        response = self.client.get('/api/planes/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_plan_inactivo_retorna_404(self):
        """Un plan desactivado existe en BD pero no es visible para el público."""
        inactivo = self.crear_plan_helper(titulo='Plan Oculto', activo=False)
        response = self.client.get(f'/api/planes/{inactivo.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_pk_no_numerico_no_coincide_con_la_ruta(self):
        """La ruta usa <int:pk>, así que 'abc' ni siquiera llega a la vista."""
        response = self.client.get('/api/planes/abc/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_metodos_de_escritura_no_permitidos(self):
        for metodo in ('post', 'put', 'patch', 'delete'):
            with self.subTest(metodo=metodo):
                response = getattr(self.client, metodo)(
                    f'/api/planes/{self.plan.id}/', {'titulo': 'X'}, format='json'
                )
                self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.plan.refresh_from_db()
        self.assertEqual(self.plan.titulo, 'Cartagena Mágica')


class SolicitudCreateAPITests(TestBaseSetup):
    """POST /api/solicitudes/ — registro de solicitud (HU-6)."""

    def test_crea_cliente_y_lead(self):
        """Happy Path: responde 201 y persiste Cliente + Lead en estado NUEVO."""
        response = self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lead = Lead.objects.get(id=response.data['lead_id'])
        self.assertEqual(lead.estado, 'NUEVO')
        self.assertEqual(lead.plan, self.plan)
        self.assertEqual(lead.cliente.email, 'maria@test.com')
        self.assertEqual(Cliente.objects.count(), 1)

    def test_estructura_de_la_respuesta(self):
        response = self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        self.assertEqual(
            set(response.data.keys()), {'mensaje', 'lead_id', 'asesor_asignado'}
        )

    def test_guarda_campos_opcionales(self):
        payload = self.payload_solicitud(presupuesto='2500000.00', fechas_tentativas='2026-12-20')
        response = self.client.post('/api/solicitudes/', payload, format='json')
        lead = Lead.objects.get(id=response.data['lead_id'])
        self.assertEqual(str(lead.presupuesto), '2500000.00')
        self.assertEqual(str(lead.fechas_tentativas), '2026-12-20')

    def test_campos_opcionales_quedan_vacios(self):
        response = self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        lead = Lead.objects.get(id=response.data['lead_id'])
        self.assertIsNone(lead.presupuesto)
        self.assertIsNone(lead.fechas_tentativas)

    def test_asigna_asesor_disponible(self):
        """Solo se asignan asesores con disponible=True."""
        self.asesor.disponible = False
        self.asesor.save()
        response = self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        lead = Lead.objects.get(id=response.data['lead_id'])
        self.assertEqual(lead.asesor, self.otro_asesor)
        self.assertEqual(response.data['asesor_asignado'], 'asesor2')

    def test_sin_asesores_disponibles_queda_sin_asignar(self):
        Asesor.objects.update(disponible=False)
        response = self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['asesor_asignado'], 'Sin asignar')
        self.assertIsNone(Lead.objects.get(id=response.data['lead_id']).asesor)

    def test_reutiliza_cliente_con_mismo_email(self):
        """Dos solicitudes con el mismo email generan 1 Cliente y 2 Leads."""
        self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        self.client.post('/api/solicitudes/', self.payload_solicitud(), format='json')
        self.assertEqual(Cliente.objects.count(), 1)
        self.assertEqual(Lead.objects.count(), 2)

    def test_campos_requeridos_faltantes_retorna_400(self):
        response = self.client.post('/api/solicitudes/', {'email': 'x@test.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        for campo in ('nombre_completo', 'telefono', 'plan_id'):
            self.assertIn(campo, response.data)
        self.assertEqual(Lead.objects.count(), 0)

    def test_email_invalido_retorna_400(self):
        response = self.client.post(
            '/api/solicitudes/', self.payload_solicitud(email='no-es-email'), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_plan_inexistente_retorna_400(self):
        response = self.client.post(
            '/api/solicitudes/', self.payload_solicitud(plan_id=99999), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('plan_id', response.data)

    def test_plan_inactivo_retorna_400(self):
        inactivo = self.crear_plan_helper(titulo='Plan Oculto', activo=False)
        response = self.client.post(
            '/api/solicitudes/', self.payload_solicitud(plan_id=inactivo.id), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.count(), 0)

    def test_get_no_permitido(self):
        response = self.client.get('/api/solicitudes/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class LeadCreateAPITests(TestBaseSetup):
    """POST /api/leads/ — captura pública de leads (HU-10)."""

    def test_crea_lead_exitoso(self):
        """Happy Path: registro desde el formulario web (201, estado NUEVO)."""
        payload = self.payload_solicitud(
            fechas_tentativas='2026-12-20', observaciones='Viaje familiar'
        )
        response = self.client.post('/api/leads/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        lead = Lead.objects.get(id=response.data['data']['lead_id'])
        self.assertEqual(lead.estado, 'NUEVO')
        self.assertEqual(lead.observaciones, 'Viaje familiar')
        self.assertEqual(str(lead.fechas_tentativas), '2026-12-20')

    def test_estructura_de_la_respuesta(self):
        response = self.client.post('/api/leads/', self.payload_solicitud(), format='json')
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(
            set(response.data['data'].keys()),
            {'lead_id', 'cliente', 'plan', 'asesor_asignado'},
        )
        self.assertEqual(response.data['data']['cliente'], 'María Fernanda Ospina')
        self.assertEqual(response.data['data']['plan'], 'Cartagena Mágica')

    def test_asigna_primer_asesor_registrado(self):
        response = self.client.post('/api/leads/', self.payload_solicitud(), format='json')
        lead = Lead.objects.get(id=response.data['data']['lead_id'])
        self.assertEqual(lead.asesor, self.asesor)
        self.assertEqual(response.data['data']['asesor_asignado'], 'asesor1')

    def test_sin_asesores_registrados_queda_sin_asignar(self):
        Asesor.objects.all().delete()
        response = self.client.post('/api/leads/', self.payload_solicitud(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['asesor_asignado'], 'Sin asignar')

    def test_acepta_presupuesto_y_fecha_nula(self):
        payload = self.payload_solicitud(presupuesto='3000000.00', fechas_tentativas=None)
        response = self.client.post('/api/leads/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        lead = Lead.objects.get(id=response.data['data']['lead_id'])
        self.assertEqual(str(lead.presupuesto), '3000000.00')
        self.assertIsNone(lead.fechas_tentativas)

    def test_ignora_campos_desconocidos(self):
        """Campos que el serializer no define (ej. numero_viajeros) se descartan sin error."""
        payload = self.payload_solicitud(numero_viajeros='2')
        response = self.client.post('/api/leads/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_reutiliza_cliente_con_mismo_email(self):
        self.client.post('/api/leads/', self.payload_solicitud(), format='json')
        self.client.post('/api/leads/', self.payload_solicitud(), format='json')
        self.assertEqual(Cliente.objects.count(), 1)
        self.assertEqual(Lead.objects.count(), 2)

    def test_campos_faltantes_retorna_400(self):
        response = self.client.post('/api/leads/', {'email': 'incompleto@test.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        for campo in ('nombre_completo', 'telefono', 'plan_id'):
            self.assertIn(campo, response.data)

    def test_error_no_deja_registros_a_medias(self):
        """Una solicitud inválida no crea Cliente ni Lead."""
        self.client.post('/api/leads/', self.payload_solicitud(plan_id=99999), format='json')
        self.assertEqual(Cliente.objects.count(), 0)
        self.assertEqual(Lead.objects.count(), 0)

    def test_email_invalido_retorna_400(self):
        response = self.client.post(
            '/api/leads/', self.payload_solicitud(email='no-es-email'), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_plan_inexistente_retorna_400(self):
        response = self.client.post(
            '/api/leads/', self.payload_solicitud(plan_id=99999), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('plan_id', response.data)

    def test_plan_inactivo_retorna_400(self):
        inactivo = self.crear_plan_helper(titulo='Plan Oculto', activo=False)
        response = self.client.post(
            '/api/leads/', self.payload_solicitud(plan_id=inactivo.id), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_telefono_demasiado_largo_retorna_400(self):
        response = self.client.post(
            '/api/leads/', self.payload_solicitud(telefono='1' * 21), format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('telefono', response.data)

    def test_get_no_permitido(self):
        response = self.client.get('/api/leads/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


# ==========================================
# SECCIÓN 2: PANEL DE ASESORES
# ==========================================

class AsesorLeadsListAPITests(TestBaseSetup):
    """GET /api/asesor/leads/ — leads del asesor autenticado (HU-13, HU-14)."""

    def test_sin_autenticacion_retorna_401(self):
        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_lista_solo_leads_del_asesor_autenticado(self):
        lead_propio = self.crear_lead_helper(nombre='Cliente Propio', asesor=self.asesor)
        lead_ajeno = self.crear_lead_helper(nombre='Cliente Ajeno', asesor=self.otro_asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = {lead['id'] for lead in response.data}
        self.assertIn(lead_propio.id, ids)
        self.assertNotIn(lead_ajeno.id, ids)

    def test_no_incluye_leads_sin_asesor(self):
        sin_asignar = self.crear_lead_helper(nombre='Sin Asignar', asesor=None)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/')
        self.assertNotIn(sin_asignar.id, {lead['id'] for lead in response.data})

    def test_estructura_de_cada_lead(self):
        self.crear_lead_helper(nombre='Ana Pérez', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/')
        lead = response.data[0]
        self.assertEqual(
            set(lead.keys()),
            {
                'id', 'cliente_nombre', 'cliente_email', 'cliente_telefono',
                'plan_nombre', 'plan_destino', 'presupuesto', 'fechas_tentativas',
                'estado', 'observaciones', 'fecha_creacion',
            },
        )
        self.assertEqual(lead['cliente_nombre'], 'Ana Pérez')
        self.assertEqual(lead['plan_nombre'], 'Cartagena Mágica')
        self.assertEqual(lead['plan_destino'], 'Cartagena')

    def test_orden_mas_reciente_primero(self):
        viejo = self.crear_lead_helper(nombre='Viejo', asesor=self.asesor)
        nuevo = self.crear_lead_helper(nombre='Nuevo', asesor=self.asesor)
        # auto_now_add no se puede fijar en create(); se ajusta con update().
        ahora = timezone.now()
        Lead.objects.filter(id=viejo.id).update(fecha_creacion=ahora - timedelta(days=2))
        Lead.objects.filter(id=nuevo.id).update(fecha_creacion=ahora)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/')
        self.assertEqual([l['id'] for l in response.data], [nuevo.id, viejo.id])

    def test_asesor_sin_leads_retorna_lista_vacia(self):
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_usuario_sin_perfil_de_asesor_recibe_lista_vacia(self):
        self.crear_lead_helper(nombre='Alguien', asesor=self.asesor)
        self.client.force_authenticate(user=self.usuario_sin_perfil)
        response = self.client.get('/api/asesor/leads/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_filtra_solo_leads_nuevos(self):
        lead_nuevo = self.crear_lead_helper(nombre='Ana', estado='NUEVO', asesor=self.asesor)
        self.crear_lead_helper(nombre='Luis', estado='CONTACTADO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get('/api/asesor/leads/?estado=NUEVO')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([l['id'] for l in response.data], [lead_nuevo.id])

    def test_filtra_por_cada_estado_valido(self):
        for codigo, _ in Lead.ESTADOS:
            self.crear_lead_helper(nombre=f'Lead {codigo}', estado=codigo, asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        for codigo, _ in Lead.ESTADOS:
            with self.subTest(estado=codigo):
                response = self.client.get(f'/api/asesor/leads/?estado={codigo}')
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(len(response.data), 1)
                self.assertEqual(response.data[0]['estado'], codigo)

    def test_filtro_es_insensible_a_mayusculas(self):
        lead = self.crear_lead_helper(nombre='Ana', estado='NUEVO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/?estado=nuevo')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([l['id'] for l in response.data], [lead.id])

    def test_filtro_no_mezcla_leads_de_otro_asesor(self):
        self.crear_lead_helper(nombre='Ajeno', estado='NUEVO', asesor=self.otro_asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/?estado=NUEVO')
        self.assertEqual(response.data, [])

    def test_filtro_estado_invalido_retorna_400(self):
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/?estado=ESTADO_INVALIDO')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('estado', response.data)

    def test_filtro_estado_vacio_devuelve_todos(self):
        self.crear_lead_helper(nombre='Ana', estado='NUEVO', asesor=self.asesor)
        self.crear_lead_helper(nombre='Luis', estado='GANADO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/?estado=')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_metodos_de_escritura_no_permitidos(self):
        self.client.force_authenticate(user=self.asesor_user)
        for metodo in ('post', 'put', 'patch', 'delete'):
            with self.subTest(metodo=metodo):
                response = getattr(self.client, metodo)('/api/asesor/leads/', {}, format='json')
                self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class AsesorLeadDetailAPITests(TestBaseSetup):
    """GET /api/asesor/leads/<pk>/ — detalle de un lead (HU-15)."""

    def test_sin_autenticacion_retorna_401(self):
        lead = self.crear_lead_helper(nombre='Ana', asesor=self.asesor)
        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_consultar_detalle_lead_propio(self):
        lead = self.crear_lead_helper(nombre='Ana Pérez', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)

        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], lead.id)
        self.assertEqual(response.data['cliente']['email'], 'ana.pérez@test.com')

    def test_estructura_del_detalle(self):
        lead = self.crear_lead_helper(nombre='Ana Pérez', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(
            set(response.data.keys()),
            {
                'id', 'estado', 'estado_display', 'cliente', 'plan', 'presupuesto',
                'fechas_tentativas', 'observaciones', 'fecha_creacion',
            },
        )
        self.assertEqual(
            set(response.data['cliente'].keys()),
            {'nombre_completo', 'email', 'telefono', 'fecha_registro'},
        )
        self.assertEqual(response.data['plan']['id'], self.plan.id)

    def test_estado_display_legible(self):
        lead = self.crear_lead_helper(nombre='Ana', estado='NEGOCIACION', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.data['estado'], 'NEGOCIACION')
        self.assertEqual(response.data['estado_display'], 'En Negociación')

    def test_lead_ajeno_retorna_404(self):
        """Un asesor no puede ver leads de otro (404, no 403, para no revelar que existe)."""
        lead_ajeno = self.crear_lead_helper(nombre='Pedro', asesor=self.otro_asesor)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get(f'/api/asesor/leads/{lead_ajeno.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_lead_sin_asesor_retorna_404(self):
        lead = self.crear_lead_helper(nombre='Huérfano', asesor=None)
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_lead_inexistente_retorna_404(self):
        self.client.force_authenticate(user=self.asesor_user)
        response = self.client.get('/api/asesor/leads/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_usuario_sin_perfil_retorna_404(self):
        lead = self.crear_lead_helper(nombre='Ana', asesor=self.asesor)
        self.client.force_authenticate(user=self.usuario_sin_perfil)
        response = self.client.get(f'/api/asesor/leads/{lead.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_metodos_de_escritura_no_permitidos(self):
        """La vista es RetrieveAPIView: aún no existe forma de editar un lead por API."""
        lead = self.crear_lead_helper(nombre='Carlos', estado='NUEVO', asesor=self.asesor)
        self.client.force_authenticate(user=self.asesor_user)
        for metodo in ('post', 'put', 'patch', 'delete'):
            with self.subTest(metodo=metodo):
                response = getattr(self.client, metodo)(
                    f'/api/asesor/leads/{lead.id}/', {'estado': 'CONTACTADO'}, format='json'
                )
                self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        lead.refresh_from_db()
        self.assertEqual(lead.estado, 'NUEVO')