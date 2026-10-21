
## 🛠️ Configuración y Poblamiento de la Base de Datos (Data Seeding)

Durante la fase de desarrollo del backend para **Vacaciones con Clase**, se implementó un flujo automatizado de generación de datos de prueba (seeding) y validación de la arquitectura API REST.

---

### 1. Generación Automática de Datos de Prueba

Para poblar la base de datos local (`db.sqlite3`) con registros realistas en español sin necesidad de ingresarlos manualmente, se creó un comando de gestión personalizado en Django (`custom management command`) ubicado en `core/management/commands/seed_db.py`.

#### **Características del Seeder:**
* **Uso de la librería `Faker` (localización `es_CO` / `es_ES`):** Genera nombres, correos, teléfonos y descripciones acordes al contexto local.
* **Modelos Poblabos:** 
  * **Asesores:** Crea usuarios autenticables de Django (`User`) vinculados automáticamente a perfiles de `Asesor`.
  * **Planes Turísticos:** Genera itinerarios vacacionales con destinos populares, precios de referencia estructurados e inclusiones.
  * **Clientes & Leads:** Genera oportunidades de venta asociando clientes con planes y asignándolos a asesores según su estado (`NUEVO`, `CONTACTADO`, `NEGOCIACION`, `GANADO`, `PERDIDO`).
  * **Ventas:** Registra automáticamente la transacción financiera cuando un `Lead` pasa a estado `GANADO`.

---

### 2. Instrucciones para Poblar la Base de Datos

Si estás clonando el repositorio por primera vez o restableciendo la base de datos local, sigue estos pasos:

#### **Paso 1: Instalar dependencias**
Asegúrate de tener la librería `faker` instalada en tu entorno virtual:
```bash
pip install faker

```

#### **Paso 2: Aplicar migraciones**

Crea la estructura de tablas necesaria en la base de datos:

```bash
python manage.py migrate

```

#### **Paso 3: Ejecutar el comando de poblamiento**

Ejecuta el comando personalizado `seed_db`. Puedes especificar cuántos registros/leads deseas generar utilizando el parámetro `--total` (por defecto genera 20):

```bash
# Generar 30 registros de prueba
python manage.py seed_db --total 30

```

---

### 3. Pruebas y Validación de la API

Para probar los endpoints del backend de manera independiente antes de conectar el frontend (React/Vite):

1. **Iniciar el servidor de desarrollo:**
```bash
python manage.py runserver

```


2. **Importar y probar con Postman:**
* La API responde en la URL base `http://127.0.0.1:8000/api/`.
* **Endpoints habilitados:**
* `GET /api/planes/` — Consulta de catálogo de paquetes turísticos.
* `POST /api/leads/` — Envío de solicitudes desde formulario web público.
* `PATCH /api/leads/{id}/` — Actualización de estados por parte de los asesores.


* *Nota:* Asegúrate de incluir la barra diagonal al final (`/`) en las URLs de Django REST Framework y configurar el Header `Content-Type: application/json` al enviar peticiones `POST` o `PATCH`.


