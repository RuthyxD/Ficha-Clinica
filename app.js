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
  if (valor.length < 5) return 'La dirección debe tener al menos 5 caracteres.';
  if (valor.length > 80) return 'La dirección no puede superar los 80 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#]+$/.test(valor)) return 'La dirección contiene caracteres no permitidos.';
  return null;
});

registrar('ciudad', valor => {
  if (valor === '') return 'La ciudad es obligatoria.';
  if (valor.length < 3) return 'La ciudad debe tener al menos 3 caracteres.';
  if (valor.length > 40) return 'La ciudad no puede superar los 40 caracteres.';
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) return 'La ciudad solo puede contener letras y espacios.';
  return null;
});

registrar('telefono', valor => {
  if (valor === '') return 'El teléfono es obligatorio.';
  if (!/^(\+569\d{8}|\d{9})$/.test(valor)) return 'El teléfono debe tener formato +569XXXXXXXX o 9 dígitos.';
  return null;
});

registrar('email', valor => {
  if (valor === '') return 'El email es obligatorio.';
  if (valor.length > 60) return 'El email no puede superar los 60 caracteres.';
  if (/\s/.test(valor)) return 'El email no puede contener espacios.';
  if ((valor.match(/@/g) || []).length !== 1) return 'El email debe contener un solo @.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'El formato del email no es válido.';
  return null;
});

/* =====================================================================
   ===== INTEGRANTE 3 =====  Fecha de nacimiento, Estado civil,
   Comentarios, pintarBotones Guardar / Limpiar / Cerrar y sobrescritura.
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
  let spanContador = document.getElementById('span-contador');
  spanContador.textContent = '';
  const div = document.getElementById('resultados');
  div.innerHTML = '';

  if (termino === '') {
    mostrarError('buscarApellido','Ingrese un apellido para buscar.');
    return;
  }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(termino)){
     mostrarError('buscarApellido', 'Formato invalido. Solo se admiten letras y espacios.');
    return;
  }
  // if (termino.length < 2) {
  //  mostrarError('buscarApellido', 'Debe ingresar al menos 2 letras'); return;}//me gusta la idea de que busque todos los q empiezan con el input
  
  const encontrados = leerFichas().filter(f =>
    f.apellidos.toLowerCase().startsWith(termino.toLowerCase()));
    pintarResultados(encontrados);
}

    
function pintarResultados(lista) {
  const div = document.getElementById('resultados');
  const input = document.getElementById('buscarApellido');
  const spanError = document.getElementById('error-buscarApellido');
  spanError.textContent = '';
  input.className = 'input';

  if (lista.length === 0) {
    div.innerHTML = '<p class="vacio">No se encontraron pacientes con ese apellido.</p>';
    return;
  }

  lista.sort(function(a, b){
    let x = a.apellidos.toLowerCase();
    let y = b.apellidos.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  });


  let spanContador = document.getElementById('span-contador');
  spanContador.textContent = 'Coincidencias encontradas: ' + lista.length;
  let html = '<table><tr><th>RUT</th><th>Nombres</th><th>Apellidos</th><th>Fecha Nacimiento</th><th>Email</th><th>Telefono</th><th>Ciudad</th><th>Direccion</th><th>Estado civil</th><th>Comentarios</th></tr>';
  

const limiteDatos = 10;

  if(lista.length<limiteDatos){
    lista.forEach(f => {
      html += `<tr><td>${f.rut}</td><td>${f.nombres}</td><td>${f.apellidos}</td><td>${f.fechaNacimiento}</td><td>${f.email}</td><td>${f.telefono}</td><td>${f.ciudad}</td><td>${f.direccion}</td><td>${f.estadoCivil}</td><td>${f.comentarios}</td></tr>`;
    });
    div.innerHTML = html + '</table>';  
  }

  if(lista.length>limiteDatos){
    let subarray = dividirLista(lista,limiteDatos);
    let pagina= 0;
    pintarPagina(subarray,pagina);
    pintarBotones(subarray,pagina); 
}}


function dividirLista(lista,size){ 
    let subarray = [];
    for (let i=0; i < lista.length; i+=size ){
      subarray.push(lista.slice(i, i + size));
    }
    return subarray;
}

function pintarPagina(subarray,pagina){
    const div = document.getElementById('resultados');
    let html = '<table><tr><th>RUT</th><th>Nombres</th><th>Apellidos</th><th>Fecha Nacimiento</th><th>Email</th><th>Telefono</th><th>Ciudad</th><th>Direccion</th><th>Estado civil</th><th>Comentarios</th></tr>';
    subarray[pagina].forEach(f => {
      html += `<tr><td>${f.rut}</td><td>${f.nombres}</td><td>${f.apellidos}</td><td>${f.fechaNacimiento}</td><td>${f.email}</td><td>${f.telefono}</td><td>${f.ciudad}</td><td>${f.direccion}</td><td>${f.estadoCivil}</td><td>${f.comentarios}</td></tr>`;
      div.innerHTML = html + '</table>';
    })
}
  
function pintarBotones(subarray,pagina){
    const div = document.getElementById('resultados');
    const sigPagina = document.createElement('button');
    sigPagina.innerHTML= '>';
    const anteriorPagina = document.createElement('button');
    anteriorPagina.innerHTML= '<';

    sigPagina.addEventListener('click' , () => {
      pagina ++;
      pintarPagina(subarray,pagina); 
      pintarBotones(subarray,pagina);
      });

    anteriorPagina.addEventListener('click' , () => {
      pagina --;
      pintarPagina(subarray,pagina);  
      pintarBotones(subarray,pagina);
    });

    if(pagina+1 < subarray.length && pagina > 0){
      div.appendChild(anteriorPagina);
      div.appendChild(sigPagina);
    }
    else if(pagina+1 < subarray.length){
        div.appendChild(sigPagina);
      }
    else{
        div.appendChild(anteriorPagina);
    }
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
