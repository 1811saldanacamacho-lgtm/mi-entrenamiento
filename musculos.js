// Anatomía: qué músculos trabaja cada ejercicio y el mapa del cuerpo donde se pintan.

const MUSCULOS = {
  pectoral: 'Pectoral', deltAnt: 'Deltoides anterior', deltMed: 'Deltoides medio', deltPost: 'Deltoides posterior',
  biceps: 'Bíceps', triceps: 'Tríceps', antebrazo: 'Antebrazo',
  dorsal: 'Dorsal ancho', trapecio: 'Trapecio y romboides', lumbar: 'Espalda baja (erectores)',
  abdomen: 'Recto abdominal', oblicuos: 'Oblicuos',
  gluteo: 'Glúteo', cuadriceps: 'Cuádriceps', isquios: 'Isquiotibiales', aductores: 'Aductores', gemelos: 'Pantorrilla (gemelos y sóleo)'
};

// Por ejercicio: [músculos principales, músculos secundarios]. Los principales son los que hacen el movimiento;
// los secundarios ayudan o estabilizan.
const TRABAJO = {
  'press de banca': [['pectoral'], ['deltAnt', 'triceps']],
  'press inclinado con mancuernas': [['pectoral', 'deltAnt'], ['triceps']],
  'lagartijas': [['pectoral'], ['triceps', 'deltAnt', 'abdomen']],
  'aperturas con mancuernas': [['pectoral'], ['deltAnt']],
  'fondos': [['triceps', 'pectoral'], ['deltAnt']],
  'dominadas': [['dorsal'], ['biceps', 'trapecio', 'deltPost', 'antebrazo']],
  'jalón al pecho': [['dorsal'], ['biceps', 'trapecio', 'deltPost']],
  'remo con barra': [['dorsal', 'trapecio'], ['biceps', 'deltPost', 'lumbar']],
  'remo con mancuerna': [['dorsal'], ['trapecio', 'biceps', 'deltPost']],
  'peso muerto': [['gluteo', 'isquios', 'lumbar'], ['cuadriceps', 'trapecio', 'dorsal', 'antebrazo']],
  'sentadilla': [['cuadriceps', 'gluteo'], ['isquios', 'aductores', 'lumbar', 'abdomen']],
  'sentadilla sin peso': [['cuadriceps', 'gluteo'], ['isquios', 'aductores']],
  'prensa': [['cuadriceps'], ['gluteo', 'isquios']],
  'peso muerto rumano': [['isquios', 'gluteo'], ['lumbar', 'antebrazo']],
  'desplantes': [['cuadriceps', 'gluteo'], ['isquios', 'aductores']],
  'extensión de cuádriceps': [['cuadriceps'], []],
  'curl femoral': [['isquios'], ['gemelos']],
  'elevación de talones': [['gemelos'], []],
  'press militar': [['deltAnt'], ['deltMed', 'triceps', 'trapecio']],
  'elevaciones laterales': [['deltMed'], ['trapecio']],
  'elevaciones frontales': [['deltAnt'], ['pectoral']],
  'pájaros': [['deltPost'], ['trapecio']],
  'curl de bíceps': [['biceps'], ['antebrazo']],
  'curl martillo': [['biceps', 'antebrazo'], []],
  'extensión de tríceps': [['triceps'], []],
  'press francés': [['triceps'], []],
  'plancha': [['abdomen'], ['oblicuos', 'lumbar', 'deltAnt']],
  'abdominales': [['abdomen'], ['oblicuos']],
  'elevación de piernas': [['abdomen'], ['oblicuos']],
  'giros rusos': [['oblicuos'], ['abdomen']],
  'puente de glúteo': [['gluteo'], ['isquios', 'lumbar']],
  'burpees': [['cuadriceps', 'pectoral'], ['gluteo', 'triceps', 'abdomen', 'deltAnt']],
  'escaladores': [['abdomen'], ['cuadriceps', 'oblicuos', 'deltAnt']],
  'caminadora': [['cuadriceps', 'gemelos'], ['gluteo', 'isquios']],
  'correr': [['cuadriceps', 'gemelos'], ['gluteo', 'isquios']],
  'elíptica': [['cuadriceps', 'gluteo'], ['gemelos', 'isquios']],
  'bicicleta': [['cuadriceps'], ['gluteo', 'gemelos', 'isquios']],
  'saltar la cuerda': [['gemelos'], ['cuadriceps', 'antebrazo']]
};
function trabajo(nombre) {
  const t = TRABAJO[String(nombre).trim().toLowerCase()];
  return t ? { principales: t[0], secundarios: t[1] } : null;
}
// Suma series por músculo: una serie cuenta 1 para los principales y media para los secundarios.
function sumarSeries(total, nombre, series) {
  const t = trabajo(nombre);
  if (!t || !series) return total;
  t.principales.forEach(m => { total[m] = (total[m] || 0) + series; });
  t.secundarios.forEach(m => { total[m] = (total[m] || 0) + series / 2; });
  return total;
}

// ---------- Mapa del cuerpo ----------
// Silueta de frente (centrada en x = 50) y de espalda (centrada en x = 150), en un lienzo de 200 × 200.
// Cada músculo es una o varias zonas: ['e', cx, cy, rx, ry] elipse · ['r', x, y, ancho, alto, radio] rectángulo · ['p', trazo] forma libre.
// Las zonas se dan para el lado izquierdo del dibujo y se reflejan solas al derecho.
const ZONAS = {
  frente: {
    pectoral: [['e', 41, 46, 9, 7]],
    deltAnt: [['e', 30, 40, 5, 6.5]],
    deltMed: [['e', 25, 42, 2.8, 6]],
    biceps: [['e', 24, 57, 4.6, 10]],
    antebrazo: [['e', 19, 84, 4.2, 12]],
    abdomen: [['r', 43.5, 56, 13, 33, 5]],
    oblicuos: [['e', 38.5, 72, 3.2, 13]],
    cuadriceps: [['e', 40.5, 121, 7.5, 20]],
    aductores: [['e', 47.5, 111, 2.6, 11]]
  },
  espalda: {
    trapecio: [['p', 'M150 27 L165 37 L157 55 L150 61 L143 55 L135 37 Z']],
    deltPost: [['e', 130, 40, 5, 6.5]],
    deltMed: [['e', 125, 42, 2.8, 6]],
    triceps: [['e', 124, 57, 4.6, 10]],
    antebrazo: [['e', 119, 84, 4.2, 12]],
    dorsal: [['e', 139.5, 64, 6.5, 12]],
    lumbar: [['r', 144.5, 72, 11, 19, 4]],
    gluteo: [['e', 142, 101, 8, 7.5]],
    isquios: [['e', 141, 127, 7.5, 17]],
    gemelos: [['e', 140, 162, 5.6, 13]]
  }
};
function silueta(cx) {
  const lado = s => `
    <ellipse cx="${cx + s * 26}" cy="56" rx="6.5" ry="17"/><ellipse cx="${cx + s * 31}" cy="86" rx="5.2" ry="15"/><circle cx="${cx + s * 33}" cy="104" r="4"/>
    <ellipse cx="${cx + s * 9.5}" cy="122" rx="9.5" ry="25"/><ellipse cx="${cx + s * 10}" cy="166" rx="6.8" ry="21"/><ellipse cx="${cx + s * 10}" cy="190" rx="6" ry="3.2"/>
    <ellipse cx="${cx + s * 20}" cy="40" rx="7" ry="7.5"/>`;
  return `<g class="silueta"><circle cx="${cx}" cy="15" r="10"/><rect x="${cx - 4}" y="23" width="8" height="9"/>
    <path d="M${cx - 20} 36 Q${cx} 29 ${cx + 20} 36 L${cx + 16} 72 L${cx + 15} 100 L${cx - 15} 100 L${cx - 16} 72 Z"/>${lado(-1)}${lado(1)}</g>`;
}
// niveles: { músculo: 'p' (principal) | 's' (secundario) | número de 0 a 1 (intensidad) }
function mapaMuscular(niveles) {
  const zona = (centro, forma, estilo) => {
    const espejo = x => 2 * centro - x;
    if (forma[0] === 'p') return `<path d="${forma[1]}" ${estilo}/>`;
    if (forma[0] === 'r') {
      const [, x, y, w, h, r] = forma;
      // Los rectángulos ya van centrados en el cuerpo: no se reflejan.
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${estilo}/>`;
    }
    const [, x, y, rx, ry] = forma;
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${estilo}/><ellipse cx="${espejo(x)}" cy="${y}" rx="${rx}" ry="${ry}" ${estilo}/>`;
  };
  const vista = (zonas, centro) => Object.keys(zonas).map(m => {
    const n = niveles[m];
    if (!n) return '';
    const estilo = typeof n === 'number' ? `class="zona" style="opacity:${Math.max(0.18, Math.min(1, n)).toFixed(2)}"` : `class="zona ${n === 'p' ? '' : 'secundaria'}"`;
    return `<g><title>${MUSCULOS[m]}</title>${zonas[m].map(f => zona(centro, f, estilo)).join('')}</g>`;
  }).join('');
  return `<svg class="mapa" viewBox="0 0 200 208" role="img" aria-label="Mapa de músculos">
    ${silueta(50)}${silueta(150)}
    ${vista(ZONAS.frente, 50)}${vista(ZONAS.espalda, 150)}
    <text x="50" y="205" text-anchor="middle">Frente</text><text x="150" y="205" text-anchor="middle">Espalda</text>
  </svg>`;
}
function mapaDeEjercicio(nombre) {
  const t = trabajo(nombre);
  if (!t) return '';
  const niveles = {};
  t.secundarios.forEach(m => { niveles[m] = 's'; });
  t.principales.forEach(m => { niveles[m] = 'p'; });
  return mapaMuscular(niveles);
}
