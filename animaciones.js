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
  marcha: {
    poses: [
      postura({ e: [54, 40], m: [52, 51], e2: [66, 39], m2: [72, 32], r: [70, 58], p: [70, 76], r2: [60, 72], p2: [60, 90] }),
      postura({ e: [66, 39], m: [72, 32], e2: [54, 40], m2: [52, 51], r: [60, 72], p: [60, 90], r2: [70, 58], p2: [70, 76] })
    ],
    dur: 1.1
  },
  tijeras: {
    poses: [
      postura({ e: [54, 41], m: [52, 53], e2: [66, 41], m2: [68, 53], r: [57, 72], p: [57, 90], r2: [63, 72], p2: [63, 90] }, FRENTE),
      { h: [60, 15], s: [60, 24], c: [60, 50], e: [48, 16], m: [40, 5], e2: [72, 16], m2: [80, 5], r: [50, 68], p: [42, 86], r2: [70, 68], p2: [78, 86] }
    ],
    dur: 0.9
  },
  golpe: {
    poses: [
      { h: [62, 20], s: [60, 29], c: [58, 54], e: [74, 31], m: [88, 29], e2: [64, 42], m2: [68, 33], r: [66, 70], p: [70, 90], r2: [52, 72], p2: [46, 90] },
      { h: [62, 20], s: [60, 29], c: [58, 54], e: [64, 42], m: [68, 33], e2: [74, 31], m2: [88, 29], r: [66, 70], p: [70, 90], r2: [52, 72], p2: [46, 90] }
    ],
    dur: 0.8
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
  'marcha en el lugar': 'marcha', 'subir escaleras': 'marcha', 'rodillas al pecho': 'marcha', 'saltos de tijera': 'tijeras',
  'boxeo de sombra': 'golpe', 'caminar al aire libre': 'correr',
  'sentadilla sin peso': 'sentadillaLibre', 'puente de glúteo': 'puente', 'burpees': 'burpee', 'escaladores': 'escalador'
};

// ---------- Movimiento entre posturas ----------
// Entre dos posturas no se mueve cada punto en línea recta (los brazos se encogerían a medio camino):
// el tronco y los miembros giran sobre su articulación, y cuando la mano o el pie están apoyados en un
// punto fijo, el codo o la rodilla se acomodan para que el miembro conserve su largo.
const PASOS = 8;   // cuadros intermedios entre postura y postura
function intermedia(A, B, t) {
  const hay = k => A[k] !== undefined && B[k] !== undefined;
  const recta = k => [A[k][0] + (B[k][0] - A[k][0]) * t, A[k][1] + (B[k][1] - A[k][1]) * t];
  const fijo = k => A[k][0] === B[k][0] && A[k][1] === B[k][1];
  const largo = (P, a, b) => Math.hypot(P[b][0] - P[a][0], P[b][1] - P[a][1]);
  // Gira `k` alrededor de su articulación `padre`, que ahora está en `q`.
  const giro = (padre, k, q) => {
    const a1 = Math.atan2(A[k][1] - A[padre][1], A[k][0] - A[padre][0]);
    const a2 = Math.atan2(B[k][1] - B[padre][1], B[k][0] - B[padre][0]);
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const l = largo(A, padre, k) + (largo(B, padre, k) - largo(A, padre, k)) * t;
    return [q[0] + Math.cos(a1 + d * t) * l, q[1] + Math.sin(a1 + d * t) * l];
  };
  // Codo o rodilla (`medio`) para un miembro que va de `q` a un extremo fijo `fin`.
  const doblez = (raiz, medio, fin, q, f) => {
    const l1 = largo(A, raiz, medio) + (largo(B, raiz, medio) - largo(A, raiz, medio)) * t;
    const l2 = largo(A, medio, fin) + (largo(B, medio, fin) - largo(A, medio, fin)) * t;
    const d = Math.hypot(f[0] - q[0], f[1] - q[1]);
    if (d < 0.01) return recta(medio);
    const lado = P => (P[fin][0] - P[raiz][0]) * (P[medio][1] - P[raiz][1]) - (P[fin][1] - P[raiz][1]) * (P[medio][0] - P[raiz][0]);
    const signo = (Math.abs(lado(A)) > Math.abs(lado(B)) ? lado(A) : lado(B)) < 0 ? -1 : 1;
    const cos = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
    const ang = Math.atan2(f[1] - q[1], f[0] - q[0]) + signo * Math.acos(cos);
    return [q[0] + Math.cos(ang) * l1, q[1] + Math.sin(ang) * l1];
  };
  const P = { c: recta('c') };
  P.s = giro('c', 's', P.c);
  P.h = giro('s', 'h', P.s);
  const miembro = (raiz, medio, fin) => {
    if (!hay(medio) || !hay(fin)) return;
    if (fijo(fin)) {
      P[fin] = A[fin].slice();
      P[medio] = doblez(raiz, medio, fin, P[raiz], P[fin]);
    } else {
      P[medio] = giro(raiz, medio, P[raiz]);
      P[fin] = giro(medio, fin, P[medio]);
    }
  };
  miembro('s', 'e', 'm'); miembro('s', 'e2', 'm2'); miembro('c', 'r', 'p'); miembro('c', 'r2', 'p2');
  return P;
}
// Todos los cuadros del ciclo, con arranque y frenado suaves entre postura y postura.
const cuadrosListos = {};
function cuadros(id) {
  if (cuadrosListos[id]) return cuadrosListos[id];
  const poses = ANIMACIONES[id].poses, lista = [];
  poses.forEach((A, i) => {
    const B = poses[(i + 1) % poses.length];
    for (let k = 0; k < PASOS; k++) { const u = k / PASOS; lista.push(intermedia(A, B, u * u * (3 - 2 * u))); }
  });
  lista.push(intermedia(poses[0], poses[0], 0));
  return (cuadrosListos[id] = lista);
}

// Devuelve el SVG animado de un ejercicio, o '' si no tiene animación.
function figura(nombre) {
  const id = ANIMACION_DE[String(nombre).trim().toLowerCase()];
  const a = ANIMACIONES[id];
  if (!a) return '';
  const quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = cuadros(id);
  const dur = (a.dur || 2.4) * a.poses.length / 2;
  const n1 = v => Math.round(v * 10) / 10;
  // Un atributo a lo largo del ciclo; si no cambia (o no se quiere movimiento) no se anima.
  const mover = (atributo, valores) => {
    const v = valores.map(n1);
    return quieto || v.every(x => x === v[0]) ? '' : `<animate attributeName="${atributo}" values="${v.join(';')}" dur="${dur}s" repeatCount="indefinite"/>`;
  };
  const tiene = k => C[0][k] !== undefined;
  // Un punto puede ser una articulación ('s') o un punto a media distancia entre dos ('s+c').
  const punto = (P, k) => {
    if (k.indexOf('+') < 0) return P[k];
    const [a1, b1] = k.split('+');
    return [(P[a1][0] + P[b1][0]) / 2, (P[a1][1] + P[b1][1]) / 2];
  };
  // dx, dy desplazan la copia que hace de brazo o pierna del otro lado.
  const hueso = (k1, k2, clase, ancho, dx, dy) => {
    if (!k1.split('+').every(tiene) || !k2.split('+').every(tiene)) return '';
    const x = (k, i) => C.map(P => punto(P, k)[i] + (i ? dy || 0 : dx || 0));
    return `<line class="${clase}" stroke-width="${ancho}" x1="${n1(x(k1, 0)[0])}" y1="${n1(x(k1, 1)[0])}" x2="${n1(x(k2, 0)[0])}" y2="${n1(x(k2, 1)[0])}">
      ${mover('x1', x(k1, 0))}${mover('y1', x(k1, 1))}${mover('x2', x(k2, 0))}${mover('y2', x(k2, 1))}</line>`;
  };
  const bola = (k, r, clase) => !tiene(k) ? '' : `<circle class="${clase}" cx="${n1(C[0][k][0])}" cy="${n1(C[0][k][1])}" r="${r}">
      ${mover('cx', C.map(P => P[k][0]))}${mover('cy', C.map(P => P[k][1]))}</circle>`;
  const props = (a.props || []).map(([tipo, x, y, w, h]) =>
    tipo === 'rect' ? `<rect class="prop-lleno" x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5"/>`
    : tipo === 'linea' ? `<line class="prop" x1="${x}" y1="${y}" x2="${w}" y2="${h}"/>`
    : tipo === 'aro' ? `<circle class="prop" cx="${x}" cy="${y}" r="${w}" fill="none"/>`
    : `<circle class="prop-lleno" cx="${x}" cy="${y}" r="${w}"/>`).join('');
  const cable = !a.cable ? '' : `<line class="prop" x1="${a.cable[0]}" y1="${a.cable[1]}" x2="${n1(C[0].m[0])}" y2="${n1(C[0].m[1])}">
      ${mover('x2', C.map(P => P.m[0]))}${mover('y2', C.map(P => P.m[1]))}</line>`;

  const BRAZO = 5, ANTEBRAZO = 4.2, MUSLO = 7, PIERNA = 5.4, TRONCO = 9.5;
  // El brazo y la pierna del otro lado: los de la postura si vienen, o una copia un poco corrida.
  const lejos = (tiene('e2') ? hueso('s', 'e2', 'lejos', BRAZO) + hueso('e2', 'm2', 'lejos', ANTEBRAZO)
      : hueso('s', 'e', 'lejos', BRAZO, 3, -1.5) + hueso('e', 'm', 'lejos', ANTEBRAZO, 3, -1.5))
    + (tiene('r2') ? hueso('c', 'r2', 'lejos', MUSLO) + hueso('r2', 'p2', 'lejos', PIERNA)
      : hueso('c', 'r', 'lejos', MUSLO, 3, -1.5) + hueso('r', 'p', 'lejos', PIERNA, 3, -1.5));

  return `<svg class="figura" viewBox="0 -10 120 106" role="img" aria-label="Animación de ${String(nombre).replace(/"/g, '')}">
    <line class="piso" x1="6" y1="93" x2="114" y2="93"/>
    ${props}${cable}
    ${lejos}
    ${a.carga2 ? bola(a.carga2.en, a.carga2.r, 'carga') : ''}
    ${hueso('c', 'r', 'cuerpo', MUSLO)}${hueso('r', 'p', 'cuerpo', PIERNA)}
    ${hueso('h', 's', 'cuerpo', 4.5)}${hueso('s', 'c', 'cuerpo', TRONCO)}
    ${bola('h', 6.4, 'cabeza')}
    ${hueso('s', 'e', 'cuerpo', BRAZO)}${hueso('e', 'm', 'cuerpo', ANTEBRAZO)}
    ${a.carga ? bola(a.carga.en, a.carga.r, 'carga') : ''}
  </svg>`;
}
