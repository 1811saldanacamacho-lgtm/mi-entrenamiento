# Mi entrenamiento

Aplicación web sencilla para llevar tus rutinas y registrar tus entrenamientos. No necesita instalación ni servidor: es HTML, CSS y JavaScript, y guarda los datos en el navegador.

## Qué hace

- **Hoy**: empiezas una rutina o un entrenamiento libre y vas marcando cada serie con su peso y repeticiones (o minutos). Te muestra lo que hiciste la última vez y arranca una cuenta regresiva de descanso al marcar una serie.
- **Rutinas**: creas tus rutinas con sus ejercicios, series y repeticiones.
- **Ejemplos**: seis rutinas de ejemplo (gimnasio, casa sin equipo, cardio) y un catálogo de ejercicios por grupo muscular con una explicación corta de cómo se hace cada uno.
- **Historial**: todos tus entrenamientos terminados, con el detalle de cada uno.
- **Progreso**: entrenamientos por semana y, por ejercicio, tu mejor peso, mejor volumen y una gráfica de avance.
- **Respaldo**: descargas tus datos en un archivo y los restauras en otro navegador o dispositivo (pestaña Rutinas → Ajustes).

## Cómo usarla

Abre `index.html` en el navegador. Para usarla en el teléfono, publícala con GitHub Pages (abajo) y agrégala a la pantalla de inicio desde el menú del navegador.

## Publicarla con GitHub Pages

1. Sube este repositorio a GitHub.
2. En el repositorio: **Settings → Pages → Build and deployment**, elige la rama `main` y la carpeta `/ (root)`.
3. En un par de minutos queda disponible en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Tus datos

Se guardan solo en el navegador donde uses la aplicación (localStorage); no se envían a ningún servidor. Si borras los datos del navegador se pierden, así que descarga un respaldo de vez en cuando.
