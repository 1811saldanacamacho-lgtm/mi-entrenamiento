// Animaciones de los ejercicios: un monito de palitos que pasa de una postura a otra.
// Cada postura da la posición [x, y] de las articulaciones en un lienzo de 120 × 100 (el piso está en y = 90):
//   h cabeza · s hombro · e codo · m mano · c cadera · r rodilla · p pie
//   e2, m2, r2, p2: el otro brazo y la otra pierna, cuando se ven.
const DE_PIE = { h: [60, 19], s: [60, 28], e: [60, 41], m: [61, 54], c: [60, 54], r: [60, 72], p: [60, 90] };
function postura(cambios, base) { return Object.assign({}, base || DE_PIE, cambios); }

// Posturas que se repiten en varios ejercicios.
const ACOSTADO_BANCA = { h: [36, 60], s: [46, 62], c: [74, 62], r: [88, 64], p: [90, 90] };
const INCLINADO_REMO = { h: [82, 42], s: [74, 46], c: [52, 56], r: [58, 72], p: [56, 90] };
const LAGARTIJA_ARRIBA = { h: [32, 58], s: [40, 62], e: [40, 76], m: [40, 90], c: [66, 72], r: [81, 80], p: [96, 88] };
const SENTADO = { h: [48, 27], s: [48, 36], e: [50, 50], m: [56, 60], c: [50, 62], r: [70, 62], p: [70, 84] };
const BOCA_ARRIBA = { h: [30, 85], s: [40, 86], e: [53, 87], m: [64, 88], c: [66, 86] };
const FRENTE = { h: [60, 19], s: [60, 28], c: [60, 54], r: [55, 72], p: [53, 90], r2: [65, 72], p2: [67, 90] };
const BANCO = ['rect', 30, 66, 62, 4];
const ASIENTO = ['rect', 40, 64, 30, 4];

// poses: posturas del ciclo (al final regresa a la primera) · carga: peso en la mano ('m'), el hombro ('s') o el pie ('p')
// props: cosas fijas → ['rect', x, y, ancho, alto] · ['linea', x1, y1, x2, y2] · ['punto', x, y, r] · ['aro', x, y, r]
// cable: punto fijo del que sale un cable hasta la mano.
const ANIMACIONES = {
  banca: {
    poses: [postura({ e: [48, 68], m: [48, 56] }, ACOSTADO_BANCA), postura({ e: [48, 49], m: [48, 36] }, ACOSTADO_BANCA)],
    carga: { en: 'm', r: 4 }, props: [BANCO]
  },
  aperturas: {
    poses: [postura({ e: [47, 64], m: [47, 59] }, ACOSTADO_BANCA), postura({ e: [47, 50], m: [47, 38] }, ACOSTADO_BANCA)],
    carga: { en: 'm', r: 2.5 }, props: [BANCO]
  },
  frances: {
    poses: [postura({ e: [46, 48], m: [34, 52] }, ACOSTADO_BANCA), postura({ e: [46, 48], m: [46, 34] }, ACOSTADO_BANCA)],
    carga: { en: 'm', r: 3 }, props: [BANCO]
  },
  inclinado: {
    poses: [
      { h: [40, 44], s: [48, 52], e: [58, 60], m: [56, 46], c: [70, 68], r: [86, 68], p: [88, 90] },
      { h: [40, 44], s: [48, 52], e: [52, 38], m: [54, 24], c: [70, 68], r: [86, 68], p: [88, 90] }
    ],
    carga: { en: 'm', r: 2.5 }, props: [['linea', 34, 42, 72, 72], ['rect', 62, 72, 22, 4]]
  },
  lagartija: {
    poses: [LAGARTIJA_ARRIBA, { h: [31, 78], s: [40, 80], e: [52, 74], m: [40, 90], c: [66, 82], r: [81, 86], p: [96, 88] }]
  },
  plancha: {
    poses: [
      { h: [33, 70], s: [42, 74], e: [42, 88], m: [30, 88], c: [68, 78], r: [82, 84], p: [96, 88] },
      { h: [33, 69], s: [42, 73], e: [42, 88], m: [30, 88], c: [68, 76], r: [82, 83], p: [96, 88] }
    ],
    dur: 3
  },
  escalador: {
    poses: [
      postura({ r: [81, 80], p: [96, 88], r2: [58, 80], p2: [70, 88] }, LAGARTIJA_ARRIBA),
      postura({ r: [58, 80], p: [70, 88], r2: [81, 80], p2: [96, 88] }, LAGARTIJA_ARRIBA)
    ],
    dur: 1
  },
  fondos: {
    poses: [
      { h: [60, 21], s: [60, 30], e: [60, 43], m: [60, 56], c: [60, 56], r: [64, 70], p: [74, 78] },
      { h: [64, 35], s: [62, 44], e: [50, 46], m: [60, 56], c: [58, 68], r: [64, 80], p: [74, 86] }
    ],
    props: [['linea', 46, 56, 74, 56], ['linea', 48, 56, 48, 90], ['linea', 72, 56, 72, 90]]
  },
  dominadas: {
    poses: [
      { h: [54, 25], s: [60, 30], e: [60, 17], m: [60, 4], c: [60, 56], r: [62, 72], p: [70, 82] },
      { h: [54, 7], s: [60, 14], e: [68, 20], m: [60, 4], c: [60, 40], r: [62, 56], p: [70, 66] }
    ],
    props: [['punto', 60, 4, 2.5], ['linea', 40, 4, 80, 4]]
  },
  jalon: {
    poses: [
      postura({ h: [60, 27], s: [60, 36], e: [63, 22], m: [66, 8], c: [60, 62], r: [78, 62], p: [78, 90] }, SENTADO),
      postura({ h: [60, 27], s: [60, 36], e: [58, 48], m: [66, 34], c: [60, 62], r: [78, 62], p: [78, 90] }, SENTADO)
    ],
    carga: { en: 'm', r: 2 }, cable: [66, -4], props: [['rect', 48, 64, 26, 4]]
  },
  remo: {
    poses: [postura({ e: [74, 59], m: [74, 72] }, INCLINADO_REMO), postura({ e: [64, 44], m: [70, 56] }, INCLINADO_REMO)],
    carga: { en: 'm', r: 4 }
  },
  remoManc: {
    poses: [postura({ e: [74, 59], m: [74, 72] }, INCLINADO_REMO), postura({ e: [64, 44], m: [70, 56] }, INCLINADO_REMO)],
    carga: { en: 'm', r: 2.5 }
  },
  pajaros: {
    poses: [postura({ e: [75, 58], m: [75, 70] }, INCLINADO_REMO), postura({ e: [75, 51], m: [76, 55] }, INCLINADO_REMO)],
    carga: { en: 'm', r: 2.5 }
  },
  muerto: {
    poses: [
      { h: [77, 46], s: [70, 52], e: [70, 66], m: [70, 80], c: [50, 62], r: [66, 74], p: [60, 90] },
      postura({ e: [61, 41], m: [62, 54] })
    ],
    carga: { en: 'm', r: 4.5 }
  },
  rumano: {
    poses: [
      postura({ e: [61, 41], m: [62, 54] }),
      { h: [79, 47], s: [72, 52], e: [72, 63], m: [72, 74], c: [50, 58], r: [62, 73], p: [60, 90] }
    ],
    carga: { en: 'm', r: 4.5 }
  },
  sentadilla: {
    poses: [
      postura({ e: [65, 36], m: [62, 29] }),
      { h: [64, 39], s: [62, 48], e: [67, 56], m: [64, 49], c: [52, 72], r: [72, 74], p: [60, 90] }
    ],
    carga: { en: 's', r: 4.5 }
  },
  sentadillaLibre: {
    poses: [
      postura({ e: [66, 40], m: [72, 50] }),
      { h: [64, 39], s: [62, 48], e: [74, 50], m: [87, 50], c: [52, 72], r: [72, 74], p: [60, 90] }
    ]
  },
  desplante: {
    poses: [
      postura({ r2: [60, 72], p2: [60, 90] }),
      { h: [60, 33], s: [60, 42], e: [60, 55], m: [61, 68], c: [60, 68], r: [76, 70], p: [76, 90], r2: [54, 86], p2: [40, 84] }
    ]
  },
  prensa: {
    poses: [
      { h: [30, 52], s: [36, 60], e: [44, 70], m: [52, 76], c: [50, 78], r: [62, 60], p: [74, 68] },
      { h: [30, 52], s: [36, 60], e: [44, 70], m: [52, 76], c: [50, 78], r: [68, 62], p: [86, 48] }
    ],
    carga: { en: 'p', r: 5 }, props: [['linea', 26, 50, 52, 84]]
  },
  cuadriceps: {
    poses: [SENTADO, postura({ p: [92, 62] }, SENTADO)],
    props: [ASIENTO, ['linea', 44, 34, 44, 64]]
  },
  femoral: {
    poses: [postura({ p: [92, 62] }, SENTADO), postura({ p: [66, 83] }, SENTADO)],
    props: [ASIENTO, ['linea', 44, 34, 44, 64]]
  },
  talones: {
    poses: [DE_PIE, { h: [60, 14], s: [60, 23], e: [60, 36], m: [61, 49], c: [60, 49], r: [60, 67], p: [61, 86] }],
    props: [['punto', 62, 89, 1.5]]
  },
  militar: {
    poses: [postura({ e: [67, 38], m: [67, 25] }), postura({ e: [63, 16], m: [62, 3] })],
    carga: { en: 'm', r: 4 }
  },
  frontales: {
    poses: [DE_PIE, postura({ e: [73, 30], m: [86, 28] })],
    carga: { en: 'm', r: 2.5 }
  },
  laterales: {
    poses: [
      postura({ e: [54, 41], m: [52, 53], e2: [66, 41], m2: [68, 53] }, FRENTE),
      postura({ e: [47, 30], m: [34, 28], e2: [73, 30], m2: [86, 28] }, FRENTE)
    ],
    carga: { en: 'm', r: 2.5 }, carga2: { en: 'm2', r: 2.5 }
  },
  curl: {
    poses: [DE_PIE, postura({ m: [68, 31] })],
    carga: { en: 'm', r: 4 }
  },
  martillo: {
    poses: [DE_PIE, postura({ m: [68, 31] })],
    carga: { en: 'm', r: 2.5 }
  },
  triceps: {
    poses: [postura({ m: [70, 34] }), postura({ m: [63, 54] })],
    carga: { en: 'm', r: 2 }, cable: [78, -4]
  },
  abdominal: {
    poses: [
      { h: [35, 85], s: [44, 86], e: [40, 78], m: [36, 82], c: [70, 86], r: [84, 70], p: [96, 88] },
      { h: [42, 66], s: [48, 74], e: [46, 64], m: [42, 68], c: [70, 86], r: [84, 70], p: [96, 88] }
    ]
  },
  piernas: {
    poses: [postura({ r: [84, 84], p: [102, 82] }, BOCA_ARRIBA), postura({ r: [68, 68], p: [70, 50] }, BOCA_ARRIBA)]
  },
  puente: {
    poses: [
      postura({ c: [64, 86], r: [80, 72], p: [84, 90] }, BOCA_ARRIBA),
      postura({ c: [64, 70], r: [82, 70], p: [84, 90] }, BOCA_ARRIBA)
    ]
  },
  giros: {
    poses: [
      { h: [41, 54], s: [46, 62], e: [58, 66], m: [68, 62], c: [60, 86], r: [74, 72], p: [88, 82] },
      { h: [41, 54], s: [46, 62], e: [50, 72], m: [56, 80], c: [60, 86], r: [74, 72], p: [88, 82] }
    ],
    carga: { en: 'm', r: 2.5 }, dur: 1.6
  },
  correr: {
    poses: [
      { h: [62, 19], s: [60, 28], c: [58, 54], e: [52, 40], m: [48, 50], e2: [68, 38], m2: [74, 30], r: [70, 68], p: [72, 88], r2: [52, 72], p2: [40, 80] },
      { h: [62, 19], s: [60, 28], c: [58, 54], e: [68, 38], m: [74, 30], e2: [52, 40], m2: [48, 50], r: [52, 72], p: [40, 80], r2: [70, 68], p2: [72, 88] }
    ],
    dur: 0.9
  },
  bicicleta: {
    poses: [
      { h: [70, 27], s: [64, 34], e: [72, 44], m: [82, 46], c: [52, 56], r: [68, 60], p: [66, 78], r2: [62, 68], p2: [58, 86] },
      { h: [70, 27], s: [64, 34], e: [72, 44], m: [82, 46], c: [52, 56], r: [62, 68], p: [58, 86], r2: [68, 60], p2: [66, 78] }
    ],
    props: [['aro', 38, 80, 10], ['aro', 90, 80, 10], ['linea', 52, 58, 62, 82], ['linea', 82, 46, 90, 80]], dur: 1
  },
  cuerda: {
    poses: [
      postura({ e: [64, 42], m: [70, 50] }),
      { h: [60, 11], s: [60, 20], e: [64, 34], m: [70, 42], c: [60, 46], r: [60, 64], p: [60, 82] }
    ],
    dur: 0.7
  },
  burpee: {
    poses: [
      DE_PIE,
      { h: [77, 55], s: [70, 62], e: [72, 76], m: [74, 90], c: [54, 76], r: [70, 76], p: [60, 90] },
      { h: [82, 58], s: [74, 62], e: [74, 76], m: [74, 90], c: [48, 72], r: [33, 80], p: [18, 88] },
      { h: [77, 55], s: [70, 62], e: [72, 76], m: [74, 90], c: [54, 76], r: [70, 76], p: [60, 90] },
      { h: [60, 9], s: [60, 18], e: [62, 6], m: [61, -4], c: [60, 44], r: [60, 62], p: [60, 80] }
    ],
    dur: 4
  }
};

// Qué animación le toca a cada ejercicio del catálogo (por nombre, en minúsculas).
const ANIMACION_DE = {
  'press de banca': 'banca', 'press inclinado con mancuernas': 'inclinado', 'lagartijas': 'lagartija',
  'aperturas con mancuernas': 'aperturas', 'fondos': 'fondos',
  'dominadas': 'dominadas', 'jalón al pecho': 'jalon', 'remo con barra': 'remo', 'remo con mancuerna': 'remoManc', 'peso muerto': 'muerto',
  'sentadilla': 'sentadilla', 'prensa': 'prensa', 'peso muerto rumano': 'rumano', 'desplantes': 'desplante',
  'extensión de cuádriceps': 'cuadriceps', 'curl femoral': 'femoral', 'elevación de talones': 'talones',
  'press militar': 'militar', 'elevaciones laterales': 'laterales', 'elevaciones frontales': 'frontales', 'pájaros': 'pajaros',
  'curl de bíceps': 'curl', 'curl martillo': 'martillo', 'extensión de tríceps': 'triceps', 'press francés': 'frances',
  'plancha': 'plancha', 'abdominales': 'abdominal', 'elevación de piernas': 'piernas', 'giros rusos': 'giros',
  'caminadora': 'correr', 'bicicleta': 'bicicleta', 'elíptica': 'correr', 'saltar la cuerda': 'cuerda', 'correr': 'correr',
  'sentadilla sin peso': 'sentadillaLibre', 'puente de glúteo': 'puente', 'burpees': 'burpee', 'escaladores': 'escalador'
};

// Devuelve el SVG animado de un ejercicio, o '' si no tiene animación.
function figura(nombre) {
  const a = ANIMACIONES[ANIMACION_DE[String(nombre).trim().toLowerCase()]];
  if (!a) return '';
  const quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ciclo = a.poses.concat([a.poses[0]]);
  const dur = a.dur || 2.4;
  // Un atributo que cambia entre posturas; si no cambia (o no se quiere movimiento) no se anima.
  const mover = (atributo, valores) => quieto || valores.every(v => v === valores[0]) ? ''
    : `<animate attributeName="${atributo}" values="${valores.join(';')}" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keySplines="${valores.slice(1).map(() => '0.4 0 0.6 1').join(';')}"/>`;
  const tiene = k => a.poses[0][k] !== undefined;
  const hueso = (k1, k2, clase) => !tiene(k1) || !tiene(k2) ? '' : `<line class="${clase}" x1="${ciclo[0][k1][0]}" y1="${ciclo[0][k1][1]}" x2="${ciclo[0][k2][0]}" y2="${ciclo[0][k2][1]}">
      ${mover('x1', ciclo.map(p => p[k1][0]))}${mover('y1', ciclo.map(p => p[k1][1]))}${mover('x2', ciclo.map(p => p[k2][0]))}${mover('y2', ciclo.map(p => p[k2][1]))}</line>`;
  const bola = (k, r, clase) => !tiene(k) ? '' : `<circle class="${clase}" cx="${ciclo[0][k][0]}" cy="${ciclo[0][k][1]}" r="${r}">
      ${mover('cx', ciclo.map(p => p[k][0]))}${mover('cy', ciclo.map(p => p[k][1]))}</circle>`;
  const props = (a.props || []).map(([tipo, x, y, w, h]) =>
    tipo === 'rect' ? `<rect class="prop-lleno" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"/>`
    : tipo === 'linea' ? `<line class="prop" x1="${x}" y1="${y}" x2="${w}" y2="${h}"/>`
    : tipo === 'aro' ? `<circle class="prop" cx="${x}" cy="${y}" r="${w}" fill="none"/>`
    : `<circle class="prop-lleno" cx="${x}" cy="${y}" r="${w}"/>`).join('');
  const cable = !a.cable ? '' : `<line class="prop" x1="${a.cable[0]}" y1="${a.cable[1]}" x2="${ciclo[0].m[0]}" y2="${ciclo[0].m[1]}">
      ${mover('x2', ciclo.map(p => p.m[0]))}${mover('y2', ciclo.map(p => p.m[1]))}</line>`;
  return `<svg class="figura" viewBox="0 -8 120 104" role="img" aria-label="Animación de ${String(nombre).replace(/"/g, '')}">
    <line class="piso" x1="6" y1="91" x2="114" y2="91"/>
    ${props}${cable}
    ${hueso('s', 'e2', 'lejos')}${hueso('e2', 'm2', 'lejos')}${hueso('c', 'r2', 'lejos')}${hueso('r2', 'p2', 'lejos')}
    ${a.carga2 ? bola(a.carga2.en, a.carga2.r, 'carga') : ''}
    ${hueso('h', 's', 'cuerpo')}${hueso('s', 'c', 'cuerpo')}${hueso('c', 'r', 'cuerpo')}${hueso('r', 'p', 'cuerpo')}
    ${hueso('s', 'e', 'cuerpo')}${hueso('e', 'm', 'cuerpo')}
    ${bola('h', 5.5, 'cabeza')}
    ${a.carga ? bola(a.carga.en, a.carga.r, 'carga') : ''}
  </svg>`;
}
