# Gestor de Plantillas para WhatsApp (Laboratorio 15 - Módulo 4)

Aplicación web interactiva desarrollada en JavaScript moderno (ES6+) y Tailwind CSS con **persistencia de datos en el navegador** mediante `localStorage` y serialización `JSON`.

## 🚀 Enlace al Proyecto Desplegado
[Ver Gestor de Plantillas en GitHub Pages](https://ericksalazarsanchez-byte.github.io/whatsapp-templates/)

---

## 💾 Cómo se Guarda y Carga el Estado (`js/persistence.js`)

Dado que `localStorage` únicamente almacena cadenas de texto (`string`), toda la lógica de persistencia se aisló en el módulo `persistence.js` bajo una única clave (`whatsapp-templates`):

* **Guardado automático (`guardar()`):** Se ejecuta automáticamente al final de cada ciclo de `render()`. Utiliza `JSON.stringify(state.plantillas)` para serializar el arreglo de objetos a una cadena JSON y lo almacena mediante `localStorage.setItem()`. Cuando la lista queda vacía (`state.plantillas.length === 0`), ejecuta `localStorage.removeItem()` para mantener limpio el almacenamiento del navegador y actualiza el chip visual de estado (`Guardado ✓` / `Vacío`).
* **Persistencia del filtro (`CLAVE_FILTRO`):** El término de búsqueda (`state.filtro`) se guarda directamente como texto plano con `setItem` y se restaura en el `<input id="buscador">` antes del primer `render()`.
* **Carga inicial (`cargar()`):** Al abrir o recargar la página, lee el registro con `localStorage.getItem()`. Si no existe información previa, devuelve un arreglo vacío `[]` mediante operador ternario; si existe, reconstruye los datos con `JSON.parse()` y convierte nuevamente las fechas serializadas a instancias `new Date()` para conservar su formato legible.

---

## 🛡️ Por qué se usa `try/catch` al Parsear
La función nativa `JSON.parse()` lanza un error de sintaxis (`SyntaxError`) que detiene la ejecución de JavaScript si recibe texto malformado o corrupto (por ejemplo, si el almacenamiento local fue alterado manualmente o quedó truncado):

* Envolver `JSON.parse(guardado)` dentro de un bloque **`try/catch`** actúa como red de seguridad: si ocurre un fallo al deserializar, el bloque `catch` captura la excepción, registra una advertencia controlada con `console.warn()` y devuelve un arreglo vacío `[]`. Esto garantiza que la aplicación arranque limpia y totalmente operativa sin quedarse con la pantalla rota.