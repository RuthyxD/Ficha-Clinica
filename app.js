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

const fichasTest = [
  {
    "rut": "12.345.678-5",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez González",
    "fechaNacimiento": "1985-03-14",
    "email": "juan.perez@example.com",
    "telefono": "+56991234567",
    "ciudad": "Santiago",
    "direccion": "Av. Providencia 1234",
    "estadoCivil": "Soltero",
    "comentarios": "Usuario de prueba para registro."
  },
  {
    "rut": "15.678.234-9",
    "nombres": "María José",
    "apellidos": "Soto Ramírez",
    "fechaNacimiento": "1990-07-22",
    "email": "maria.soto@example.com",
    "telefono": "+56992345678",
    "ciudad": "Valparaíso",
    "direccion": "Calle Independencia 456",
    "estadoCivil": "Casado",
    "comentarios": "Prefiere contacto por correo."
  },
  {
    "rut": "10.234.567-8",
    "nombres": "Pedro Andrés",
    "apellidos": "Muñoz Silva",
    "fechaNacimiento": "1978-11-05",
    "email": "pedro.munoz@example.com",
    "telefono": "+56993456789",
    "ciudad": "Concepción",
    "direccion": "Av. Los Carrera 789",
    "estadoCivil": "Divorciado",
    "comentarios": ""
  },
  {
    "rut": "18.456.789-2",
    "nombres": "Camila Fernanda",
    "apellidos": "Rojas Martínez",
    "fechaNacimiento": "1995-01-18",
    "email": "camila.rojas@example.com",
    "telefono": "+56994567890",
    "ciudad": "La Serena",
    "direccion": "Pasaje El Faro 321",
    "estadoCivil": "Soltero",
    "comentarios": "Registro realizado desde formulario web."
  },
  {
    "rut": "9.876.543-2",
    "nombres": "Luis Alberto",
    "apellidos": "Contreras Díaz",
    "fechaNacimiento": "1972-09-30",
    "email": "luis.contreras@example.com",
    "telefono": "+56995678901",
    "ciudad": "Temuco",
    "direccion": "Calle Caupolicán 654",
    "estadoCivil": "Casado",
    "comentarios": "Sin observaciones."
  },
  {
    "rut": "16.234.567-3",
    "nombres": "Francisca Paz",
    "apellidos": "Vargas Torres",
    "fechaNacimiento": "1992-05-11",
    "email": "francisca.vargas@example.com",
    "telefono": "+56996789012",
    "ciudad": "Rancagua",
    "direccion": "Av. República 987",
    "estadoCivil": "Soltero",
    "comentarios": "Solicita información adicional."
  },
  {
    "rut": "13.789.456-0",
    "nombres": "Diego Ignacio",
    "apellidos": "Castillo Pérez",
    "fechaNacimiento": "1988-12-03",
    "email": "diego.castillo@example.com",
    "telefono": "+56997890123",
    "ciudad": "Talca",
    "direccion": "Calle Uno 147",
    "estadoCivil": "Soltero",
    "comentarios": ""
  },
  {
    "rut": "11.456.789-4",
    "nombres": "Carolina Andrea",
    "apellidos": "Fuentes Morales",
    "fechaNacimiento": "1982-06-27",
    "email": "carolina.fuentes@example.com",
    "telefono": "+56998901234",
    "ciudad": "Santiago",
    "direccion": "Av. Macul 2580",
    "estadoCivil": "Viudo",
    "comentarios": "Datos ingresados para ambiente QA."
  },
  {
    "rut": "19.345.678-1",
    "nombres": "Matías Sebastián",
    "apellidos": "Araya Núñez",
    "fechaNacimiento": "1998-10-16",
    "email": "matias.araya@example.com",
    "telefono": "+56989012345",
    "ciudad": "Antofagasta",
    "direccion": "Av. Brasil 369",
    "estadoCivil": "Soltero",
    "comentarios": "Usuario joven."
  },
  {
    "rut": "14.567.890-6",
    "nombres": "Daniela Sofía",
    "apellidos": "Espinoza Reyes",
    "fechaNacimiento": "1991-04-09",
    "email": "daniela.espinoza@example.com",
    "telefono": "+56980123456",
    "ciudad": "Viña del Mar",
    "direccion": "Calle Libertad 741",
    "estadoCivil": "Casado",
    "comentarios": "Contacto preferido: teléfono."
  },
  {
    "rut": "8.765.432-1",
    "nombres": "Roberto Hernán",
    "apellidos": "Navarro Castro",
    "fechaNacimiento": "1969-08-21",
    "email": "roberto.navarro@example.com",
    "telefono": "+56981234567",
    "ciudad": "Puerto Montt",
    "direccion": "Calle Antonio Varas 852",
    "estadoCivil": "Casado",
    "comentarios": ""
  },
  {
    "rut": "17.890.123-5",
    "nombres": "Valentina Belén",
    "apellidos": "Pizarro Herrera",
    "fechaNacimiento": "1996-02-14",
    "email": "valentina.pizarro@example.com",
    "telefono": "+56982345678",
    "ciudad": "Chillán",
    "direccion": "Av. O'Higgins 963",
    "estadoCivil": "Soltero",
    "comentarios": "Registro de prueba número 12."
  },
  {
    "rut": "20.123.456-7",
    "nombres": "Sebastián Felipe",
    "apellidos": "Leiva Sandoval",
    "fechaNacimiento": "2000-11-29",
    "email": "sebastian.leiva@example.com",
    "telefono": "+56983456789",
    "ciudad": "Santiago",
    "direccion": "Calle Apoquindo 1590",
    "estadoCivil": "Soltero",
    "comentarios": "Sin comentarios."
  },
  {
    "rut": "7.654.321-9",
    "nombres": "Patricia Elena",
    "apellidos": "Salinas Bravo",
    "fechaNacimiento": "1965-03-07",
    "email": "patricia.salinas@example.com",
    "telefono": "+56984567890",
    "ciudad": "Arica",
    "direccion": "Calle 21 de Mayo 246",
    "estadoCivil": "Viudo",
    "comentarios": "Registro histórico de prueba."
  },
  {
    "rut": "21.234.567-8",
    "nombres": "Nicolás Alejandro",
    "apellidos": "Vergara Molina",
    "fechaNacimiento": "2002-07-19",
    "email": "nicolas.vergara@example.com",
    "telefono": "+56985678901",
    "ciudad": "Copiapó",
    "direccion": "Av. Copayapu 357",
    "estadoCivil": "Soltero",
    "comentarios": ""
  },
  {
    "rut": "12.987.654-3",
    "nombres": "Andrea Marcela",
    "apellidos": "Valdés Ortega",
    "fechaNacimiento": "1987-01-25",
    "email": "andrea.valdes@example.com",
    "telefono": "+56986789012",
    "ciudad": "Curicó",
    "direccion": "Calle Estado 468",
    "estadoCivil": "Divorciado",
    "comentarios": "Solicita actualización de datos."
  },
  {
    "rut": "15.345.678-4",
    "nombres": "Felipe Eduardo",
    "apellidos": "Godoy Carrasco",
    "fechaNacimiento": "1984-10-12",
    "email": "felipe.godoy@example.com",
    "telefono": "+56987890123",
    "ciudad": "Los Ángeles",
    "direccion": "Av. Alemania 579",
    "estadoCivil": "Casado",
    "comentarios": "Datos ficticios."
  },
  {
    "rut": "10.987.654-6",
    "nombres": "Claudia Verónica",
    "apellidos": "Reyes Tapia",
    "fechaNacimiento": "1975-05-03",
    "email": "claudia.reyes@example.com",
    "telefono": "+56988901234",
    "ciudad": "Osorno",
    "direccion": "Calle Ramírez 680",
    "estadoCivil": "Casado",
    "comentarios": ""
  },
  {
    "rut": "18.234.567-0",
    "nombres": "Javiera Ignacia",
    "apellidos": "Maldonado Vera",
    "fechaNacimiento": "1997-09-17",
    "email": "javiera.maldonado@example.com",
    "telefono": "+56979012345",
    "ciudad": "Valdivia",
    "direccion": "Calle Picarte 791",
    "estadoCivil": "Soltero",
    "comentarios": "Prueba de formulario completo."
  },
  {
    "rut": "13.456.789-7",
    "nombres": "Cristóbal Andrés",
    "apellidos": "Sanhueza Riquelme",
    "fechaNacimiento": "1989-06-08",
    "email": "cristobal.sanhueza@example.com",
    "telefono": "+56970123456",
    "ciudad": "Quillota",
    "direccion": "Calle Maipú 802",
    "estadoCivil": "Soltero",
    "comentarios": "Sin observaciones."
  },
  {
    "rut": "9.234.567-5",
    "nombres": "Marcelo Antonio",
    "apellidos": "Cáceres Bustos",
    "fechaNacimiento": "1970-12-22",
    "email": "marcelo.caceres@example.com",
    "telefono": "+56971234567",
    "ciudad": "San Antonio",
    "direccion": "Av. Barros Luco 913",
    "estadoCivil": "Divorciado",
    "comentarios": ""
  },
  {
    "rut": "16.789.012-2",
    "nombres": "Paula Alejandra",
    "apellidos": "Miranda Soto",
    "fechaNacimiento": "1993-02-28",
    "email": "paula.miranda@example.com",
    "telefono": "+56972345678",
    "ciudad": "Santiago",
    "direccion": "Av. Irarrázaval 1024",
    "estadoCivil": "Soltero",
    "comentarios": "Prefiere recibir notificaciones por email."
  },
  {
    "rut": "11.234.567-9",
    "nombres": "Mauricio Javier",
    "apellidos": "Peña Fuenzalida",
    "fechaNacimiento": "1980-08-15",
    "email": "mauricio.pena@example.com",
    "telefono": "+56973456789",
    "ciudad": "Linares",
    "direccion": "Calle Brasil 1135",
    "estadoCivil": "Casado",
    "comentarios": "Registro para pruebas de integración."
  },
  {
    "rut": "19.876.543-0",
    "nombres": "Antonia Isabel",
    "apellidos": "Correa Medina",
    "fechaNacimiento": "1999-04-23",
    "email": "antonia.correa@example.com",
    "telefono": "+56974567890",
    "ciudad": "Puerto Varas",
    "direccion": "Calle San Francisco 1246",
    "estadoCivil": "Soltero",
    "comentarios": ""
  },
  {
    "rut": "14.234.567-1",
    "nombres": "Rodrigo Esteban",
    "apellidos": "Bustos Salazar",
    "fechaNacimiento": "1986-11-10",
    "email": "rodrigo.bustos@example.com",
    "telefono": "+56975678901",
    "ciudad": "Talagante",
    "direccion": "Av. Bernardo O'Higgins 1357",
    "estadoCivil": "Casado",
    "comentarios": "Usuario de prueba."
  },
  {
    "rut": "17.345.678-6",
    "nombres": "Constanza María",
    "apellidos": "Olivares Vidal",
    "fechaNacimiento": "1994-07-04",
    "email": "constanza.olivares@example.com",
    "telefono": "+56976789012",
    "ciudad": "Melipilla",
    "direccion": "Calle Serrano 1468",
    "estadoCivil": "Soltero",
    "comentarios": "Sin comentarios."
  },
  {
    "rut": "8.234.567-4",
    "nombres": "Héctor Manuel",
    "apellidos": "Figueroa Pinto",
    "fechaNacimiento": "1963-01-31",
    "email": "hector.figueroa@example.com",
    "telefono": "+56977890123",
    "ciudad": "Iquique",
    "direccion": "Av. Arturo Prat 1579",
    "estadoCivil": "Viudo",
    "comentarios": "Registro de adulto mayor."
  },
  {
    "rut": "20.345.678-9",
    "nombres": "Ignacio Tomás",
    "apellidos": "Campos Escobar",
    "fechaNacimiento": "2001-05-26",
    "email": "ignacio.campos@example.com",
    "telefono": "+56978901234",
    "ciudad": "Santiago",
    "direccion": "Calle Santa Isabel 1680",
    "estadoCivil": "Soltero",
    "comentarios": ""
  },
  {
    "rut": "12.678.901-2",
    "nombres": "Lorena Beatriz",
    "apellidos": "Ramírez Donoso",
    "fechaNacimiento": "1979-09-13",
    "email": "lorena.ramirez@example.com",
    "telefono": "+56969012345",
    "ciudad": "Coquimbo",
    "direccion": "Calle Aldunate 1791",
    "estadoCivil": "Divorciado",
    "comentarios": "Solicita contacto telefónico."
  },
  {
    "rut": "15.890.123-7",
    "nombres": "Álvaro José",
    "apellidos": "Morales Sepúlveda",
    "fechaNacimiento": "1983-03-02",
    "email": "alvaro.morales@example.com",
    "telefono": "+56960123456",
    "ciudad": "Concepción",
    "direccion": "Av. Chacabuco 1802",
    "estadoCivil": "Casado",
    "comentarios": "Datos generados automáticamente."
  },
  {
    "rut": "18.567.890-8",
    "nombres": "Fernanda Catalina",
    "apellidos": "Herrera Lagos",
    "fechaNacimiento": "1996-12-18",
    "email": "fernanda.herrera@example.com",
    "telefono": "+56961234567",
    "ciudad": "Viña del Mar",
    "direccion": "Calle 5 Norte 1913",
    "estadoCivil": "Soltero",
    "comentarios": "Último registro de prueba."
  }
]
escribirFichas(fichasTest); 

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
