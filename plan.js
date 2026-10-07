// Plan de entrenamiento y alimentación. Usa los datos y utilidades de app.js y la anatomía de musculos.js.

// ---------- Plan de entrenamiento ----------
// series: [ejercicios base, accesorios] · sem: rango de series por músculo a la semana que se busca.
const OBJETIVOS = {
  musculo: { nombre: 'Ganar músculo', reps: 10, rango: [8, 12], repsTexto: '8 a 12', series: [4, 3], descanso: 90, sem: [10, 20], cardio: false },
  fuerza: { nombre: 'Ganar fuerza', reps: 5, rango: [4, 6], repsTexto: '4 a 6', series: [5, 3], descanso: 180, sem: [6, 12], cardio: false },
  grasa: { nombre: 'Bajar grasa', reps: 12, rango: [10, 15], repsTexto: '10 a 15', series: [3, 3], descanso: 60, sem: [8, 15], cardio: true },
  salud: { nombre: 'Salud y condición', reps: 12, rango: [10, 12], repsTexto: '10 a 12', series: [3, 2], descanso: 75, sem: [6, 10], cardio: true }
};
// Días de entrenamiento: los primeros ejercicios de cada día son los básicos (varios músculos a la vez).
const DIAS_PLAN = {
  'Cuerpo completo A': ['Sentadilla', 'Press de banca', 'Remo con barra', 'Press militar', 'Curl femoral', 'Plancha'],
  'Cuerpo completo B': ['Peso muerto rumano', 'Press inclinado con mancuernas', 'Jalón al pecho', 'Desplantes', 'Elevaciones laterales', 'Abdominales'],
  'Torso A': ['Press de banca', 'Remo con barra', 'Press militar', 'Jalón al pecho', 'Curl de bíceps', 'Extensión de tríceps'],
  'Torso B': ['Press inclinado con mancuernas', 'Dominadas', 'Elevaciones laterales', 'Remo con mancuerna', 'Curl martillo', 'Fondos'],
  'Pierna A': ['Sentadilla', 'Peso muerto rumano', 'Prensa', 'Curl femoral', 'Elevación de talones', 'Plancha'],
  'Pierna B': ['Peso muerto', 'Desplantes', 'Extensión de cuádriceps', 'Curl femoral', 'Elevación de talones', 'Elevación de piernas'],
  'Empuje': ['Press de banca', 'Press militar', 'Press inclinado con mancuernas', 'Elevaciones laterales', 'Extensión de tríceps', 'Fondos'],
  'Jalón': ['Dominadas', 'Remo con barra', 'Jalón al pecho', 'Pájaros', 'Curl de bíceps', 'Curl martillo'],
  'Casa A': ['Sentadilla sin peso', 'Lagartijas', 'Puente de glúteo', 'Plancha', 'Escaladores'],
  'Casa B': ['Desplantes', 'Lagartijas', 'Burpees', 'Abdominales', 'Elevación de piernas', 'Plancha']
};
const REPARTOS = {
  gimnasio: {
    2: ['Cuerpo completo A', 'Cuerpo completo B'],
    3: ['Cuerpo completo A', 'Cuerpo completo B', 'Cuerpo completo A'],
    4: ['Torso A', 'Pierna A', 'Torso B', 'Pierna B'],
    5: ['Empuje', 'Jalón', 'Pierna A', 'Torso B', 'Pierna B'],
    6: ['Empuje', 'Jalón', 'Pierna A', 'Empuje', 'Jalón', 'Pierna B']
  },
  casa: {
    2: ['Casa A', 'Casa B'], 3: ['Casa A', 'Casa B', 'Casa A'], 4: ['Casa A', 'Casa B', 'Casa A', 'Casa B'],
    5: ['Casa A', 'Casa B', 'Casa A', 'Casa B', 'Casa A'], 6: ['Casa A', 'Casa B', 'Casa A', 'Casa B', 'Casa A', 'Casa B']
  }
};
// Cuánto se aprieta en las series de fuerza: series de más o de menos y cuántas repeticiones dejar "en reserva".
const INTENSIDAD = {
  ligera: { nombre: 'Ligera', series: -1, texto: 'termina cada serie sintiendo que podrías hacer 3 o 4 repeticiones más' },
  normal: { nombre: 'Normal', series: 0, texto: 'termina cada serie sintiendo que podrías hacer 2 o 3 repeticiones más' },
  alta: { nombre: 'Alta', series: 1, texto: 'termina cada serie sintiendo que solo podrías hacer 1 o 2 más; úsala cuando ya domines la técnica' }
};
// Cardio que se puede elegir según el lugar. Los primeros de casa no llevan saltos.
const CARDIO = {
  gimnasio: ['Caminadora', 'Bicicleta', 'Elíptica', 'Saltar la cuerda', 'Marcha en el lugar', 'Subir escaleras', 'Boxeo de sombra', 'Caminar al aire libre'],
  casa: ['Marcha en el lugar', 'Subir escaleras', 'Boxeo de sombra', 'Caminar al aire libre', 'Saltos de tijera', 'Rodillas al pecho', 'Saltar la cuerda', 'Correr']
};
const SIN_SALTOS = ['Marcha en el lugar', 'Subir escaleras', 'Boxeo de sombra', 'Caminar al aire libre', 'Caminadora', 'Bicicleta', 'Elíptica'];
// Intensidad del cardio: cómo debe sentirse y qué parte del pulso máximo (220 menos la edad) le corresponde.
const CARDIO_INTENSIDAD = {
  suave: { nombre: 'Suave', texto: 'puedes platicar sin problema (esfuerzo 3 a 4 de 10)', pulso: [0.55, 0.65] },
  moderada: { nombre: 'Moderada', texto: 'puedes hablar, pero en frases cortas (esfuerzo 5 a 6 de 10)', pulso: [0.65, 0.75] },
  intensa: { nombre: 'Intensa, por intervalos', texto: 'alterna 30 segundos fuerte con 60 suaves; en lo fuerte casi no puedes hablar (esfuerzo 8 a 9 de 10)', pulso: [0.80, 0.90] }
};
function cardioDelPlan(cfg) {
  const o = OBJETIVOS[cfg.objetivo];
  if (cfg.cardio === 'no' || (cfg.cardio === 'auto' && !o.cardio)) return null;
  const tipo = CARDIO[cfg.lugar].includes(cfg.cardioTipo) ? cfg.cardioTipo : CARDIO[cfg.lugar][0];
  const nivel = CARDIO_INTENSIDAD[cfg.cardioIntensidad] || CARDIO_INTENSIDAD.moderada;
  return { tipo, min: cfg.cardioMin || 20, nivel, nota: `${nivel.nombre}: ${nivel.texto}.` };
}

const DIAS_SEMANA = { 2: ['Lun', 'Jue'], 3: ['Lun', 'Mié', 'Vie'], 4: ['Lun', 'Mar', 'Jue', 'Vie'], 5: ['Lun', 'Mar', 'Mié', 'Vie', 'Sáb'], 6: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] };

function generarPlan(cfg) {
  const o = OBJETIVOS[cfg.objetivo], principiante = cfg.nivel === 'principiante', avanzado = cfg.nivel === 'avanzado';
  const fuerza = INTENSIDAD[cfg.intensidad] || INTENSIDAD.normal, cardio = cardioDelPlan(cfg);
  const nombres = REPARTOS[cfg.lugar][cfg.dias];
  // Series de los ejercicios básicos y de los accesorios: quien empieza hace una menos (nunca menos de 3 antes
  // del ajuste de intensidad) y quien va avanzado una más; la intensidad suma o resta otra. Entre 2 y 5.
  const base = Math.min(5, Math.max(2, (principiante ? Math.max(3, o.series[0] - 1) : o.series[0] + (avanzado ? 1 : 0)) + fuerza.series));
  const accesorio = Math.max(2, Math.min(base, 4, o.series[1] + (avanzado ? 1 : 0) + fuerza.series));
  const armar = nombre => {
    const ejercicios = DIAS_PLAN[nombre].slice(0, principiante ? 5 : 6).map((n, i) => {
      const tipo = ejemplo(n).tipo;
      return { nombre: n, tipo, series: tipo === 'tiempo' ? 3 : i < 3 ? base : accesorio, reps: o.reps };
    });
    if (cardio) ejercicios.push({ nombre: cardio.tipo, tipo: 'tiempo', series: 1, reps: o.reps, min: cardio.min, nota: cardio.nota });
    return { nombre, ejercicios };
  };
  const unicos = [...new Set(nombres)].map(armar);
  const semana = nombres.map((n, i) => ({ dia: DIAS_SEMANA[cfg.dias][i], rutina: n }));
  const porMusculo = {};
  nombres.forEach(n => unicos.find(u => u.nombre === n).ejercicios.forEach(e => { if (e.tipo === 'fuerza') sumarSeries(porMusculo, e.nombre, e.series); }));
  return { objetivo: o, rutinas: unicos, semana, porMusculo, cardio, fuerza };
}
// Series por músculo en los entrenamientos terminados de una semana (de lunes a domingo).
function volumenSemana(inicio) {
  const fin = sumarDias(inicio, 6), total = {};
  datos.sesiones.filter(s => s.fecha >= inicio && s.fecha <= fin).forEach(s =>
    s.ejercicios.forEach(e => { if (e.tipo === 'fuerza') sumarSeries(total, e.nombre, e.series.length); }));
  return total;
}
// Barras de series por músculo comparadas contra el rango semanal del objetivo.
function tablaVolumen(porMusculo, rango) {
  const tope = Math.max(rango[1], ...Object.values(porMusculo), 1);
  return `<table class="volumen"><tbody>${Object.keys(MUSCULOS).map(m => {
    const v = porMusculo[m] || 0;
    const estado = v === 0 ? ['Sin trabajo', 'gris'] : v < rango[0] ? ['Poco', 'ambar'] : v <= rango[1] ? ['Bien', 'verde'] : ['Mucho', 'rojo'];
    return `<tr><td>${MUSCULOS[m]}</td>
      <td class="barra-celda"><div class="barra"><i class="${estado[1]}" style="width:${v / tope * 100}%"></i>
        <b style="left:${rango[0] / tope * 100}%;width:${(rango[1] - rango[0]) / tope * 100}%"></b></div></td>
      <td class="num derecha">${Math.round(v * 10) / 10}</td><td><span class="estado ${estado[1]}">${estado[0]}</span></td></tr>`;
  }).join('')}</tbody></table>`;
}
function nivelesDeVolumen(porMusculo, rango) {
  const niveles = {};
  Object.keys(porMusculo).forEach(m => { niveles[m] = porMusculo[m] / rango[1]; });
  return niveles;
}

function vistaPlan() {
  const cfg = datos.plan, plan = generarPlan(cfg), o = plan.objetivo;
  const opcion = (valor, texto, actual) => `<option value="${valor}" ${String(valor) === String(actual) ? 'selected' : ''}>${texto}</option>`;
  const yaCreado = plan.rutinas.every(r => datos.rutinas.some(x => x.plan && igual(x.nombre, r.nombre)));
  const semana = lunes(hoy());
  return `
    <div class="panel">
      <h2>Mi plan</h2>
      <div class="formulario">
        <label>Objetivo<select id="plan-objetivo" data-cambio="plan" data-campo="objetivo">${Object.keys(OBJETIVOS).map(k => opcion(k, OBJETIVOS[k].nombre, cfg.objetivo)).join('')}</select></label>
        <label>Nivel<select id="plan-nivel" data-cambio="plan" data-campo="nivel">${opcion('principiante', 'Principiante (menos de 6 meses)', cfg.nivel)}${opcion('intermedio', 'Intermedio', cfg.nivel)}${opcion('avanzado', 'Avanzado (más de 2 años)', cfg.nivel)}</select></label>
        <label>Intensidad<select id="plan-intensidad" data-cambio="plan" data-campo="intensidad">${Object.keys(INTENSIDAD).map(k => opcion(k, INTENSIDAD[k].nombre, cfg.intensidad)).join('')}</select></label>
        <label>Días por semana<select id="plan-dias" data-cambio="plan" data-campo="dias">${[2, 3, 4, 5, 6].map(d => opcion(d, d + ' días', cfg.dias)).join('')}</select></label>
        <label>Lugar<select id="plan-lugar" data-cambio="plan" data-campo="lugar">${opcion('gimnasio', 'Gimnasio', cfg.lugar)}${opcion('casa', 'Casa sin equipo', cfg.lugar)}</select></label>
      </div>
    </div>

    <div class="panel">
      <h2>Tu semana</h2>
      <div class="semana-plan">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => {
        const dia = plan.semana.find(x => x.dia === d);
        return `<div class="${dia ? 'activo' : ''}"><span>${d}</span><b>${dia ? esc(dia.rutina) : 'Descanso'}</b></div>`;
      }).join('')}</div>
      <p class="chico" style="margin-top:10px"><b>${o.repsTexto} repeticiones</b> por serie y <b>${o.descanso} segundos</b> de descanso entre series. Intensidad ${plan.fuerza.nombre.toLowerCase()}: ${plan.fuerza.texto}.</p>
    </div>

    <div class="panel">
      <h2>Cardio</h2>
      <div class="formulario">
        <label>¿Incluir cardio?<select id="plan-cardio" data-cambio="plan" data-campo="cardio">
          ${opcion('auto', `Según mi objetivo (${o.cardio ? 'sí' : 'no'})`, cfg.cardio)}${opcion('si', 'Sí, siempre', cfg.cardio)}${opcion('no', 'No', cfg.cardio)}</select></label>
        ${plan.cardio ? `
        <label class="ancho">Qué cardio<select id="plan-cardio-tipo" data-cambio="plan" data-campo="cardioTipo">
          ${CARDIO[cfg.lugar].map(n => opcion(n, n + (SIN_SALTOS.includes(n) ? ' · sin saltos' : ''), plan.cardio.tipo)).join('')}</select></label>
        <label>Minutos<input type="number" id="plan-cardio-min" data-cambio="plan" data-campo="cardioMin" min="5" max="90" step="5" value="${plan.cardio.min}"></label>
        <label class="ancho">Intensidad<select id="plan-cardio-int" data-cambio="plan" data-campo="cardioIntensidad">
          ${Object.keys(CARDIO_INTENSIDAD).map(k => opcion(k, CARDIO_INTENSIDAD[k].nombre, cfg.cardioIntensidad)).join('')}</select></label>` : ''}
      </div>
      ${plan.cardio ? `
      <div class="fila" style="margin-top:12px;flex-wrap:nowrap;align-items:flex-start">
        <button class="miniatura" data-accion="ver" data-nombre="${esc(plan.cardio.tipo)}" aria-label="Ver animación de ${esc(plan.cardio.tipo)}">${figura(plan.cardio.tipo)}</button>
        <div class="chico">
          <p><b>${esc(plan.cardio.tipo)}, ${plan.cardio.min} minutos</b> al final de cada entrenamiento.</p>
          <p>${esc(ejemplo(plan.cardio.tipo).como)}</p>
          <p><b>${plan.cardio.nivel.nombre}:</b> ${plan.cardio.nivel.texto}.${numero(datos.perfil.edad) ? ` Para tu edad eso es un pulso de unas <b>${Math.round((220 - numero(datos.perfil.edad)) * plan.cardio.nivel.pulso[0])} a ${Math.round((220 - numero(datos.perfil.edad)) * plan.cardio.nivel.pulso[1])} pulsaciones</b> por minuto.` : ''}</p>
        </div>
      </div>
      ${cfg.cardioIntensidad === 'intensa' ? '<div class="aviso">Los intervalos intensos son para quien ya tiene condición. Si apenas empiezas, o tienes presión alta o problemas del corazón, quédate en suave o moderada.</div>' : ''}`
      : '<p class="suave chico" style="margin-top:10px">Este plan no lleva cardio. Puedes activarlo aquí cuando quieras.</p>'}
    </div>

    ${plan.rutinas.map(r => `<div class="panel">
      <h2>${esc(r.nombre)}</h2>
      <table><tbody>${r.ejercicios.map(e => `<tr>
        <td><button class="enlace" data-accion="ver" data-nombre="${esc(e.nombre)}">▶ ${esc(e.nombre)}</button>
          <div class="suave chico">${(trabajo(e.nombre) || { principales: [] }).principales.map(m => MUSCULOS[m]).join(' · ')}</div></td>
        <td class="num derecha">${e.tipo === 'fuerza' ? `${e.series} × ${o.repsTexto}` : e.min ? `${e.min} min` : `${e.series} × tiempo`}</td>
      </tr>`).join('')}</tbody></table>
    </div>`).join('')}

    <div class="panel">
      <button class="boton ancho" data-accion="crear-plan">${yaCreado ? 'Actualizar las rutinas del plan' : 'Crear las rutinas de este plan'}</button>
      <p class="suave chico" style="margin-top:8px">Se agregan a tu pestaña Rutinas (reemplazan las de un plan anterior, no las que hiciste tú) y el descanso entre series se ajusta a ${o.descanso} segundos.</p>
    </div>

    <div class="panel">
      <h2>Series por músculo a la semana con este plan</h2>
      <p class="suave chico">Cada serie cuenta 1 para el músculo principal y media para los secundarios. La franja marca el rango que se busca para "${o.nombre.toLowerCase()}": de ${o.sem[0]} a ${o.sem[1]} series por músculo a la semana.</p>
      ${mapaMuscular(nivelesDeVolumen(plan.porMusculo, o.sem))}
      ${tablaVolumen(plan.porMusculo, o.sem)}
      ${cfg.lugar === 'casa' ? '<div class="aviso">Sin equipo casi no se trabaja la espalda ni el bíceps, porque no hay con qué jalar. Con una barra de dominadas o unas ligas lo compensas.</div>' : ''}
    </div>

    <div class="panel">
      <h2>Lo que llevas esta semana</h2>
      <p class="suave chico">Series reales de tus entrenamientos terminados desde el lunes.</p>
      ${tablaVolumen(volumenSemana(semana), o.sem)}
    </div>

    <div class="panel">
      <h2>Cómo avanzar</h2>
      <ul class="lista">
        <li><b>Empieza ligero.</b> La primera semana usa un peso con el que termines cada serie sintiendo que podrías hacer 2 o 3 repeticiones más.</li>
        <li><b>Sube de a poco.</b> Cuando completes todas las series en la parte alta del rango (${o.repsTexto}), sube el peso lo mínimo posible la siguiente vez.</li>
        <li><b>Técnica antes que peso.</b> Si para subir el peso tienes que cambiar el movimiento, todavía no es momento de subirlo.</li>
        <li><b>Descansa.</b> Deja al menos un día entre dos entrenamientos del mismo músculo y duerme 7 horas o más.</li>
        <li><b>Revisa cada 6 a 8 semanas.</b> Si un músculo se queda en "Poco", agrégale una serie; si algo duele, quítalo y consulta.</li>
      </ul>
      <p class="suave chico">Es una guía general para personas sanas. Si tienes una lesión, una enfermedad o llevas mucho sin hacer ejercicio, consulta primero con un médico o entrenador.</p>
    </div>`;
}
function crearRutinasDelPlan() {
  const plan = generarPlan(datos.plan);
  datos.rutinas = datos.rutinas.filter(r => !r.plan);
  plan.rutinas.forEach(r => datos.rutinas.push({
    id: nuevoId(), nombre: r.nombre, plan: true,
    ejercicios: r.ejercicios.map(e => ({ id: nuevoId(), nombre: e.nombre, tipo: e.tipo, series: e.series, reps: e.reps, rango: plan.objetivo.rango, min: e.min, nota: e.nota }))
  }));
  datos.descansoSeg = plan.objetivo.descanso;
}

// ---------- El plan en el día a día ----------
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
function sesionesEntre(desde, hasta) { return datos.sesiones.filter(s => s.fecha >= desde && s.fecha <= hasta); }
// Los 7 días de esta semana: qué rutina toca y cómo va cada uno.
function semanaDelPlan() {
  const plan = generarPlan(datos.plan), inicio = lunes(hoy());
  return DIAS_CORTOS.map((d, i) => {
    const f = sumarDias(inicio, i), toca = plan.semana.find(x => x.dia === d);
    const hecho = datos.sesiones.some(s => s.fecha === f);
    // Un día anterior a la creación del plan no cuenta como falta.
    const antes = f < (datos.plan.desde || hoy());
    return { d, f, rutina: toca ? toca.rutina : null, hecho, estado: hecho ? 'hecho' : !toca || antes ? 'descanso' : f < hoy() ? 'falto' : f === hoy() ? 'hoy' : 'pendiente' };
  });
}
// Cumplimiento de las últimas semanas completas (hasta 4) desde que se creó el plan. Entrenar otro día
// de la semana también cuenta: lo que importa es llegar al número de días planeado.
function cumplimiento() {
  if (!datos.plan.desde) return null;
  let hechas = 0, planeadas = 0;
  for (let w = sumarDias(lunes(hoy()), -7), i = 0; i < 4 && w >= lunes(datos.plan.desde); w = sumarDias(w, -7), i++) {
    hechas += Math.min(datos.plan.dias, sesionesEntre(w, sumarDias(w, 6)).length);
    planeadas += datos.plan.dias;
  }
  return planeadas ? { hechas, planeadas, pct: Math.round(hechas / planeadas * 100) } : null;
}
function panelHoyPlan() {
  if (!datos.rutinas.some(r => r.plan)) {
    return `<div class="panel"><h2>Tu plan</h2>
      <p class="suave chico">Arma tu plan y aquí verás qué toca cada día y cómo vas cumpliendo.</p>
      <button class="boton secundario" data-accion="ir" data-tab="plan">Armar mi plan</button></div>`;
  }
  const semana = semanaDelPlan(), dia = semana.find(x => x.f === hoy());
  const rutinaDe = nombre => datos.rutinas.find(r => r.plan && igual(r.nombre, nombre));
  const boton = (r, texto, clase) => `<button class="boton ancho ${clase || ''}" data-accion="empezar" data-id="${r.id}">${texto}
      <span class="chico" style="font-weight:400"> · ${r.ejercicios.length} ejercicios</span></button>`;
  const hechasSemana = sesionesEntre(lunes(hoy()), sumarDias(lunes(hoy()), 6)).length;
  const siguiente = semana.find(x => x.f > hoy() && x.rutina);
  const falto = semana.find(x => x.estado === 'falto' && rutinaDe(x.rutina));
  const hoyRutina = dia.rutina && rutinaDe(dia.rutina);
  const despues = siguiente ? `Sigue: ${siguiente.d} · ${esc(siguiente.rutina)}.` : 'Ya no hay más entrenamientos esta semana.';

  let cabeza;
  if (dia.hecho) cabeza = `<h2>✓ Hoy ya entrenaste</h2><p class="suave chico">${despues}</p>`;
  else if (hoyRutina) cabeza = `<h2>Hoy toca: ${esc(hoyRutina.nombre)}</h2>${boton(hoyRutina, 'Empezar ' + esc(hoyRutina.nombre))}`;
  else cabeza = `<h2>Hoy es día de descanso</h2><p class="suave chico">${despues}</p>`;
  // Un día perdido se puede reponer hoy, si hoy no hay otra cosa pendiente.
  const reponer = falto && !dia.hecho && !hoyRutina && hechasSemana < datos.plan.dias
    ? `<div style="margin-top:8px">${boton(rutinaDe(falto.rutina), `Reponer ${esc(falto.rutina)} (del ${falto.d})`, 'secundario')}</div>` : '';

  const c = cumplimiento();
  return `<div class="panel">
    ${cabeza}${reponer}
    <div class="semana-plan" style="margin-top:12px">${semana.map(x => `<div class="${x.estado}" title="${x.rutina ? esc(x.rutina) : 'Descanso'}">
      <span>${x.d}</span><b>${x.estado === 'hecho' ? '✓' : x.estado === 'falto' ? 'Faltó' : x.rutina ? esc(x.rutina) : '—'}</b></div>`).join('')}</div>
    <p class="chico" style="margin:10px 0 0">Esta semana: <b>${Math.min(hechasSemana, datos.plan.dias)} de ${datos.plan.dias}</b> entrenamientos.
      ${c ? `Cumplimiento de las últimas ${c.planeadas / datos.plan.dias} semana${c.planeadas / datos.plan.dias === 1 ? '' : 's'}: <b>${c.pct}%</b>.` : ''}</p>
  </div>`;
}

// ---------- Alimentación ----------
const ACTIVIDAD = {
  sedentario: ['Sentado casi todo el día', 1.2], ligero: ['De pie o caminando parte del día', 1.375],
  moderado: ['Trabajo físico moderado', 1.55], alto: ['Trabajo físico pesado', 1.725]
};
// Por objetivo: proteína por kilo y cuánto se mueven las calorías según el ritmo elegido.
const NUTRICION = {
  musculo: { proteina: 1.8, ritmos: { suave: 0.05, moderado: 0.10, rapido: 0.15 }, nombres: ['Lento (sube menos grasa)', 'Moderado', 'Rápido'] },
  fuerza: { proteina: 1.8, ritmos: { suave: 0, moderado: 0.05, rapido: 0.10 }, nombres: ['Sin subir de peso', 'Moderado', 'Rápido'] },
  grasa: { proteina: 2.0, ritmos: { suave: -0.10, moderado: -0.20, rapido: -0.25 }, nombres: ['Lento (más fácil de sostener)', 'Moderado', 'Rápido'] },
  salud: { proteina: 1.4, ritmos: { suave: 0, moderado: 0, rapido: 0 }, nombres: null }
};
// Devuelve null si faltan datos del perfil.
function metasNutricion() {
  const p = datos.perfil, n = NUTRICION[datos.plan.objetivo];
  const peso = numero(p.peso), estatura = numero(p.estatura), edad = numero(p.edad);
  if (!p.sexo || !peso || !estatura || !edad) return null;
  // Gasto en reposo con la fórmula de Mifflin-St Jeor, por el nivel de actividad diaria.
  const reposo = 10 * peso + 6.25 * estatura - 5 * edad + (p.sexo === 'hombre' ? 5 : -161);
  // Se suma al factor de actividad lo que aporta entrenar los días del plan.
  const factor = ACTIVIDAD[p.actividad][1] + datos.plan.dias * 0.025;
  const gasto = reposo * factor;
  const ajuste = n.ritmos[p.ritmo] !== undefined ? n.ritmos[p.ritmo] : n.ritmos.moderado;
  // Nunca por debajo del gasto en reposo ni de un mínimo prudente.
  const minimo = Math.max(reposo, p.sexo === 'hombre' ? 1500 : 1200);
  const calculadas = Math.max(minimo, gasto * (1 + ajuste));
  // Si un profesional ya te indicó tus calorías, mandan esas.
  const propias = numero(p.caloriasPropias) > 0;
  const calorias = propias ? numero(p.caloriasPropias) : calculadas;
  const protKg = p.proteinaKg === 'auto' || !numero(p.proteinaKg) ? n.proteina : numero(p.proteinaKg);
  const proteina = peso * protKg;
  const grasa = Math.max(peso * 0.9, calorias * 0.2 / 9);
  const carbos = Math.max(0, (calorias - proteina * 4 - grasa * 9) / 4);
  // Cambio de peso esperado: unas 7,700 kcal por kilo. Es una aproximación gruesa.
  const kgSemana = (calorias - gasto) * 7 / 7700;
  const meta = numero(p.pesoMeta);
  const semanas = meta && Math.abs(kgSemana) > 0.02 && (meta - peso) / kgSemana > 0 ? Math.ceil((meta - peso) / kgSemana) : null;
  const pct = Math.round((calorias / gasto - 1) * 100);
  const texto = propias ? 'la que indicaste tú' : pct === 0 ? 'igual a tu gasto, para mantener tu peso' : `un ${Math.abs(pct)}% ${pct < 0 ? 'abajo' : 'arriba'} de tu gasto`;
  return {
    reposo, gasto, calorias, proteina, protKg, grasa, carbos, agua: peso * 35 / 1000, fibra: calorias / 1000 * 14,
    topado: !propias && calculadas === minimo && gasto * (1 + ajuste) < minimo, bajoMinimo: propias && calorias < minimo,
    texto, kgSemana, semanas, meta, peso, edad, comidas: Math.max(2, numero(p.comidas) || 4), n
  };
}
// Proteína aproximada de alimentos comunes: [alimento, porción, gramos de proteína].
const ALIMENTOS = [
  ['Pechuga de pollo cocida', '100 g', 31], ['Atún en agua', '1 lata (120 g drenada)', 28], ['Carne de res magra cocida', '100 g', 26],
  ['Pescado blanco cocido', '100 g', 22], ['Queso panela', '100 g', 18], ['Huevo', '1 pieza', 6], ['Claras de huevo', '3 piezas', 11],
  ['Yogur griego natural', '1 taza (200 g)', 18], ['Leche', '1 vaso (250 ml)', 8], ['Frijoles cocidos', '1 taza', 15],
  ['Lentejas cocidas', '1 taza', 18], ['Avena', '½ taza en seco (40 g)', 5], ['Tortilla de maíz', '1 pieza', 1.5],
  ['Arroz cocido', '1 taza', 4], ['Cacahuates', '30 g (un puño)', 7]
];
function vistaComida() {
  const p = datos.perfil, m = metasNutricion();
  const opcion = (valor, texto, actual) => `<option value="${valor}" ${valor === actual ? 'selected' : ''}>${texto}</option>`;
  const kcal = n => Math.round(n / 10) * 10;
  const pesos = datos.pesos.slice().sort((a, b) => a.fecha.localeCompare(b.fecha));

  let tendencia = '';
  if (pesos.length >= 2) {
    const primero = pesos[0], ultimo = pesos[pesos.length - 1];
    const semanas = (fecha(ultimo.fecha) - fecha(primero.fecha)) / (7 * 86400000);
    if (semanas >= 2) {
      const porSemana = (ultimo.kg - primero.kg) / semanas, pct = porSemana / primero.kg * 100;
      const objetivo = datos.plan.objetivo;
      const consejo = objetivo === 'grasa'
        ? (pct > -0.25 ? 'Vas más lento de lo esperado (se busca bajar entre 0.5% y 1% de tu peso por semana): quita unas 150 kcal al día.' : pct < -1 ? 'Vas bajando muy rápido: sube unas 150 kcal al día para no perder músculo.' : 'Vas a buen ritmo: sigue igual.')
        : objetivo === 'musculo' || objetivo === 'fuerza'
          ? (pct < 0.1 ? 'Casi no subes: agrega unas 150 kcal al día.' : pct > 0.5 ? 'Subes rápido (se busca entre 0.25% y 0.5% por semana): quita unas 150 kcal al día.' : 'Vas a buen ritmo: sigue igual.')
          : (Math.abs(pct) > 0.5 ? `Tu peso se está moviendo: ${porSemana > 0 ? 'quita' : 'agrega'} unas 150 kcal al día si quieres mantenerte.` : 'Tu peso se mantiene estable.');
      tendencia = `<div class="aviso">En ${Math.round(semanas)} semanas cambiaste <b>${(ultimo.kg - primero.kg > 0 ? '+' : '') + (ultimo.kg - primero.kg).toFixed(1)} kg</b> (${(porSemana > 0 ? '+' : '') + porSemana.toFixed(2)} kg por semana). ${consejo}</div>`;
    } else {
      tendencia = '<p class="suave chico">Con dos semanas de registros te diré si vas al ritmo de tu objetivo.</p>';
    }
  }

  return `
    <div class="panel">
      <h2>Mis datos</h2>
      <div class="formulario">
        <label>Sexo<select id="perfil-sexo" data-cambio="perfil" data-campo="sexo">${opcion('', 'Elige…', p.sexo)}${opcion('hombre', 'Hombre', p.sexo)}${opcion('mujer', 'Mujer', p.sexo)}</select></label>
        <label>Edad<input type="number" id="perfil-edad" data-cambio="perfil" data-campo="edad" min="14" max="90" value="${p.edad}" placeholder="años"></label>
        <label>Peso<input type="number" id="perfil-peso" data-cambio="perfil" data-campo="peso" min="30" max="250" step="0.1" value="${p.peso}" placeholder="kg"></label>
        <label>Estatura<input type="number" id="perfil-estatura" data-cambio="perfil" data-campo="estatura" min="120" max="230" value="${p.estatura}" placeholder="cm"></label>
        <label class="ancho">Tu día normal, sin contar el ejercicio<select id="perfil-actividad" data-cambio="perfil" data-campo="actividad">${Object.keys(ACTIVIDAD).map(k => opcion(k, ACTIVIDAD[k][0], p.actividad)).join('')}</select></label>
      </div>
      <p class="suave chico" style="margin-top:10px">El objetivo (${OBJETIVOS[datos.plan.objetivo].nombre.toLowerCase()}) y los ${datos.plan.dias} días de entrenamiento se toman de la pestaña Plan.</p>
    </div>

    <div class="panel">
      <h2>Ajustar mi meta</h2>
      <div class="formulario">
        ${NUTRICION[datos.plan.objetivo].nombres ? `<label class="ancho">Ritmo<select id="perfil-ritmo" data-cambio="perfil" data-campo="ritmo">
          ${['suave', 'moderado', 'rapido'].map((k, i) => opcion(k, NUTRICION[datos.plan.objetivo].nombres[i], p.ritmo)).join('')}</select></label>` : ''}
        <label>Proteína<select id="perfil-proteina" data-cambio="perfil" data-campo="proteinaKg">
          ${opcion('auto', 'Recomendada', String(p.proteinaKg))}${['1.2', '1.4', '1.6', '1.8', '2.0', '2.2'].map(v => opcion(v, v + ' g por kilo', String(p.proteinaKg))).join('')}</select></label>
        <label>Comidas al día<select id="perfil-comidas" data-cambio="perfil" data-campo="comidas">${['2', '3', '4', '5', '6'].map(v => opcion(v, v, String(p.comidas))).join('')}</select></label>
        <label>Peso meta (opcional)<input type="number" id="perfil-meta" data-cambio="perfil" data-campo="pesoMeta" min="30" max="250" step="0.5" value="${p.pesoMeta}" placeholder="kg"></label>
        <label class="ancho">Calorías que te indicó un profesional (opcional)<input type="number" id="perfil-kcal" data-cambio="perfil" data-campo="caloriasPropias" min="800" max="6000" step="10" value="${p.caloriasPropias}" placeholder="Déjalo vacío para calcularlas"></label>
      </div>
    </div>

    ${m ? `
    <div class="tarjetas">
      <div class="tarjeta"><div class="etiqueta">Calorías al día</div><div class="valor">${kcal(m.calorias).toLocaleString('es-MX')}</div></div>
      <div class="tarjeta"><div class="etiqueta">Proteína</div><div class="valor">${Math.round(m.proteina)} g</div></div>
      <div class="tarjeta"><div class="etiqueta">Agua</div><div class="valor">${m.agua.toFixed(1)} L</div></div>
    </div>
    <div class="panel">
      <h2>Tu meta diaria</h2>
      <p class="chico">Tu cuerpo gasta cerca de <b>${kcal(m.gasto).toLocaleString('es-MX')} kcal</b> al día (${kcal(m.reposo).toLocaleString('es-MX')} en reposo). La meta es ${m.texto}.
        ${Math.abs(m.kgSemana) > 0.02 ? `A ese ritmo se espera ${m.kgSemana < 0 ? 'bajar' : 'subir'} cerca de <b>${Math.abs(m.kgSemana).toFixed(2)} kg por semana</b>${m.semanas ? `, así que llegarías a ${m.meta} kg en unas <b>${m.semanas} semanas</b>` : ''}.` : ''}
        ${m.meta && !m.semanas && Math.abs(m.meta - m.peso) > 0.2 ? 'Con este objetivo y ritmo no te acercas a tu peso meta: revisa el objetivo en la pestaña Plan.' : ''}</p>
      <table><tbody>
        <tr><td><b>Proteína</b><div class="suave chico">${m.protKg} g por kilo de peso</div></td><td class="num derecha">${Math.round(m.proteina)} g</td><td class="num derecha suave">${kcal(m.proteina * 4)} kcal</td></tr>
        <tr><td><b>Grasas</b><div class="suave chico">aguacate, aceite, nueces, huevo</div></td><td class="num derecha">${Math.round(m.grasa)} g</td><td class="num derecha suave">${kcal(m.grasa * 9)} kcal</td></tr>
        <tr><td><b>Carbohidratos</b><div class="suave chico">tortilla, arroz, avena, fruta, frijol</div></td><td class="num derecha">${Math.round(m.carbos)} g</td><td class="num derecha suave">${kcal(m.carbos * 4)} kcal</td></tr>
        <tr><td><b>Fibra</b><div class="suave chico">verduras, fruta, leguminosas</div></td><td class="num derecha">${Math.round(m.fibra)} g</td><td></td></tr>
      </tbody></table>
      <p class="chico" style="margin-top:10px">Repartido en ${m.comidas} comidas: unos <b>${Math.round(m.proteina / m.comidas)} g de proteína</b> y <b>${kcal(m.calorias / m.comidas)} kcal</b> en cada una.</p>
      ${m.bajoMinimo ? '<div class="aviso malo">Las calorías que indicaste están por debajo de lo que tu cuerpo gasta en reposo. Síguelas solo si te las dio un médico o nutriólogo.</div>' : ''}
      ${m.topado ? '<div class="aviso">La meta no baja de tu gasto en reposo: comer menos que eso no es recomendable sin supervisión.</div>' : ''}
      ${m.edad < 18 ? '<div class="aviso malo">Estas fórmulas son para adultos. Si eres menor de 18 años, no hagas dieta para bajar de peso sin un médico o nutriólogo.</div>' : ''}
    </div>` : `<div class="panel"><p class="vacio">Llena tus datos de arriba para calcular tus calorías, proteína y agua del día.</p></div>`}

    <div class="panel">
      <h2>Mi peso</h2>
      <form class="formulario" data-form="peso">
        <label>Fecha<input type="date" name="fecha" value="${hoy()}" required></label>
        <label>Peso (kg)<input type="number" name="kg" min="30" max="250" step="0.1" required></label>
        <button class="boton secundario">Anotar</button>
      </form>
      <p class="suave chico" style="margin-top:8px">Pésate en ayunas, una o dos veces por semana, siempre a la misma hora.</p>
      ${tendencia}
      ${pesos.length ? `${pesos.length > 1 ? grafica(pesos.map(x => ({ fecha: x.fecha, valor: x.kg })), 'kg') : ''}
        <table style="margin-top:8px"><tbody>${pesos.slice().reverse().slice(0, 6).map(x => `<tr><td class="num">${fechaCorta(x.fecha)}</td><td class="num derecha">${x.kg} kg</td>
          <td class="derecha"><button class="boton icono" data-accion="borrar-peso" data-id="${x.id}" title="Borrar" aria-label="Borrar peso">×</button></td></tr>`).join('')}</tbody></table>` : ''}
    </div>

    <div class="panel">
      <h2>Cuánta proteína tienen los alimentos</h2>
      <p class="suave chico">Valores aproximados, para que armes tus comidas${m ? ` hasta llegar a tus ${Math.round(m.proteina)} g` : ''}.</p>
      <table><tbody>${ALIMENTOS.map(a => `<tr><td>${a[0]}<div class="suave chico">${a[1]}</div></td><td class="num derecha">${a[2]} g</td></tr>`).join('')}</tbody></table>
    </div>

    <div class="panel">
      <h2>Para que funcione</h2>
      <ul class="lista">
        <li><b>Proteína en cada comida.</b> Es más fácil llegar a la meta repartida que toda en una.</li>
        <li><b>Medio plato de verduras</b> en comida y cena: llenan, dan fibra y casi no suman calorías.</li>
        <li><b>Cuida lo que se bebe.</b> Refresco, jugo y alcohol suman muchas calorías sin quitar el hambre.</li>
        <li><b>Constancia antes que perfección.</b> Cumplir la meta la mayoría de los días vale más que una semana perfecta.</li>
      </ul>
      <p class="suave chico">Son estimaciones generales para adultos sanos, no un plan médico. Si tienes diabetes, problemas de riñón, presión alta, estás embarazada o tomas medicamentos, consulta a un médico o nutriólogo antes de cambiar tu alimentación.</p>
    </div>`;
}
