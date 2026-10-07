// Mi entrenamiento: registro de rutinas y sesiones. Todo se guarda en el navegador (localStorage).
const CLAVE = 'ejercicio-v1';

// ---------- Fechas (hora local, formato AAAA-MM-DD) ----------
function iso(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function fecha(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function hoy() { return iso(new Date()); }
function sumarDias(s, n) {
  const d = fecha(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
function lunes(s) { return sumarDias(s, -((fecha(s).getDay() + 6) % 7)); }
function fechaLarga(s) { return fecha(s).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }); }
function fechaCorta(s) { return fecha(s).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }); }

// ---------- Utilidades ----------
function numero(v) { const n = parseFloat(v); return isFinite(n) ? n : 0; }
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function nuevoId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function suma(lista, f) { return lista.reduce((t, x) => t + f(x), 0); }
function igual(a, b) { return a.trim().toLowerCase() === b.trim().toLowerCase(); }
function kilos(n) { return (Math.round(n * 10) / 10).toLocaleString('es-MX') + ' kg'; }

// ---------- Ejemplos ----------
// Ejercicios de ejemplo por grupo: [nombre, tipo, cómo se hace].
const CATALOGO = {
  'Pecho': [
    ['Press de banca', 'fuerza', 'Acostado, baja la barra al pecho con control y empuja hasta estirar los brazos.'],
    ['Press inclinado con mancuernas', 'fuerza', 'En banco inclinado, empuja las mancuernas hacia arriba sin chocar una con otra.'],
    ['Lagartijas', 'fuerza', 'Cuerpo recto como tabla; baja el pecho casi al piso y empuja. Sin peso, anota 0 kg.'],
    ['Aperturas con mancuernas', 'fuerza', 'Brazos casi estirados; abre hasta sentir el estiramiento y cierra arriba del pecho.'],
    ['Fondos', 'fuerza', 'En paralelas, baja doblando los codos hasta 90° e inclínate un poco al frente.']
  ],
  'Espalda': [
    ['Dominadas', 'fuerza', 'Cuelga de la barra y sube hasta pasar la barbilla; baja despacio.'],
    ['Jalón al pecho', 'fuerza', 'Sentado, jala la barra hacia la parte alta del pecho juntando los omóplatos.'],
    ['Remo con barra', 'fuerza', 'Torso inclinado y espalda recta; jala la barra hacia el abdomen.'],
    ['Remo con mancuerna', 'fuerza', 'Apoya una mano y una rodilla en el banco; jala la mancuerna hacia la cadera.'],
    ['Peso muerto', 'fuerza', 'Espalda recta, barra pegada a las piernas; levanta empujando el piso con los pies.']
  ],
  'Pierna': [
    ['Sentadilla', 'fuerza', 'Pies al ancho de hombros; baja como si te sentaras, con las rodillas siguiendo la punta de los pies.'],
    ['Prensa', 'fuerza', 'Empuja la plataforma sin bloquear las rodillas al final y baja con control.'],
    ['Peso muerto rumano', 'fuerza', 'Rodillas apenas dobladas; lleva la cadera atrás hasta sentir el estiramiento atrás del muslo.'],
    ['Desplantes', 'fuerza', 'Da un paso largo y baja hasta que ambas rodillas queden cerca de 90°. Alterna piernas.'],
    ['Extensión de cuádriceps', 'fuerza', 'Sentado en la máquina, estira las piernas y baja despacio.'],
    ['Curl femoral', 'fuerza', 'En la máquina, lleva los talones hacia los glúteos y regresa con control.'],
    ['Elevación de talones', 'fuerza', 'De pie, sube a las puntas lo más alto que puedas y baja lento.']
  ],
  'Hombro': [
    ['Press militar', 'fuerza', 'De pie o sentado, empuja la barra arriba de la cabeza sin arquear la espalda.'],
    ['Elevaciones laterales', 'fuerza', 'Sube las mancuernas a los lados hasta la altura de los hombros, codos apenas doblados.'],
    ['Elevaciones frontales', 'fuerza', 'Sube la mancuerna al frente hasta la altura de los ojos, sin balancearte.'],
    ['Pájaros', 'fuerza', 'Inclinado al frente, abre los brazos hacia los lados para trabajar la parte de atrás del hombro.']
  ],
  'Brazo': [
    ['Curl de bíceps', 'fuerza', 'Codos pegados al cuerpo; sube la barra o mancuernas sin mover los hombros.'],
    ['Curl martillo', 'fuerza', 'Igual que el curl, pero con las palmas viéndose una a la otra.'],
    ['Extensión de tríceps', 'fuerza', 'En polea, empuja hacia abajo hasta estirar el brazo, con los codos quietos.'],
    ['Press francés', 'fuerza', 'Acostado, baja la barra hacia la frente doblando solo los codos y estira.']
  ],
  'Abdomen': [
    ['Plancha', 'tiempo', 'Apoyado en antebrazos y puntas, cuerpo recto y abdomen apretado. Anota los minutos.'],
    ['Abdominales', 'fuerza', 'Sube el torso despegando los hombros del piso, sin jalar el cuello. Sin peso, anota 0 kg.'],
    ['Elevación de piernas', 'fuerza', 'Acostado o colgado, sube las piernas rectas y bájalas sin tocar el piso.'],
    ['Giros rusos', 'fuerza', 'Sentado con el torso inclinado atrás, gira de lado a lado con o sin peso.']
  ],
  'Cardio': [
    ['Caminadora', 'tiempo', 'Camina o trota a un ritmo en el que todavía puedas hablar.'],
    ['Bicicleta', 'tiempo', 'Ajusta el asiento a la altura de la cadera y mantén un pedaleo constante.'],
    ['Elíptica', 'tiempo', 'Espalda recta y movimiento continuo; sube la resistencia poco a poco.'],
    ['Saltar la cuerda', 'tiempo', 'Saltos cortos sobre las puntas, girando la cuerda con las muñecas.'],
    ['Correr', 'tiempo', 'Empieza suave; alterna caminar y correr si apenas comienzas.']
  ],
  'En casa (sin equipo)': [
    ['Lagartijas', 'fuerza', 'Cuerpo recto como tabla; baja el pecho casi al piso y empuja. Sin peso, anota 0 kg.'],
    ['Sentadilla sin peso', 'fuerza', 'Baja como si te sentaras en una silla, con los talones siempre apoyados. Anota 0 kg.'],
    ['Desplantes', 'fuerza', 'Da un paso largo y baja hasta que ambas rodillas queden cerca de 90°. Alterna piernas.'],
    ['Puente de glúteo', 'fuerza', 'Acostado boca arriba, sube la cadera apretando los glúteos y baja lento.'],
    ['Burpees', 'fuerza', 'Baja a lagartija, regresa los pies, salta. Anota las repeticiones con 0 kg.'],
    ['Plancha', 'tiempo', 'Apoyado en antebrazos y puntas, cuerpo recto y abdomen apretado. Anota los minutos.'],
    ['Escaladores', 'tiempo', 'En posición de lagartija, lleva las rodillas al pecho alternando rápido.']
  ]
};
// Rutinas de ejemplo: [nombre, descripción, [[ejercicio, series, repeticiones]]].
const PLANES = [
  ['Empuje', 'Gimnasio · pecho, hombro y tríceps', [['Press de banca', 4, 8], ['Press militar', 3, 10], ['Fondos', 3, 10], ['Extensión de tríceps', 3, 12]]],
  ['Jalón', 'Gimnasio · espalda y bíceps', [['Dominadas', 4, 6], ['Remo con barra', 4, 8], ['Jalón al pecho', 3, 10], ['Curl de bíceps', 3, 12]]],
  ['Pierna', 'Gimnasio · pierna completa', [['Sentadilla', 4, 8], ['Peso muerto rumano', 3, 10], ['Prensa', 3, 12], ['Elevación de talones', 3, 15]]],
  ['Cuerpo completo', 'Gimnasio · para empezar, 2 o 3 veces por semana', [['Sentadilla', 3, 10], ['Press de banca', 3, 10], ['Jalón al pecho', 3, 10], ['Press militar', 2, 12], ['Plancha', 3, 0]]],
  ['En casa sin equipo', 'Casa · solo con tu peso', [['Sentadilla sin peso', 3, 15], ['Lagartijas', 3, 10], ['Desplantes', 3, 12], ['Puente de glúteo', 3, 15], ['Plancha', 3, 0]]],
  ['Cardio y abdomen', 'Gimnasio o casa · día ligero', [['Caminadora', 1, 0], ['Abdominales', 3, 15], ['Elevación de piernas', 3, 12], ['Plancha', 3, 0]]]
];
function ejemplo(nombre) {
  for (const grupo in CATALOGO) {
    const e = CATALOGO[grupo].find(x => igual(x[0], nombre));
    if (e) return { nombre: e[0], tipo: e[1], como: e[2] };
  }
  return null;
}
function opcionesGrupo(elegido) {
  return Object.keys(CATALOGO).map(g => `<option ${g === elegido ? 'selected' : ''}>${esc(g)}</option>`).join('');
}

// ---------- Datos ----------
function datosVacios() {
  return {
    descansoSeg: 90,   // cuenta regresiva entre series
    rutinas: [],       // { id, nombre, ejercicios: [{ id, nombre, tipo: 'fuerza' | 'tiempo', series, reps }] }
    sesiones: [],      // { id, fecha, nombre, ejercicios: [{ nombre, tipo, series: [{ peso, reps, min }] }] }
    activa: null       // sesión en curso, con la misma forma más `hecho` en cada serie
  };
}
function cargar() {
  try {
    return Object.assign(datosVacios(), JSON.parse(localStorage.getItem(CLAVE)) || {});
  } catch (e) {
    return datosVacios();
  }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento: sigue en memoria */ }
}

let datos = cargar();
const ui = { tab: 'hoy', ejercicio: '', grupo: 'Pecho', destino: '' };

// ---------- Cálculos ----------
function volumen(sesion) {
  return suma(sesion.ejercicios, e => e.tipo === 'fuerza' ? suma(e.series, s => s.peso * s.reps) : 0);
}
// Series de la última sesión terminada en la que se hizo ese ejercicio.
function ultimaVez(nombre) {
  for (let i = datos.sesiones.length - 1; i >= 0; i--) {
    const e = datos.sesiones[i].ejercicios.find(x => igual(x.nombre, nombre));
    if (e) return { fecha: datos.sesiones[i].fecha, series: e.series };
  }
  return null;
}
function textoSerie(tipo, s) { return tipo === 'fuerza' ? `${kilos(s.peso)} × ${s.reps}` : `${s.min} min`; }
// Semanas seguidas con al menos un entrenamiento; la actual puede estar aún vacía sin romper la racha.
function racha() {
  const semanas = new Set(datos.sesiones.map(s => lunes(s.fecha)));
  let w = lunes(hoy()), n = 0;
  if (!semanas.has(w)) w = sumarDias(w, -7);
  for (; semanas.has(w); w = sumarDias(w, -7)) n++;
  return n;
}
function serieNueva(tipo, previa, reps) {
  return tipo === 'fuerza'
    ? { peso: previa ? previa.peso : '', reps: previa ? previa.reps : reps || '', hecho: false }
    : { min: previa ? previa.min : '', hecho: false };
}
function ejercicioDeSesion(nombre, tipo, series, reps) {
  const ult = ultimaVez(nombre);
  return {
    nombre, tipo,
    series: Array.from({ length: series }, (_, i) => serieNueva(tipo, ult && (ult.series[i] || ult.series[ult.series.length - 1]), reps))
  };
}

// ---------- Pestaña: Hoy ----------
function vistaSesion() {
  const a = datos.activa;
  const tarjetas = a.ejercicios.map((e, i) => {
    const ult = ultimaVez(e.nombre);
    const filas = e.series.map((s, j) => e.tipo === 'fuerza' ? `
        <div class="serie ${s.hecho ? 'lista' : ''}">
          <span class="n">${j + 1}</span>
          <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="kg" value="${s.peso}" data-campo="peso" data-ej="${i}" data-serie="${j}" aria-label="Peso de la serie ${j + 1}">
          <span class="suave">kg ×</span>
          <input type="number" inputmode="numeric" min="0" step="1" placeholder="reps" value="${s.reps}" data-campo="reps" data-ej="${i}" data-serie="${j}" aria-label="Repeticiones de la serie ${j + 1}">
          <button class="hecho" data-accion="hecho" data-ej="${i}" data-serie="${j}" aria-pressed="${s.hecho}" aria-label="Serie ${j + 1} hecha">✓</button>
        </div>` : `
        <div class="serie tiempo ${s.hecho ? 'lista' : ''}">
          <span class="n">${j + 1}</span>
          <input type="number" inputmode="decimal" min="0" step="1" placeholder="minutos" value="${s.min}" data-campo="min" data-ej="${i}" data-serie="${j}" aria-label="Minutos">
          <span class="suave">min</span>
          <button class="hecho" data-accion="hecho" data-ej="${i}" data-serie="${j}" aria-pressed="${s.hecho}" aria-label="Hecho">✓</button>
        </div>`).join('');
    const ej = ejemplo(e.nombre);
    return `<section class="panel">
      <div class="fila entre"><h3>${esc(e.nombre)}</h3>
        <button class="boton icono" data-accion="quitar-ejercicio" data-ej="${i}" title="Quitar" aria-label="Quitar ejercicio">×</button></div>
      <p class="suave chico">${ult ? `Última vez (${fechaCorta(ult.fecha)}): ${ult.series.map(s => textoSerie(e.tipo, s)).join(' · ')}` : 'Primera vez que lo registras.'}</p>
      ${ej ? `<button class="ficha" style="margin-bottom:8px" data-accion="ver" data-nombre="${esc(ej.nombre)}">▶ Ver cómo se hace</button>` : ''}
      ${filas}
      <button class="boton secundario" style="margin-top:8px" data-accion="mas-serie" data-ej="${i}">+ Serie</button>
    </section>`;
  }).join('');

  return `
    <div class="fila entre" style="margin-bottom:12px">
      <h2 style="margin:0">${esc(a.nombre)}</h2><span class="suave chico">${fechaLarga(a.fecha)}</span>
    </div>
    ${tarjetas || '<p class="vacio">Agrega tu primer ejercicio aquí abajo.</p>'}
    <div class="panel">
      <h3 style="margin-bottom:8px">Agregar ejercicio</h3>
      <form class="formulario" data-form="ejercicio-sesion">
        <label class="ancho">Nombre<input name="nombre" list="conocidos" placeholder="Ej. Sentadilla" required></label>
        <label>Tipo<select name="tipo"><option value="fuerza">Peso y repeticiones</option><option value="tiempo">Tiempo</option></select></label>
        <button class="boton secundario">Agregar</button>
      </form>
      <datalist id="conocidos">${nombresConocidos().map(n => `<option value="${esc(n)}">`).join('')}</datalist>
      <div class="fila" style="margin:14px 0 8px"><span class="suave chico">O elige un ejemplo de</span>
        <select id="grupo" data-cambio="grupo" aria-label="Grupo de ejercicios">${opcionesGrupo(ui.grupo)}</select></div>
      <div class="fichas">${CATALOGO[ui.grupo].map(x => `<button class="ficha" data-accion="ejemplo-sesion" data-nombre="${esc(x[0])}" title="${esc(x[2])}">+ ${esc(x[0])}</button>`).join('')}</div>
    </div>
    <div class="lista-botones">
      <button class="boton ancho" data-accion="terminar">Terminar entrenamiento</button>
      <button class="boton peligro ancho" data-accion="cancelar">Descartar</button>
    </div>`;
}
function nombresConocidos() {
  const nombres = new Map();
  datos.rutinas.forEach(r => r.ejercicios.forEach(e => nombres.set(e.nombre.toLowerCase(), e.nombre)));
  datos.sesiones.forEach(s => s.ejercicios.forEach(e => nombres.set(e.nombre.toLowerCase(), e.nombre)));
  Object.values(CATALOGO).forEach(g => g.forEach(e => { if (!nombres.has(e[0].toLowerCase())) nombres.set(e[0].toLowerCase(), e[0]); }));
  return [...nombres.values()].sort((a, b) => a.localeCompare(b));
}
function vistaHoy() {
  if (datos.activa) return vistaSesion();
  const semana = lunes(hoy());
  const estaSemana = datos.sesiones.filter(s => s.fecha >= semana);
  const ultima = datos.sesiones[datos.sesiones.length - 1];
  return `
    <div class="tarjetas">
      <div class="tarjeta"><div class="etiqueta">Esta semana</div><div class="valor">${estaSemana.length}</div></div>
      <div class="tarjeta"><div class="etiqueta">Racha (semanas)</div><div class="valor">${racha()}</div></div>
      <div class="tarjeta"><div class="etiqueta">Total</div><div class="valor">${datos.sesiones.length}</div></div>
    </div>
    <div class="panel">
      <h2>Empezar entrenamiento</h2>
      <div class="lista-botones">
        ${datos.rutinas.map(r => `<button class="boton ancho" data-accion="empezar" data-id="${r.id}">${esc(r.nombre)}
          <span class="chico" style="font-weight:400"> · ${r.ejercicios.length} ejercicio${r.ejercicios.length === 1 ? '' : 's'}</span></button>`).join('')}
        <button class="boton secundario ancho" data-accion="empezar">Entrenamiento libre</button>
        ${datos.rutinas.length ? '' : '<button class="boton secundario ancho" data-accion="ir-ejemplos">Ver rutinas y ejercicios de ejemplo</button>'}
      </div>
      ${datos.rutinas.length ? '' : '<p class="suave chico" style="margin-top:10px">Aún no tienes rutinas. Créalas en la pestaña Rutinas, usa las de ejemplo o empieza un entrenamiento libre.</p>'}
    </div>
    ${ultima ? `<div class="panel"><h2>Último entrenamiento</h2>
      <p><b>${esc(ultima.nombre)}</b> · ${fechaLarga(ultima.fecha)}</p>
      <p class="suave chico">${ultima.ejercicios.map(e => `${esc(e.nombre)} (${e.series.length})`).join(' · ')}</p></div>` : ''}`;
}

// ---------- Pestaña: Rutinas ----------
function vistaRutinas() {
  if (!datos.rutinas.some(r => r.id === ui.destino)) ui.destino = datos.rutinas.length ? datos.rutinas[datos.rutinas.length - 1].id : '';
  const destino = ui.destino;
  const tarjetas = datos.rutinas.map(r => `<div class="panel">
      <div class="fila entre"><h2 style="margin:0">${esc(r.nombre)}</h2>
        <button class="boton icono" data-accion="borrar-rutina" data-id="${r.id}" title="Borrar" aria-label="Borrar rutina">×</button></div>
      ${r.ejercicios.length ? `<table><tbody>${r.ejercicios.map(e => `<tr>
          <td>${ejemplo(e.nombre) ? `<button class="enlace" data-accion="ver" data-nombre="${esc(e.nombre)}">▶ ${esc(e.nombre)}</button>` : esc(e.nombre)}</td>
          <td class="num suave">${e.tipo === 'fuerza' ? `${e.series} × ${e.reps}` : `${e.series} × tiempo`}</td>
          <td class="derecha"><button class="boton icono" data-accion="borrar-ejercicio" data-id="${r.id}" data-ej="${e.id}" title="Quitar" aria-label="Quitar ejercicio">×</button></td>
        </tr>`).join('')}</tbody></table>` : '<p class="vacio">Sin ejercicios todavía.</p>'}
      <form class="formulario" data-form="ejercicio-rutina" data-id="${r.id}" style="margin-top:10px">
        <label class="ancho">Ejercicio<input name="nombre" placeholder="Ej. Press de banca" required></label>
        <label>Tipo<select name="tipo"><option value="fuerza">Peso y reps</option><option value="tiempo">Tiempo</option></select></label>
        <label>Series<input type="number" name="series" min="1" max="20" value="3" required></label>
        <label>Reps<input type="number" name="reps" min="1" max="200" value="10"></label>
        <button class="boton secundario">Agregar</button>
      </form>
    </div>`).join('');
  return `
    ${tarjetas}
    <div class="panel">
      <h2>Nueva rutina</h2>
      <form class="formulario" data-form="rutina">
        <label class="ancho">Nombre<input name="nombre" placeholder="Ej. Pierna, Día A, Cardio" required></label>
        <button class="boton">Crear</button>
      </form>
    </div>
    <div class="panel" id="ejemplos">
      <h2>Ejemplos de rutinas</h2>
      <p class="suave chico">Agrega la que te sirva y luego cámbiale lo que quieras. Toca un ejercicio para ver su animación.</p>
      ${PLANES.map((pl, i) => {
        const ya = datos.rutinas.some(r => igual(r.nombre, pl[0]));
        return `<details class="ejemplo"><summary><b>${esc(pl[0])}</b> <span class="suave chico">· ${esc(pl[1])}</span></summary>
          <div class="fichas" style="margin:8px 0">${pl[2].map(x => `<button class="ficha" data-accion="ver" data-nombre="${esc(x[0])}">▶ ${esc(x[0])} <span class="suave">${ejemplo(x[0]).tipo === 'fuerza' ? x[1] + ' × ' + x[2] : x[1] + ' × tiempo'}</span></button>`).join('')}</div>
          <button class="boton secundario" data-accion="plan" data-plan="${i}" ${ya ? 'disabled' : ''}>${ya ? 'Ya la tienes' : 'Agregar a mis rutinas'}</button>
        </details>`;
      }).join('')}
    </div>
    <div class="panel">
      <h2>Ejemplos de ejercicios</h2>
      <div class="formulario" style="margin-bottom:10px">
        <label>Grupo<select id="grupo" data-cambio="grupo">${opcionesGrupo(ui.grupo)}</select></label>
        ${datos.rutinas.length ? `<label>Agregar a la rutina<select id="destino" data-cambio="destino">${datos.rutinas.map(r => `<option value="${r.id}" ${r.id === destino ? 'selected' : ''}>${esc(r.nombre)}</option>`).join('')}</select></label>` : ''}
      </div>
      <table><tbody>${CATALOGO[ui.grupo].map(x => `<tr>
        <td class="celda-mini"><button class="miniatura" data-accion="ver" data-nombre="${esc(x[0])}" aria-label="Ver animación de ${esc(x[0])}">${figura(x[0])}</button></td>
        <td><b>${esc(x[0])}</b>${musculosDe(x[0]).length ? ` <span class="chip musculo-chip">${musculosDe(x[0]).join(' · ')}</span>` : ''}<div class="suave chico">${esc(x[2])}</div></td>
        <td class="derecha">${datos.rutinas.length ? `<button class="boton secundario" data-accion="ejemplo-rutina" data-nombre="${esc(x[0])}" aria-label="Agregar ${esc(x[0])} a la rutina">+</button>` : ''}</td>
      </tr>`).join('')}</tbody></table>
      ${datos.rutinas.length ? '' : '<p class="suave chico" style="margin-top:8px">Crea una rutina para poder agregarle estos ejercicios.</p>'}
    </div>
    <div class="panel">
      <h2>Ajustes</h2>
      <label style="max-width:240px">Descanso entre series (segundos)
        <input type="number" id="descanso-seg" data-cambio="descanso" min="0" max="900" step="5" value="${datos.descansoSeg}"></label>
      <p class="suave chico" style="margin-top:10px">Tus datos se guardan solo en este navegador. Descarga un respaldo de vez en cuando o para pasarlos a otro dispositivo.</p>
      <div class="fila">
        <button class="boton secundario" data-accion="exportar">Descargar respaldo</button>
        <label class="boton secundario" style="cursor:pointer;flex-direction:row;font-size:16px">Restaurar respaldo
          <input type="file" accept="application/json,.json" data-cambio="importar" hidden></label>
      </div>
    </div>`;
}

// ---------- Pestaña: Historial ----------
function vistaHistorial() {
  if (!datos.sesiones.length) return '<p class="vacio">Aquí aparecerán tus entrenamientos terminados.</p>';
  return datos.sesiones.slice().reverse().map(s => `<div class="panel">
      <div class="fila entre"><div><b>${esc(s.nombre)}</b><div class="suave chico">${fechaLarga(s.fecha)}</div></div>
        <button class="boton icono" data-accion="borrar-sesion" data-id="${s.id}" title="Borrar" aria-label="Borrar entrenamiento">×</button></div>
      <p class="suave chico" style="margin-top:6px">${s.ejercicios.length} ejercicio${s.ejercicios.length === 1 ? '' : 's'} · ${suma(s.ejercicios, e => e.series.length)} series${volumen(s) ? ` · ${kilos(volumen(s))} movidos` : ''}</p>
      <details><summary class="chico">Ver detalle</summary>
        <table><tbody>${s.ejercicios.map(e => `<tr><td>${esc(e.nombre)}</td>
          <td class="num suave">${e.series.map(x => textoSerie(e.tipo, x)).join(' · ')}</td></tr>`).join('')}</tbody></table>
      </details>
    </div>`).join('');
}

// ---------- Pestaña: Progreso ----------
// Línea simple en SVG: un punto por sesión.
function grafica(puntos, unidad) {
  const an = 320, al = 150, mi = 34, md = 10, ms = 12, mb = 22;
  const valores = puntos.map(p => p.valor);
  const min = Math.min(...valores), max = Math.max(...valores);
  const rango = max - min || 1;
  const x = i => mi + (puntos.length === 1 ? (an - mi - md) / 2 : i * (an - mi - md) / (puntos.length - 1));
  const y = v => ms + (al - ms - mb) * (1 - (v - min) / rango);
  return `<svg class="grafica" viewBox="0 0 ${an} ${al}" role="img" aria-label="Progreso en ${unidad}">
    <line class="eje" x1="${mi}" y1="${al - mb}" x2="${an - md}" y2="${al - mb}"/>
    <text x="${mi - 6}" y="${y(max) + 4}" text-anchor="end">${Math.round(max * 10) / 10}</text>
    ${min !== max ? `<text x="${mi - 6}" y="${y(min) + 4}" text-anchor="end">${Math.round(min * 10) / 10}</text>` : ''}
    <text x="${mi}" y="${al - 6}">${fechaCorta(puntos[0].fecha)}</text>
    ${puntos.length > 1 ? `<text x="${an - md}" y="${al - 6}" text-anchor="end">${fechaCorta(puntos[puntos.length - 1].fecha)}</text>` : ''}
    <polyline class="linea" points="${puntos.map((p, i) => `${x(i)},${y(p.valor)}`).join(' ')}"/>
    ${puntos.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.valor)}" r="3.5"><title>${fechaCorta(p.fecha)}: ${p.valor} ${unidad}</title></circle>`).join('')}
  </svg>`;
}
function vistaProgreso() {
  // Entrenamientos por semana, últimas 8.
  const semanas = Array.from({ length: 8 }, (_, i) => sumarDias(lunes(hoy()), -7 * (7 - i)));
  const cuenta = semanas.map(w => datos.sesiones.filter(s => lunes(s.fecha) === w).length);
  const tope = Math.max(1, ...cuenta);
  const barras = semanas.map((w, i) => `<div title="Semana del ${fechaCorta(w)}: ${cuenta[i]}">
      <span>${cuenta[i] || ''}</span><i style="height:${cuenta[i] / tope * 70}%"></i></div>`).join('');

  const nombres = [...new Map(datos.sesiones.flatMap(s => s.ejercicios.map(e => [e.nombre.toLowerCase(), e.nombre]))).values()]
    .sort((a, b) => a.localeCompare(b));
  if (!nombres.some(n => igual(n, ui.ejercicio))) ui.ejercicio = nombres[0] || '';

  let detalle = '<p class="vacio">Termina un entrenamiento para ver aquí el avance de cada ejercicio.</p>';
  if (ui.ejercicio) {
    const veces = datos.sesiones.map(s => ({ fecha: s.fecha, e: s.ejercicios.find(x => igual(x.nombre, ui.ejercicio)) })).filter(x => x.e);
    const fuerza = veces[0].e.tipo === 'fuerza';
    const puntos = veces.map(v => ({
      fecha: v.fecha,
      valor: fuerza ? Math.max(...v.e.series.map(s => s.peso)) : suma(v.e.series, s => s.min)
    }));
    const mejor = Math.max(...puntos.map(p => p.valor));
    const mejorVolumen = fuerza ? Math.max(...veces.map(v => suma(v.e.series, s => s.peso * s.reps))) : 0;
    detalle = `
      <div class="tarjetas">
        <div class="tarjeta"><div class="etiqueta">Veces</div><div class="valor">${veces.length}</div></div>
        <div class="tarjeta"><div class="etiqueta">${fuerza ? 'Mejor peso' : 'Mejor tiempo'}</div><div class="valor">${fuerza ? kilos(mejor) : mejor + ' min'}</div></div>
        <div class="tarjeta"><div class="etiqueta">${fuerza ? 'Mejor volumen' : 'Tiempo total'}</div><div class="valor">${fuerza ? kilos(mejorVolumen) : suma(puntos, p => p.valor) + ' min'}</div></div>
      </div>
      <p class="suave chico">${fuerza ? 'Peso máximo por sesión (kg)' : 'Minutos por sesión'}</p>
      ${grafica(puntos, fuerza ? 'kg' : 'min')}
      <table style="margin-top:10px"><tbody>${veces.slice().reverse().slice(0, 8).map(v => `<tr><td class="num">${fechaCorta(v.fecha)}</td>
        <td class="num suave">${v.e.series.map(s => textoSerie(v.e.tipo, s)).join(' · ')}</td></tr>`).join('')}</tbody></table>`;
  }
  return `
    <div class="panel">
      <h2>Entrenamientos por semana</h2>
      <div class="semanas">${barras}</div>
      <p class="suave chico" style="margin-top:6px">Últimas 8 semanas; la de la derecha es la actual.</p>
    </div>
    <div class="panel">
      <div class="fila entre" style="margin-bottom:10px"><h2 style="margin:0">Por ejercicio</h2>
        ${nombres.length ? `<select id="ejercicio" data-cambio="ejercicio" aria-label="Ejercicio">${nombres.map(n => `<option ${igual(n, ui.ejercicio) ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>` : ''}</div>
      ${detalle}
    </div>`;
}

// ---------- Descanso entre series ----------
const barraDescanso = document.getElementById('descanso');
let reloj = null;
function pararDescanso() {
  clearInterval(reloj);
  reloj = null;
  barraDescanso.hidden = true;
}
function iniciarDescanso() {
  pararDescanso();
  if (!datos.descansoSeg) return;
  const fin = Date.now() + datos.descansoSeg * 1000;
  const pintarReloj = () => {
    const falta = Math.ceil((fin - Date.now()) / 1000);
    if (falta <= 0) {
      pararDescanso();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      return;
    }
    barraDescanso.innerHTML = `<span>Descanso</span><b>${Math.floor(falta / 60)}:${String(falta % 60).padStart(2, '0')}</b><button data-accion="saltar">Saltar</button>`;
    barraDescanso.hidden = false;
  };
  pintarReloj();
  reloj = setInterval(pintarReloj, 250);
}
barraDescanso.addEventListener('click', e => { if (e.target.closest('[data-accion=saltar]')) pararDescanso(); });

// ---------- Visor de animaciones ----------
const visor = document.getElementById('visor');
function abrirVisor(nombre) {
  const ej = ejemplo(nombre);
  if (!ej) return;
  const grupo = Object.keys(CATALOGO).find(g => CATALOGO[g].some(x => igual(x[0], nombre)));
  const ult = ultimaVez(nombre);
  visor.innerHTML = `
    <div class="fila entre" style="flex-wrap:nowrap;align-items:flex-start">
      <div><h2 style="margin:0 0 4px">${esc(ej.nombre)}</h2><span class="chip">${esc(grupo)}</span></div>
      <button class="boton icono" data-accion="cerrar" aria-label="Cerrar">×</button>
    </div>
    <div class="escenario">${figura(nombre)}</div>
    ${musculosDe(nombre).length ? `<p class="chico"><span class="punto-musculo"></span>Trabaja: <b>${musculosDe(nombre).join(', ')}</b> <span class="suave">(lo que se ve en naranja)</span></p>` : ''}
    <p>${esc(ej.como)}</p>
    <p class="suave chico">Se registra con ${ej.tipo === 'fuerza' ? 'peso y repeticiones' : 'tiempo en minutos'}.
      ${ult ? `Tu última vez (${fechaCorta(ult.fecha)}): ${ult.series.map(s => textoSerie(ej.tipo, s)).join(' · ')}.` : 'Aún no lo has registrado.'}</p>
    <button class="boton ancho" data-accion="cerrar">Cerrar</button>`;
  visor.showModal();
}
// Se cierra con el botón o tocando fuera del cuadro.
visor.addEventListener('click', e => { if (e.target === visor || e.target.closest('[data-accion=cerrar]')) visor.close(); });

// ---------- Pintar ----------
const VISTAS = { hoy: vistaHoy, rutinas: vistaRutinas, historial: vistaHistorial, progreso: vistaProgreso };
const vista = document.getElementById('vista');
function pintar() {
  vista.innerHTML = VISTAS[ui.tab]();
  document.querySelectorAll('#pestanas button').forEach(b => b.classList.toggle('activa', b.dataset.tab === ui.tab));
}
function cambio() { guardar(); pintar(); }

// ---------- Eventos ----------
document.getElementById('pestanas').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]');
  if (b) { ui.tab = b.dataset.tab; pintar(); window.scrollTo(0, 0); }
});

vista.addEventListener('click', e => {
  const b = e.target.closest('[data-accion]');
  if (!b) return;
  const a = datos.activa, id = b.dataset.id;
  switch (b.dataset.accion) {
    case 'empezar': {
      const r = datos.rutinas.find(x => x.id === id);
      datos.activa = {
        id: nuevoId(), fecha: hoy(), nombre: r ? r.nombre : 'Entrenamiento libre',
        ejercicios: r ? r.ejercicios.map(x => ejercicioDeSesion(x.nombre, x.tipo, x.series, x.reps)) : []
      };
      cambio(); window.scrollTo(0, 0); break;
    }
    case 'ver': abrirVisor(b.dataset.nombre); break;
    case 'ir-ejemplos':
      ui.tab = 'rutinas'; pintar();
      document.getElementById('ejemplos').scrollIntoView();
      break;
    case 'plan': {
      const [nombre, , ejercicios] = PLANES[b.dataset.plan];
      datos.rutinas.push({
        id: nuevoId(), nombre,
        ejercicios: ejercicios.map(([n, series, reps]) => ({ id: nuevoId(), nombre: n, tipo: ejemplo(n).tipo, series, reps: reps || 10 }))
      });
      cambio(); break;
    }
    case 'ejemplo-rutina': {
      const ej = ejemplo(b.dataset.nombre);
      datos.rutinas.find(r => r.id === ui.destino).ejercicios.push({
        id: nuevoId(), nombre: ej.nombre, tipo: ej.tipo, series: ej.tipo === 'fuerza' ? 3 : 1, reps: 10
      });
      cambio(); break;
    }
    case 'ejemplo-sesion': {
      const ej = ejemplo(b.dataset.nombre);
      a.ejercicios.push(ejercicioDeSesion(ej.nombre, ej.tipo, ej.tipo === 'fuerza' ? 3 : 1, 10));
      cambio(); break;
    }
    case 'hecho': {
      // Sin repintar, para no cerrar el teclado ni perder el lugar en el teléfono.
      const s = a.ejercicios[b.dataset.ej].series[b.dataset.serie];
      s.hecho = !s.hecho;
      b.closest('.serie').classList.toggle('lista', s.hecho);
      b.setAttribute('aria-pressed', s.hecho);
      guardar();
      if (s.hecho) iniciarDescanso(); else pararDescanso();
      break;
    }
    case 'mas-serie': {
      const ej = a.ejercicios[b.dataset.ej];
      ej.series.push(serieNueva(ej.tipo, ej.series[ej.series.length - 1]));
      cambio(); break;
    }
    case 'quitar-ejercicio':
      a.ejercicios.splice(b.dataset.ej, 1); cambio(); break;
    case 'terminar': {
      // Solo se guardan las series marcadas como hechas.
      const ejercicios = a.ejercicios.map(x => ({
        nombre: x.nombre, tipo: x.tipo,
        series: x.series.filter(s => s.hecho).map(s => x.tipo === 'fuerza' ? { peso: numero(s.peso), reps: numero(s.reps) } : { min: numero(s.min) })
      })).filter(x => x.series.length);
      if (!ejercicios.length) {
        if (!confirm('No marcaste ninguna serie como hecha. ¿Descartar este entrenamiento?')) break;
      } else {
        datos.sesiones.push({ id: a.id, fecha: a.fecha, nombre: a.nombre, ejercicios });
      }
      datos.activa = null;
      pararDescanso(); cambio(); window.scrollTo(0, 0); break;
    }
    case 'cancelar':
      if (confirm('¿Descartar este entrenamiento? No se guardará.')) { datos.activa = null; pararDescanso(); cambio(); }
      break;
    case 'borrar-rutina':
      if (confirm('¿Borrar esta rutina? Tu historial no se borra.')) { datos.rutinas = datos.rutinas.filter(r => r.id !== id); cambio(); }
      break;
    case 'borrar-ejercicio': {
      const r = datos.rutinas.find(x => x.id === id);
      r.ejercicios = r.ejercicios.filter(x => x.id !== b.dataset.ej);
      cambio(); break;
    }
    case 'borrar-sesion':
      if (confirm('¿Borrar este entrenamiento del historial?')) { datos.sesiones = datos.sesiones.filter(s => s.id !== id); cambio(); }
      break;
    case 'exportar': exportar(); break;
  }
});

vista.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(f));
  switch (f.dataset.form) {
    case 'rutina':
      datos.rutinas.push({ id: nuevoId(), nombre: v.nombre.trim(), ejercicios: [] });
      break;
    case 'ejercicio-rutina':
      datos.rutinas.find(r => r.id === f.dataset.id).ejercicios.push({
        id: nuevoId(), nombre: v.nombre.trim(), tipo: v.tipo, series: Math.max(1, numero(v.series)), reps: numero(v.reps) || 10
      });
      break;
    case 'ejercicio-sesion':
      datos.activa.ejercicios.push(ejercicioDeSesion(v.nombre.trim(), v.tipo, v.tipo === 'fuerza' ? 3 : 1, 10));
      break;
  }
  cambio();
});

vista.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.campo) {
    // Peso, repeticiones o minutos de una serie: se guarda sin repintar.
    datos.activa.ejercicios[el.dataset.ej].series[el.dataset.serie][el.dataset.campo] = el.value === '' ? '' : Math.max(0, numero(el.value));
    guardar();
    return;
  }
  switch (el.dataset.cambio) {
    case 'descanso': datos.descansoSeg = Math.max(0, numero(el.value)); guardar(); break;
    case 'ejercicio': ui.ejercicio = el.value; pintar(); break;
    case 'grupo': ui.grupo = el.value; pintar(); break;
    case 'destino': ui.destino = el.value; break;
    case 'importar': importar(el.files[0]); break;
  }
});

// ---------- Respaldo ----------
function exportar() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' }));
  a.download = `entrenamiento-${hoy()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importar(archivo) {
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const nuevo = JSON.parse(lector.result);
      if (!Array.isArray(nuevo.rutinas) || !Array.isArray(nuevo.sesiones)) throw new Error();
      if (!confirm('Esto reemplaza todos los datos actuales por los del respaldo. ¿Continuar?')) return;
      datos = Object.assign(datosVacios(), nuevo);
      cambio();
    } catch (e) {
      alert('Ese archivo no es un respaldo válido de esta aplicación.');
    }
  };
  lector.readAsText(archivo);
}

pintar();
