// =================================================================
// LABORATORIO 14: INTERACCIÓN, DELEGACIÓN DE EVENTOS Y DATOS DERIVADOS
// =================================================================

// 1. ESTADO CENTRAL (Única fuente de verdad)
const state = {
  plantillas: [],
  editandoId: null,
  filtro: ''
};

// Referencias al DOM
const form = document.getElementById('form-plantilla');
const tituloForm = document.getElementById('titulo-form');
const inputTitulo = document.getElementById('titulo');
const inputHashtag = document.getElementById('hashtag');
const inputMensaje = document.getElementById('mensaje');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelar = document.getElementById('btn-cancelar');

const lista = document.getElementById('listaPlantillas');
const panelStats = document.getElementById('panel-stats');
const inputBuscador = document.getElementById('buscador');

// Referencias del Generador
const selectPlantilla = document.getElementById('select-plantilla');
const inputNombre = document.getElementById('input-nombre');
const inputProducto = document.getElementById('input-producto');
const btnGenerar = document.getElementById('btn-generar');
const cajaSalida = document.getElementById('caja-salida');
const salidaMensaje = document.getElementById('salida-mensaje');
const btnCopiar = document.getElementById('btn-copiar');

// 2. NORMALIZACIÓN DE HASHTAG
const normalizarHashtag = (tag) => {
  let limpio = tag.trim().toLowerCase().replaceAll(' ', '');
  if (!limpio.startsWith('#')) {
    limpio = '#' + limpio;
  }
  return limpio;
};

// 3. FUNCIONES PURAS Y DATOS DERIVADOS (HU3 y HU4)
function contarPorHashtag(plantillas) {
  const conteo = {};
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;
    } else {
      conteo[elHashtag] = 1;
    }
  });
  return conteo;
}

function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? '').trim().toLowerCase();
  if (filtroTexto === '') return state.plantillas;
  return state.plantillas.filter(plantilla =>
    plantilla.hashtag.toLowerCase().includes(filtroTexto)
  );
}

// 4. RENDERIZADO DE ESTADÍSTICAS (HU3 + Logro 2)
function renderStats() {
  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);
  const entradas = Object.entries(porTag);

  // Logro 2: Encontrar el hashtag más usado
  let topTag = '';
  let maxCantidad = 0;
  entradas.forEach(([tag, cant]) => {
    if (cant > maxCantidad) {
      maxCantidad = cant;
      topTag = tag;
    }
  });

  const etiquetas = entradas
    .map(([hashtag, cantidad]) =>
      `<span class="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">${hashtag} <strong>${cantidad}</strong></span>`
    )
    .join('');

  const badgeTop = topTag && total > 0
    ? `<span class="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">🏆 Top: ${topTag}</span>`
    : '';

  panelStats.innerHTML = `
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-sm font-bold text-slate-800">${total} plantilla(s)</span>
      ${etiquetas}
      ${badgeTop}
    </div>
  `;
}

// 5. PATRÓN RENDER() PRINCIPAL
function render() {
  lista.innerHTML = '';
  selectPlantilla.innerHTML = '<option value="">-- Selecciona una plantilla --</option>';

  // Renderizar tarjetas visibles (filtradas o todas)
  plantillasVisibles().forEach(function (plantilla) {
    const mensajeVistaPrevia = plantilla.mensaje.length > 80
      ? plantilla.mensaje.slice(0, 80) + '...'
      : plantilla.mensaje;

    const li = document.createElement('li');
    li.className = 'bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between';
    li.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2">
          <strong class="text-slate-800">${plantilla.titulo}</strong>
          <span class="text-xs text-slate-400 shrink-0">${plantilla.obtenerFechaFormateada()}</span>
        </div>
        <p class="text-sm text-slate-600 mt-1 break-words">${mensajeVistaPrevia}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="inline-block text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">${plantilla.hashtag}</span>
          <span class="text-[11px] text-slate-400">${plantilla.mensaje.length} chars</span>
        </div>
      </div>

      <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">
        <button data-id="${plantilla.id}" class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">
          ✏️ Editar
        </button>
        <button data-id="${plantilla.id}" class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium transition">
          🗑️ Eliminar
        </button>
      </div>
    `;
    lista.appendChild(li);
  });

  // Llenar el selector del generador con todas las plantillas del estado
  state.plantillas.forEach(function (plantilla) {
    const option = document.createElement('option');
    option.value = plantilla.id;
    option.textContent = `${plantilla.titulo} (${plantilla.hashtag})`;
    selectPlantilla.appendChild(option);
  });

  renderStats();
}

// 6. OPERACIONES CRUD INMUTABLES (HU1 y HU2)
function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas = [...state.plantillas, nueva];
}

function eliminarPlantilla(id) {
  // Logro 3: Confirmar antes de eliminar
  const confirmar = confirm('¿Estás seguro de eliminar esta plantilla?');
  if (!confirmar) return;

  state.plantillas = state.plantillas.filter(plantilla => plantilla.id !== id);
  if (state.editandoId === id) cancelarEdicion();
  render();
}

function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find(p => p.id === id);
  if (!plantilla) return;

  inputTitulo.value = plantilla.titulo;
  inputMensaje.value = plantilla.mensaje;
  inputHashtag.value = plantilla.hashtag;
  state.editandoId = id;

  // Cambiar apariencia del formulario a modo edición
  tituloForm.textContent = 'Editar Plantilla';
  btnSubmit.textContent = '💾 Guardar cambios';
  btnSubmit.classList.replace('bg-emerald-600', 'bg-blue-600');
  btnSubmit.classList.replace('hover:bg-emerald-700', 'hover:bg-blue-700');
  btnCancelar.classList.remove('hidden');
}

function cancelarEdicion() {
  state.editandoId = null;
  form.reset();
  tituloForm.textContent = 'Nueva Plantilla';
  btnSubmit.textContent = '+ Agregar plantilla';
  btnSubmit.classList.replace('bg-blue-600', 'bg-emerald-600');
  btnSubmit.classList.replace('hover:bg-blue-700', 'hover:bg-emerald-700');
  btnCancelar.classList.add('hidden');
}

// 7. DELEGACIÓN DE EVENTOS EN LA LISTA (HU1 y HU2)
lista.addEventListener('click', function (evento) {
  const btn = evento.target.closest('button');
  if (!btn) return;

  const id = btn.dataset.id;
  if (btn.classList.contains('btn-eliminar')) eliminarPlantilla(id);
  if (btn.classList.contains('btn-editar')) cargarEnFormulario(id);
});

// 8. EVENTO SUBMIT (CREAR O ACTUALIZAR)
form.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const tituloTexto = inputTitulo.value.trim();
  const mensajeTexto = inputMensaje.value.trim();
  const hashtagNormalizado = normalizarHashtag(inputHashtag.value);

  if (!tituloTexto || !mensajeTexto || !hashtagNormalizado) return;

  if (state.editandoId) {
    // Actualización inmutable con .map() manteniendo los métodos de la instancia
    state.plantillas = state.plantillas.map(plantilla => {
      if (plantilla.id === state.editandoId) {
        plantilla.titulo = tituloTexto;
        plantilla.mensaje = mensajeTexto;
        plantilla.hashtag = hashtagNormalizado;
      }
      return plantilla;
    });
    cancelarEdicion();
  } else {
    agregarPlantilla(tituloTexto, mensajeTexto, hashtagNormalizado);
    form.reset();
  }

  render();
});

btnCancelar.addEventListener('click', cancelarEdicion);

// 9. EVENTO BUSCADOR EN TIEMPO REAL (HU4)
inputBuscador.addEventListener('input', function (evento) {
  state.filtro = evento.target.value;
  render();
});

// 10. GENERADOR DE MENSAJE FINAL
btnGenerar.addEventListener('click', function () {
  const idSeleccionado = selectPlantilla.value;
  if (!idSeleccionado) {
    alert('Por favor, selecciona una plantilla primero.');
    return;
  }

  const plantilla = state.plantillas.find(p => p.id === idSeleccionado);
  const nombreReemplazo = inputNombre.value.trim() || '{nombre}';
  const productoReemplazo = inputProducto.value.trim() || '{producto}';

  const mensajeFinal = plantilla.mensaje
    .replaceAll('{nombre}', nombreReemplazo)
    .replaceAll('{producto}', productoReemplazo);

  salidaMensaje.textContent = mensajeFinal;
  cajaSalida.classList.remove('hidden');
});

btnCopiar.addEventListener('click', function () {
  navigator.clipboard.writeText(salidaMensaje.textContent);
  const textoOriginal = btnCopiar.textContent;
  btnCopiar.textContent = '✓ ¡Copiado!';
  setTimeout(() => {
    btnCopiar.textContent = textoOriginal;
  }, 2000);
});

// 11. DATOS INICIALES DE PRUEBA
agregarPlantilla(
  'Confirmación de Compra',
  'Hola {nombre}, gracias por comprar {producto}. Tu pedido está en camino.',
  '#ventas'
);
agregarPlantilla(
  'Seguimiento de Envío',
  'Hola {nombre}, tu paquete de {producto} ya salió a reparto hoy.',
  '#ventas'
);
agregarPlantilla(
  'Soporte Técnico',
  'Hola {nombre}, hemos recibido tu consulta sobre {producto}. En breve te ayudamos.',
  '#soporte'
);

render();