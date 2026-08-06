# vacaciones-con-clase
Vacaciones con clase es un proyecto universitario que busca resolver el problema de la fragmentación de los datos de los clientes, centralizando el proceso de captura de datos de interés en la pagina misma del catalogo, pasando de interactividad básica con hipervínculos hacia el chat de Whatsapp Bussiness (estado actual) a una pagina que capture formularios de datos reales de clientes, los almacene en una base de datos centralizada de manera automática y permita hacer cambios de manera sencilla en el estado de la venta ofreciendo un dashboard de gestión de venta básico (estado deseado). 

# Justificacion
## 1. Descripcion de situacion actual
El flujo de captura de datos y actualizaciones de estado de venta actual esta fragmentado, es decir, dividido en 2 partes:
 - El usuario ingresa a la pagina, ve un plan en el que este interesado y debe usar una de las opciones de hipervínculo para ponerse en contacto directo con un asesor.
 - El asesor recibe el mensaje de contacto y debe capturar los datos manualmente, dirigirse a la base de datos en Excel, guardar la información manualmente, y abrir el nuevo estado de venta.
 - El asesor debe actualizar constantemente el estado de la venta en un Excel, que no permite la visualización correcta de la información ni la sincronización de datos entre pares.
## 2. Descripción de la situación deseada
El flujo de captura de datos y actualizaciones a estado de venta deseado es que el proceso sea natural para el cliente y que el asesor disponga de los datos del cliente en tiempo real.
  - El usuario ingresa a la pagina, ve un plan en el que esta interesado y llenara un formulario sencillo con su información de contacto, información que queda ligada con su plan de interés.
  - El asesor recibirá una asignación de potencial venta una vez completado el formulario, y esté se encargara de contactar a la persona, ya conociendo de antemano su plan deseado y su información esencial.
  - El asesor tendrá la posibilidad de, según el desarrollo de la interacción con el cliente, actualizar el estado de la venta en tiempo real en su dashboard, de manera que todos sabrán en tiempo real como se desarrolla la venta.

## 3. Problema que se resuelve
Hay multiples problemas que la propuesta resuelve:
  - El usuario se evita el trabajo de contactar directamente a la empresa, lo que crea una experiencia de usuario mas fluida
  - El asesor se evita el trabajo de recopilar informacion y actualizar manualmente la misma en bases de datos
  - El negocio se evita la molestia de perder datos de clientes por falta de sincronización, o perder la pista de los estados de venta
