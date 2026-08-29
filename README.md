# Ficha Médica — Ingreso de Pacientes

Formulario de ficha médica desarrollado para la actividad sumativa de la **Semana 3**
del Taller de Testing y Calidad de Software (AIEP). Trabajo grupal.

**Aplicación publicada:** https://ruthyxd.github.io/Ficha-Clinica/

## Archivos
- `index.html` — formulario completo (10 campos, 3 botones, buscador y modal de sobrescritura).
- `styles.css` — estilos.
- `app.js` — motor de validación, almacenamiento y eventos. **Aquí trabaja cada integrante**, en el bloque marcado `===== INTEGRANTE N =====`.

## Cómo probarlo en tu computador
En esta carpeta, ejecuta:

    python3 -m http.server 8777

y abre http://localhost:8777 en el navegador.

## Estado actual (ya funciona)
- Guardar, Limpiar y Cerrar operativos.
- Detección de RUT repetido con pregunta de sobrescritura.
- Búsqueda por apellido con estado vacío.
- Validación completa de RUT (dígito verificador), Nombres y Apellidos — sirve de modelo.

## Lo que falta (cada uno lo suyo, buscar los `TODO`)
- Integrante 2: Dirección, Ciudad, Teléfono, Email.
- Integrante 3: Fecha de nacimiento, Estado civil, confirmaciones de Limpiar y Cerrar.
- Integrante 4: validación del buscador, columnas Teléfono y Ciudad, contador de coincidencias.

## Publicación en internet (Integrante 1)
La actividad exige que la aplicación esté disponible en internet. Dos opciones sin costo:
1. **Netlify Drop** — entrar a app.netlify.com/drop y arrastrar esta carpeta. Entrega una URL al instante.
2. **GitHub Pages** — subir la carpeta a un repositorio, entrar a Settings → Pages y publicar la rama `main`.

Pegar la URL resultante en la sección 1.1 del informe.
