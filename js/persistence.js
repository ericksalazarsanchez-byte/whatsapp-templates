// =================================================================
// PERSISTENCIA EN LOCALSTORAGE (HU1, HU2, HU3, HU4, HU5 y Logros)
// =================================================================

const CLAVE = 'whatsapp-templates';
const CLAVE_FILTRO = 'whatsapp-templates-filtro';
const CLAVE_VISITAS = 'whatsapp-templates-visitas';

// HU1, HU4 y HU5: Guarda plantillas, filtro y actualiza el chip de estado
function guardar() {
  // Si no hay plantillas, limpia la clave; si hay, serializa a JSON
  state.plantillas.length === 0
    ? localStorage.removeItem(CLAVE)
    : localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));

  // HU5: Guarda el texto del filtro directamente (ya es string)
  localStorage.setItem(CLAVE_FILTRO, state.filtro ?? '');

  // HU4: Actualiza el indicador visual de guardado
  const chipEstado = document.getElementById('estado');
  if (chipEstado) {
    chipEstado.textContent = state.plantillas.length > 0 ? 'Guardado ✓' : 'Vacío';
  }
}

// HU2 y HU3: Recupera y deserializa las plantillas protegiendo contra datos corruptos
function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];

  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.warn('Datos corruptos detectados en localStorage, iniciando lista vacía:', error);
    return [];
  }
}

// HU5: Recupera el filtro guardado
function cargarFiltro() {
  return localStorage.getItem(CLAVE_FILTRO) ?? '';
}

// Logro 2: Contador persistente de veces que se abrió la app
function registrarAperturaApp() {
  const visitasActuales = Number(localStorage.getItem(CLAVE_VISITAS) ?? 0) + 1;
  localStorage.setItem(CLAVE_VISITAS, String(visitasActuales));
  return visitasActuales;
}