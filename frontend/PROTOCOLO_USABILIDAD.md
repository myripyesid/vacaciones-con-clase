# Protocolo de pruebas de usabilidad

## Objetivo

Observar si personas que representan a clientes potenciales y asesores pueden completar las tareas habituales del frontend, comprender la información presentada y recuperarse de errores sin instrucciones sobre dónde hacer clic. El protocolo guía una evaluación futura; no contiene resultados de sesiones ejecutadas.

## Alcance

Se evaluarán las vistas públicas de inicio, catálogo y detalle de planes, el formulario para solicitar un viaje, la información de contacto y el acceso al portal. En el portal se evaluarán la vista general, la lista de leads, la búsqueda, el filtro de estado y el cierre de sesión. No se evaluarán reglas de negocio internas ni la seguridad del backend.

## Participantes recomendados

Se recomienda reclutar entre 5 y 8 participantes: personas que hayan buscado viajes recientemente o puedan representar a un cliente potencial, y asesores o personas familiarizadas con el seguimiento comercial. Procurar incluir variedad de experiencia digital y al menos dos personas de cada perfil cuando la disponibilidad lo permita. Registrar el perfil sin incluir datos personales innecesarios. Esta cantidad es una recomendación para descubrir problemas cualitativos, no una muestra estadística.

## Materiales y preparación

- Equipo con navegador actualizado y resolución de escritorio; preparar también un teléfono o ventana estrecha para tareas de cliente si el tiempo lo permite.
- Entorno de demostración estable con planes de ejemplo, leads ficticios y una cuenta de asesor de prueba. No usar datos personales ni enviar solicitudes a producción.
- Hoja de registro de tareas y hallazgos incluida en este documento, cronómetro y permiso explícito para tomar notas. Grabar pantalla o audio solo con consentimiento.
- Antes de cada sesión, comprobar que catálogo y portal cargan, que la cuenta de prueba funciona y que las solicitudes se dirigen al entorno de prueba. Restablecer la sesión y los datos entre participantes.
- Duración sugerida de sesión: aproximadamente 30 a 45 minutos, incluyendo bienvenida, tareas y preguntas finales. Adaptar la duración según el participante; no usarla como criterio de éxito.

## Guion neutral para moderación

1. Explicar: “Estamos evaluando la interfaz, no tus habilidades. Nos sirve que pienses en voz alta mientras haces las tareas. No hay respuestas correctas y puedes detenerte cuando quieras”.
2. Pedir consentimiento antes de tomar notas o grabar. Aclarar que se usarán datos ficticios y que no se enviará información real.
3. Leer cada tarea tal como aparece, sin indicar controles, rutas ni nombres de botones. Si la persona pregunta cómo continuar, responder: “¿Qué intentarías hacer normalmente?” y registrar la petición de ayuda.
4. No corregir ni guiar durante la tarea. Si la persona queda bloqueada, esperar unos segundos y luego ofrecer una pista neutral, registrándola como ayuda.
5. Al finalizar cada tarea, preguntar “¿Qué esperabas que ocurriera?” y “¿Hubo algo que te resultara confuso?”. No sugerir una respuesta.
6. Cerrar agradeciendo y permitir que la persona añada comentarios. No interpretar observaciones como resultados hasta revisar todas las sesiones.

## Tareas para el flujo de cliente

| ID | Tarea que se lee a la persona | Criterio observable de éxito |
|---|---|---|
| C1 | “Estás pensando en viajar y quieres encontrar una opción para Cartagena. Busca un plan que te interese y consulta sus detalles.” | Llega al catálogo, encuentra un plan de Cartagena y abre su detalle. |
| C2 | “En el detalle, revisa qué incluye el viaje y vuelve a la lista de planes.” | Identifica al menos un elemento incluido y regresa a los planes sin perderse. |
| C3 | “Quieres que un asesor te contacte por este plan. Envía una solicitud con los datos de prueba que te entregamos.” | Completa los campos obligatorios con datos ficticios y llega a la respuesta de envío del entorno de prueba. |
| C4 | “Encuentra una forma de contactar a la empresa y dime qué canales o datos aparecen.” | Localiza la sección de contacto y comunica correctamente los datos visibles. |
| C5 | “Eres asesor y quieres entrar al portal. Inicia sesión con las credenciales de prueba.” | Abre el acceso de asesor, completa credenciales de prueba y llega al panel autenticado. |

## Tareas para el flujo de asesor

| ID | Tarea que se lee a la persona | Criterio observable de éxito |
|---|---|---|
| A1 | “Busca el lead de Ana Pérez en tu lista.” | Navega a Leads y localiza a Ana Pérez sin ayuda. |
| A2 | “Confirma el correo y el teléfono de contacto de ese lead.” | Encuentra y lee correctamente el correo y teléfono mostrados para Ana Pérez. |
| A3 | “Ahora encuentra el lead relacionado con el plan San Andrés.” | Usa la búsqueda y deja visible el lead correcto. |
| A4 | “Muestra solo los leads con una venta realizada.” | Aplica el filtro de estado y deja visible únicamente los leads correspondientes a venta realizada. |
| A5 | “Vuelve al resumen del panel y cierra tu sesión.” | Navega al panel y termina en la vista pública o de acceso, sin token de sesión activo. |

## Registro por tarea

Registrar éxito con estas categorías: **sin ayuda**, **con ayuda neutral** o **no completada**. Medir el tiempo desde que termina la lectura hasta que la persona declara haber terminado o abandona la tarea. Contar errores observables (selección equivocada, búsqueda fallida, retroceso no intencionado, envío incompleto, etc.) y anotar cualquier ayuda ofrecida. No comparar tiempos entre participantes sin tener en cuenta el contexto.

| Participante (código) | Perfil (cliente/asesor) | Tarea | Éxito (sin ayuda/con ayuda/no) | Tiempo | Errores observados | Ayuda requerida | Notas neutrales |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

## Preguntas posteriores

Hacer las mismas preguntas principales a cada participante y permitir respuestas abiertas:

- ¿Qué tan fácil o difícil te resultó completar las tareas? ¿Qué influyó en esa impresión?
- ¿Qué información o términos no quedaron claros?
- ¿En qué momento dudaste sobre qué hacer después?
- ¿Qué esperabas que ocurriera al enviar la solicitud o cerrar sesión?
- Si pudieras cambiar una cosa de la experiencia, ¿cuál sería?
- Para asesores: ¿pudiste distinguir con claridad el cliente, el plan y el estado del lead?
- Para clientes: ¿tuviste suficiente información para decidir si solicitar contacto?

| Participante (código) | Perfil | Facilidad percibida (escala usada en sesión) | Elementos confusos | Comentarios o sugerencias |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## Registro de hallazgos

Describir lo observado y el contexto, sin atribuir intención. Separar el comportamiento observado de la interpretación y de la recomendación.

| ID | Tarea / pantalla | Evidencia observada | Problema e impacto para la persona | Frecuencia (sesiones afectadas / sesiones válidas) | Severidad | Recomendación | Prioridad |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

## Priorización de problemas y recomendaciones

Asignar severidad según el efecto observable:

- **Crítica:** impide completar una tarea esencial, causa pérdida de datos o expone información sensible.
- **Alta:** produce errores repetidos o requiere ayuda para completar una tarea importante.
- **Media:** genera confusión o rodeos, pero la persona encuentra una forma de continuar.
- **Baja:** detalle menor que no cambia el resultado de la tarea.

Priorizar primero por severidad y después por frecuencia observada. Si dos problemas tienen igual severidad, atender antes el que afecte a más participantes o a más tareas principales. Considerar también el alcance del flujo afectado y el costo de la confusión. Toda recomendación debe enlazarse a una evidencia registrada y proponer un cambio concreto que pueda volver a evaluarse. No convertir un comentario aislado en una conclusión general sin indicar que fue observado una sola vez.
