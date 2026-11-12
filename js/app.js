// =================================================================
// LABORATORIO 13: GESTOR DE PLANTILLAS WHATSAPP (ESTADO Y STRINGS)
// =================================================================

// 1. ESTADO CENTRAL (Única fuente de verdad)
const plantillas = [];

// Referencias al DOM
const formPlantilla = document.getElementById('form-plantilla');
const inputTitulo = document.getElementById('titulo');
const inputHashtag = document.getElementById('hashtag');
const inputMensaje = document.getElementById('mensaje');
const listaPlantillas = document.getElementById('listaPlantillas');
const contadorPlantillas = document.getElementById('contador-plantillas');

// Referencias del Generador
const selectPlantilla = document.getElementById('select-plantilla');
const inputNombre = document.getElementById('input-nombre');
const inputProducto = document.getElementById('input-producto');
const btnGenerar = document.getElementById('btn-generar');
const cajaSalida = document.getElementById('caja-salida');
const salidaMensaje = document.getElementById('salida-mensaje');
const btnCopiar = document.getElementById('btn-copiar');

// 2. NORMALIZACIÓN Y MANIPULACIÓN DE TEXTO (Métodos de String)
const formatearHashtag = (tag) => {
  // Limpia espacios y convierte a minúsculas
  let limpio = tag.trim().toLowerCase().replaceAll(' ', '');
  // Asegura que empiece con '#' usando .startsWith()
  if (!limpio.startsWith('#')) {
    limpio = '#' + limpio;
  }
  return limpio;
};

// 3. PATRÓN RENDER() (Dibuja toda la UI desde el estado central)
const render = () => {
  // Limpiar contenedores antes de redibujar
  listaPlantillas.innerHTML = '';
  selectPlantilla.innerHTML = '<option value="">-- Selecciona una plantilla --</option>';
  contadorPlantillas.textContent = plantillas.length;

  plantillas.forEach((p, index) => {
    // Logro 2: Recortar texto largo con .slice() para mantener la rejilla pareja
    const mensajeVistaPrevia = p.mensaje.length > 75 
      ? p.mensaje.slice(0, 75) + '...' 
      : p.mensaje;

    // Crear tarjeta en el DOM
    const li = document.createElement('li');
    li.className = 'bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between gap-3';
    li.innerHTML = `
      <div>
        <div class="flex justify-between items-start gap-2 mb-1">
          <h3 class="font-bold text-slate-800 text-base">${p.titulo}</h3>
          <span class="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
            ${p.hashtag}
          </span>
        </div>
        <p class="text-sm text-slate-600 break-words">${mensajeVistaPrevia}</p>
      </div>
      
      <div class="border-t pt-2 flex justify-between items-center text-xs text-slate-400">
        <span>📅 ${p.obtenerFechaFormateada()}</span>
        <span>📝 ${p.mensaje.length} caracteres</span>
      </div>
    `;
    listaPlantillas.appendChild(li);

    // Llenar también el <select> del generador
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${p.titulo} (${p.hashtag})`;
    selectPlantilla.appendChild(option);
  });
};

// 4. AGREGAR PLANTILLA AL ESTADO
const agregarPlantilla = (e) => {
  e.preventDefault();

  // Limpieza de inputs con .trim()
  const tituloLimpio = inputTitulo.value.trim();
  const mensajeLimpio = inputMensaje.value.trim();
  const hashtagFormateado = formatearHashtag(inputHashtag.value);

  if (!tituloLimpio || !mensajeLimpio || !hashtagFormateado) return;

  // Instanciar la clase Template y guardar en el estado central
  const nuevaPlantilla = new Template(tituloLimpio, mensajeLimpio, hashtagFormateado);
  plantillas.push(nuevaPlantilla);

  // Limpiar formulario y actualizar pantalla
  formPlantilla.reset();
  render();
};

// 5. GENERADOR DE MENSAJE FINAL (.replaceAll())
const generarMensajeFinal = () => {
  const indiceSeleccionado = selectPlantilla.value;
  if (indiceSeleccionado === '') {
    alert('Por favor, selecciona una plantilla primero.');
    return;
  }

  const plantilla = plantillas[indiceSeleccionado];
  const nombreReemplazo = inputNombre.value.trim() || '{nombre}';
  const productoReemplazo = inputProducto.value.trim() || '{producto}';

  // Encadenamos .replaceAll() para sustituir variables (Logro 3)
  const mensajeFinal = plantilla.mensaje
    .replaceAll('{nombre}', nombreReemplazo)
    .replaceAll('{producto}', productoReemplazo);

  salidaMensaje.textContent = mensajeFinal;
  cajaSalida.classList.remove('hidden');
};

// 6. EVENT LISTENERS
formPlantilla.addEventListener('submit', agregarPlantilla);
btnGenerar.addEventListener('click', generarMensajeFinal);

btnCopiar.addEventListener('click', () => {
  navigator.clipboard.writeText(salidaMensaje.textContent);
  const textoOriginal = btnCopiar.textContent;
  btnCopiar.textContent = '✓ ¡Copiado!';
  setTimeout(() => {
    btnCopiar.textContent = textoOriginal;
  }, 2000);
});

// Datos iniciales de ejemplo para probar rápido
plantillas.push(
  new Template(
    'Confirmación de Compra',
    'Hola {nombre}, gracias por comprar {producto}. Tu pedido está en camino.',
    '#ventas'
  )
);
render();