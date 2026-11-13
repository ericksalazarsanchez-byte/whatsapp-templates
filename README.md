# Gestor de Plantillas para WhatsApp (Laboratorio 14 - Módulo 4)

Aplicación web interactiva desarrollada en JavaScript moderno (ES6+) y Tailwind CSS para crear, editar, eliminar, filtrar y reutilizar plantillas de mensajes de WhatsApp con variables dinámicas (`{nombre}` y `{producto}`).

## 🚀 Enlace al Proyecto Desplegado
[Ver Gestor de Plantillas en GitHub Pages](https://ericksalazarsanchez-byte.github.io/whatsapp-templates/)

---

## 🎯 Delegación de Eventos (`listaPlantillas`)
En lugar de asignar un `addEventListener` individual a cada botón de **Editar** o **Eliminar** dentro de cada tarjeta (los cuales se destruyen y recrean cada vez que se ejecuta `render()`), se implementó **un único listener en el contenedor padre** (`<ul id="listaPlantillas">`)[cite: 32]:

* Cuando el usuario hace clic dentro de la lista, se captura `evento.target.closest('button')` para identificar el botón pulsado.
* Mediante `classList.contains('btn-editar')` o `classList.contains('btn-eliminar')` se determina la acción a ejecutar[cite: 32].
* Se lee el identificador único de la plantilla desde el atributo HTML `data-id` (`btn.dataset.id`) para operar sobre el elemento exacto en el estado central sin importar cuántas tarjetas existan[cite: 31, 32].

---

## 📊 Función Pura y Datos Derivados (`contarPorHashtag`)
La función `contarPorHashtag(plantillas)` es una **función pura** diseñada para calcular estadísticas en tiempo real a partir del estado central sin mutar el arreglo original[cite: 27, 33]:

* **¿Para qué sirve?** Recorre la lista actual de plantillas en `state.plantillas` y construye un objeto diccionario donde cada llave es un hashtag (ej. `#ventas`, `#soporte`) y su valor es la cantidad de veces que aparece[cite: 33].
* **Sincronización automática:** Es invocada dentro de `renderStats()` al final de cada ciclo de `render()`, garantizando que el total de plantillas, el desglose por etiqueta y el indicador de hashtag más usado se actualicen automáticamente al crear, editar o eliminar registros[cite: 34, 35].

---

## 🛠️ Funcionalidades CRUD y Filtrado
* **Crear y Editar (`HU2`):** Actualización inmutable del estado mediante `.map()` y modo de edición con botón de cancelación[cite: 33, 35].
* **Eliminar (`HU1`):** Filtrado inmutable mediante `.filter()` con confirmación previa al usuario[cite: 31, 35].
* **Filtrado Reactivo (`HU4`):** Búsqueda instantánea por hashtag mediante la función derivada `plantillasVisibles()` usando `.includes()` sin alterar los datos reales del estado[cite: 35].