/* =====================================================================
   FICHA MÉDICA — Taller de Testing y Calidad de Software, Semana 3
   ---------------------------------------------------------------------
   BASE COMÚN (la arma el Integrante 1 y no se toca sin avisar al grupo).
   Cada integrante completa SOLO los bloques marcados con su número.
   Busca en este archivo:  ===== INTEGRANTE 1/2/3/4 =====
   ===================================================================== */

const CLAVE_ALMACEN = 'fichasMedicas';

/* ---------------------------------------------------------------------
   MOTOR DE VALIDACIÓN (común)
   Cada campo se registra con una función que recibe el valor y devuelve
   null si está correcto, o el texto del error si no lo está.
   --------------------------------------------------------------------- */
const validadores = {};

function registrar(campo, fn) { validadores[campo] = fn; }

function mostrarError(campo, mensaje) {
  const input = document.getElementById(campo);
  const span = document.getElementById('error-' + campo);
  if (span) span.textContent = mensaje || '';
  if (input) {
    input.classList.remove('valido', 'invalido');
    if (input.value.trim() !== '' || mensaje) {
      input.classList.add(mensaje ? 'invalido' : 'valido');
    }
  }
}

function validarCampo(campo) {
  const input = document.getElementById(campo);
  const fn = validadores[campo];
  if (!input || !fn) return true;
  const mensaje = fn(input.value.trim());
  mostrarError(campo, mensaje);
  return mensaje === null;
}

function validarFormulario() {
  let ok = true;
  Object.keys(validadores).forEach(campo => { if (!validarCampo(campo)) ok = false; });
  return ok;
}

function mensajeGlobal(texto, tipo) {
  const p = document.getElementById('mensajeGlobal');
  p.textContent = texto;
  p.className = 'mensaje ' + tipo;      // tipo: 'exito' | 'fallo'
}

/* ---------------------------------------------------------------------
   ALMACENAMIENTO (común) — persistencia local del navegador
   --------------------------------------------------------------------- */
function leerFichas() {
  try { return JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || []; }
  catch (e) { return []; }
}

function escribirFichas(lista) {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lista));
}

function buscarPorRut(rut) {
  return leerFichas().findIndex(f => f.rut === rut);
}

function datosFormulario() {
  const d = {};
  ['rut','nombres','apellidos','direccion','ciudad','telefono','email',
   'fechaNacimiento','estadoCivil','comentarios'].forEach(c => {
    d[c] = document.getElementById(c).value.trim();
  });
  return d;
}


/* =====================================================================
   ===== INTEGRANTE 1 =====  RUT, Nombres, Apellidos
   Estas tres validaciones quedan HECHAS y sirven de modelo para el resto.
   ===================================================================== */

// RUT chileno: formato + dígito verificador (módulo 11)
registrar('rut', valor => {
  if (valor === '') return 'El RUT es obligatorio.';
  const limpio = valor.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) return 'Formato inválido. Use 12345678-9.';
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  if (dv !== dvEsperado) return 'El dígito verificador no corresponde.';
  return null;
});

registrar('nombres', valor => {
  if (valor === '') return 'Los nombres son obligatorios.';
  if (valor.length < 3) return 'Debe tener al menos 3 caracteres.';
  if (valor.length > 50) return 'No puede superar los 50 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valor)) return 'Solo se permiten letras y espacios.';
  return null;
});

registrar('apellidos', valor => {
  if (valor === '') return 'Los apellidos son obligatorios.';
  if (valor.length < 3) return 'Debe tener al menos 3 caracteres.';
  if (valor.length > 50) return 'No puede superar los 50 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valor)) return 'Solo se permiten letras y espacios.';
  return null;
});


/* =====================================================================
   ===== INTEGRANTE 2 =====  Dirección, Ciudad, Teléfono, Email
   TODO: reemplazar cada stub por la validación real y documentar en el
   informe los casos de prueba correspondientes (obligatorio, formato,
   largo mínimo y máximo, caracteres no permitidos).
   ===================================================================== */

registrar('direccion', valor => {
  if (valor === '') return 'La dirección es obligatoria.';
  // TODO (Integrante 2): largo mínimo 5 y máximo 80, permitir letras,
  // números, espacios, punto, coma y numeral (#). Rechazar solo símbolos.
  return null;
});

registrar('ciudad', valor => {
  if (valor === '') return 'La ciudad es obligatoria.';
  // TODO (Integrante 2): solo letras y espacios, entre 3 y 40 caracteres.
  return null;
});

registrar('telefono', valor => {
  if (valor === '') return 'El teléfono es obligatorio.';
  // TODO (Integrante 2): formato chileno +569XXXXXXXX o 9 dígitos.
  // Rechazar letras y largos distintos al esperado.
  return null;
});

registrar('email', valor => {
  if (valor === '') return 'El email es obligatorio.';
  // TODO (Integrante 2): formato usuario@dominio.extension, sin espacios,
  // máximo 60 caracteres, un solo arroba.
  return null;
});


/* =====================================================================
   ===== INTEGRANTE 3 =====  Fecha de nacimiento, Estado civil,
   Comentarios, botones Guardar / Limpiar / Cerrar y sobrescritura.
   ===================================================================== */

registrar('fechaNacimiento', valor => {
  if (valor === '') return 'La fecha de nacimiento es obligatoria.';
  // TODO (Integrante 3): rechazar fechas futuras y edades mayores a 120 años.
  return null;
});

registrar('estadoCivil', valor => {
  if (valor === '') return 'Debe seleccionar un estado civil.';
  return null;
});

registrar('comentarios', valor => {
  // Campo opcional.
  if (valor.length > 250) return 'No puede superar los 250 caracteres.';
  return null;
});

// --- Guardar ---
function guardar(sobrescribir) {
  if (!validarFormulario()) {
    mensajeGlobal('Existen campos con errores. Revise el formulario.', 'fallo');
    return;
  }
  const ficha = datosFormulario();
  const indice = buscarPorRut(ficha.rut);
  const lista = leerFichas();

  if (indice >= 0 && !sobrescribir) {
    abrirModal(ficha);          // pregunta si desea sobrescribir
    return;
  }
  if (indice >= 0) { lista[indice] = ficha; }
  else { lista.push(ficha); }

  escribirFichas(lista);
  mensajeGlobal(indice >= 0
    ? 'Registro sobrescrito correctamente.'
    : 'Registro guardado correctamente.', 'exito');
  // TODO (Integrante 3): refrescar el listado de resultados tras guardar.
}

// --- Modal de sobrescritura ---
let fichaPendiente = null;

function abrirModal(ficha) {
  fichaPendiente = ficha;
  document.getElementById('textoModal').textContent =
    'Ya existe una ficha registrada con el RUT ' + ficha.rut + '. ¿Desea sobrescribirla?';
  document.getElementById('modalSobrescribir').classList.remove('oculto');
}

function cerrarModal() {
  fichaPendiente = null;
  document.getElementById('modalSobrescribir').classList.add('oculto');
}

// --- Limpiar ---
function limpiar() {
  document.getElementById('formFicha').reset();
  Object.keys(validadores).forEach(c => mostrarError(c, ''));
  document.querySelectorAll('input, select, textarea')
    .forEach(e => e.classList.remove('valido', 'invalido'));
  mensajeGlobal('Formulario limpiado.', 'exito');
  // TODO (Integrante 3): pedir confirmación si el formulario tiene datos.
}

// --- Cerrar ---
function cerrar() {
  // TODO (Integrante 3): confirmar antes de cerrar y advertir si hay datos
  // sin guardar. window.close() solo funciona en pestañas abiertas por script.
  if (confirm('¿Está seguro de que desea cerrar la aplicación?')) {
    window.close();
    mensajeGlobal('Sesión cerrada. Puede cerrar esta pestaña.', 'exito');
  }
}


/* =====================================================================
   ===== INTEGRANTE 4 =====  Búsqueda por apellido y presentación
   de resultados, mensajes y estado vacío.
   ===================================================================== */

function buscarApellido() {
  const termino = document.getElementById('buscarApellido').value.trim();
  const spanError = document.getElementById('error-buscarApellido');
  spanError.textContent = '';

  if (termino === '') {
    spanError.textContent = 'Ingrese un apellido para buscar.';
    return;
  }
  // TODO (Integrante 4): validar largo mínimo y que solo contenga letras.

  const encontrados = leerFichas().filter(f =>
    f.apellidos.toLowerCase().includes(termino.toLowerCase()));
  pintarResultados(encontrados);
}

function pintarResultados(lista) {
  const div = document.getElementById('resultados');
  if (lista.length === 0) {
    div.innerHTML = '<p class="vacio">No se encontraron pacientes con ese apellido.</p>';
    return;
  }
  // TODO (Integrante 4): agregar columnas Teléfono y Ciudad, y un contador
  // con la cantidad de coincidencias encontradas.
  let html = '<table><tr><th>RUT</th><th>Nombres</th><th>Apellidos</th><th>Email</th></tr>';
  lista.forEach(f => {
    html += `<tr><td>${f.rut}</td><td>${f.nombres}</td><td>${f.apellidos}</td><td>${f.email}</td></tr>`;
  });
  div.innerHTML = html + '</table>';
}


/* ---------------------------------------------------------------------
   ENLACE DE EVENTOS (común)
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Validación en vivo al salir de cada campo
  Object.keys(validadores).forEach(campo => {
    const input = document.getElementById(campo);
    if (input) input.addEventListener('blur', () => validarCampo(campo));
  });

  document.getElementById('formFicha').addEventListener('submit', e => {
    e.preventDefault();
    guardar(false);
  });
  document.getElementById('btnLimpiar').addEventListener('click', limpiar);
  document.getElementById('btnCerrar').addEventListener('click', cerrar);
  document.getElementById('btnBuscar').addEventListener('click', buscarApellido);
  document.getElementById('btnVerTodos').addEventListener('click', () => pintarResultados(leerFichas()));
  document.getElementById('btnConfirmarSobrescribir').addEventListener('click', () => {
    cerrarModal();
    guardar(true);
  });
  document.getElementById('btnCancelarSobrescribir').addEventListener('click', () => {
    cerrarModal();
    mensajeGlobal('Operación cancelada. El registro existente no fue modificado.', 'fallo');
  });
});
