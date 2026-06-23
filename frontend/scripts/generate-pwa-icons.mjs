// Generador de iconos PWA para The Arkenstone (sin dependencias externas).
//
// Dibuja la "piedra del arca" (una gema facetada) sobre fondo Direction A y
// rasteriza a PNG con supersampling. Son PLACEHOLDERS coherentes con el branding
// hasta disponer del logo de origen definitivo. Para regenerar:
//
//   node scripts/generate-pwa-icons.mjs
//
// Salida en frontend/public/icons/ + apple-touch-icon y favicon maskable.

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'icons');

// Paleta Direction A (tema oscuro). Aproximaciones sRGB de los tokens oklch.
const BG = [12, 13, 16]; // --bg #0c0d10
const ACCENT = [54, 201, 184]; // ~ oklch(0.72 0.12 178) teal
const ACCENT_STRONG = [104, 224, 209]; // facet superior, más luminoso
const ACCENT_DEEP = [33, 150, 140]; // facet inferior, más profundo

const SS = 4; // supersampling

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ¿Está el punto (px,py) en [0,1] dentro del rombo centrado de semiejes hw,hh?
function gemColor(px, py, hw, hh) {
  const dx = (px - 0.5) / hw;
  const dy = (py - 0.5) / hh;
  if (Math.abs(dx) + Math.abs(dy) > 1) return null; // fuera de la gema
  // Facetado simple: triángulo superior claro, inferior profundo, con un sutil
  // gradiente vertical para dar volumen.
  const top = py < 0.5;
  const base = top ? ACCENT_STRONG : ACCENT_DEEP;
  const t = top ? (0.5 - py) / hh : (py - 0.5) / hh; // 0 centro → 1 vértice
  return [
    Math.round(lerp(ACCENT[0], base[0], 0.5 + 0.5 * t)),
    Math.round(lerp(ACCENT[1], base[1], 0.5 + 0.5 * t)),
    Math.round(lerp(ACCENT[2], base[2], 0.5 + 0.5 * t)),
  ];
}

function renderIcon(size, { half = 0.34 } = {}) {
  // half = semiancho relativo de la gema (maskable usa menos → safe zone).
  const hw = half;
  const hh = half * 1.18; // un poco más alta que ancha
  const W = size;
  const buf = Buffer.alloc(W * W * 4);
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      // Supersampling: media de SS*SS muestras.
      let r = 0;
      let g = 0;
      let b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = (x + (sx + 0.5) / SS) / W;
          const py = (y + (sy + 0.5) / SS) / W;
          const gem = gemColor(px, py, hw, hh);
          const c = gem ?? BG;
          r += c[0];
          g += c[1];
          b += c[2];
        }
      }
      const n = SS * SS;
      const i = (y * W + x) * 4;
      buf[i] = Math.round(r / n);
      buf[i + 1] = Math.round(g / n);
      buf[i + 2] = Math.round(b / n);
      buf[i + 3] = 255;
    }
  }
  return encodePng(W, W, buf);
}

// --- PNG mínimo (RGBA, 8-bit, filtro 0) ---

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // raw con filtro 0 por scanline
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- SVG fuente (para regeneración / referencia) ---
function gemSvg(size, half) {
  const cx = size / 2;
  const hw = half * size;
  const hh = half * 1.18 * size;
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${rgb(BG)}"/>
  <polygon points="${cx},${cx - hh} ${cx + hw},${cx} ${cx},${cx + hh} ${cx - hw},${cx}" fill="${rgb(ACCENT)}"/>
  <polygon points="${cx},${cx - hh} ${cx + hw},${cx} ${cx - hw},${cx}" fill="${rgb(ACCENT_STRONG)}"/>
  <polygon points="${cx},${cx + hh} ${cx + hw},${cx} ${cx - hw},${cx}" fill="${rgb(ACCENT_DEEP)}"/>
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });

const outputs = [
  { name: 'icon-192.png', size: 192, half: 0.36 },
  { name: 'icon-512.png', size: 512, half: 0.36 },
  { name: 'maskable-512.png', size: 512, half: 0.3 }, // safe zone para maskable
  { name: 'apple-touch-icon.png', size: 180, half: 0.36 },
];

for (const o of outputs) {
  writeFileSync(join(OUT_DIR, o.name), renderIcon(o.size, { half: o.half }));
  console.log(`wrote icons/${o.name} (${o.size}px)`);
}

writeFileSync(join(OUT_DIR, 'icon.svg'), gemSvg(512, 0.36));
console.log('wrote icons/icon.svg (source)');
