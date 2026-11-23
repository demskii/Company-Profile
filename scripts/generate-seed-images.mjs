// Generates the demo SVG artwork used by database/seed.sql.
// Run: node scripts/generate-seed-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'backend', 'uploads', 'seed');
mkdirSync(outDir, { recursive: true });

const navy = '#0B3C5D';
const navyDeep = '#072a42';
const steel = '#c9d3dc';
const steelDark = '#8d9aa6';
const amber = '#F2A900';

const metal = `
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f4f7f9"/><stop offset=".35" stop-color="#c3cdd6"/>
    <stop offset=".55" stop-color="#eef2f5"/><stop offset=".8" stop-color="#9aa8b4"/>
    <stop offset="1" stop-color="#d6dee5"/>
  </linearGradient>`;

const darkBg = (w, h, id = 'bg') => `
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${navyDeep}"/><stop offset="1" stop-color="#0d4a70"/>
    </linearGradient>
    ${metal}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  <g stroke="#7fb4d4" stroke-opacity=".14">
    ${Array.from({ length: Math.ceil(w / 40) }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${h}"/>`).join('')}
    ${Array.from({ length: Math.ceil(h / 40) }, (_, i) => `<line x1="0" y1="${i * 40}" x2="${w}" y2="${i * 40}"/>`).join('')}
  </g>`;

const lightBg = (w, h) => `
  <defs>
    ${metal}
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f9fb"/><stop offset="1" stop-color="#e4eaf0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#paper)"/>
  <g stroke="${steelDark}" stroke-opacity=".18">
    ${Array.from({ length: Math.ceil(w / 48) }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="${h}"/>`).join('')}
    ${Array.from({ length: Math.ceil(h / 48) }, (_, i) => `<line x1="0" y1="${i * 48}" x2="${w}" y2="${i * 48}"/>`).join('')}
  </g>`;

// Hollow rectangular extrusion profile drawn in a skewed isometric plane.
function profile(x, y, w, h, wall = 10, extra = '') {
  return `<g transform="translate(${x} ${y}) skewY(-8)">
    <rect x="0" y="0" width="${w}" height="${h}" rx="4" fill="url(#metal)" stroke="${steelDark}" stroke-width="1.5"/>
    <rect x="${wall}" y="${wall}" width="${w - wall * 2}" height="${h - wall * 2}" rx="2" fill="${navy}" fill-opacity=".82"/>
    <rect x="${wall}" y="${wall}" width="${w - wall * 2}" height="${h - wall * 2}" rx="2" fill="none" stroke="#ffffff" stroke-opacity=".35"/>
    ${extra}
  </g>`;
}

const write = (name, svg) => writeFileSync(join(outDir, name), svg.trim() + '\n');

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Aluminium extrusion profiles">
  ${darkBg(1600, 900)}
  <circle cx="1230" cy="180" r="420" fill="${amber}" fill-opacity=".07"/>
  <circle cx="330" cy="760" r="360" fill="#328CC1" fill-opacity=".18"/>
  ${profile(880, 120, 250, 640, 26, '<line x1="125" y1="26" x2="125" y2="614" stroke="#ffffff" stroke-opacity=".25"/>')}
  ${profile(1140, 300, 170, 460, 20)}
  ${profile(650, 470, 200, 330, 18)}
  ${profile(120, 560, 480, 90, 16)}
  <path d="M80 300 H620" stroke="${amber}" stroke-width="6"/>
  <path d="M80 300 v-40 M80 260 h24" stroke="${amber}" stroke-width="6" fill="none"/>
  <path d="M0 860 H1600" stroke="#ffffff" stroke-opacity=".12" stroke-width="2"/>
</svg>`;
write('hero.svg', hero);

const facility = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Manufacturing facility">
  ${darkBg(1200, 800)}
  <circle cx="980" cy="120" r="200" fill="${amber}" fill-opacity=".08"/>
  <g fill="#0a3350" stroke="#7fb4d4" stroke-opacity=".5" stroke-width="2">
    <path d="M80 620 V380 l120 -70 v70 l120 -70 v70 l120 -70 v70 l120 -70 v310 z"/>
    <rect x="640" y="430" width="220" height="190"/>
    <rect x="880" y="500" width="240" height="120"/>
  </g>
  <g stroke="${steel}" stroke-opacity=".7" stroke-width="2">
    <path d="M560 380 h560 M560 500 h560 M560 620 h560"/>
    ${[700, 780, 860].map((x) => `<line x1="${x}" y1="430" x2="${x}" y2="620"/>`).join('')}
    ${[940, 1010, 1080].map((x) => `<line x1="${x}" y1="500" x2="${x}" y2="620"/>`).join('')}
  </g>
  <g fill="${amber}">
    ${[110, 220, 330, 440].map((x) => `<rect x="${x}" y="330" width="10" height="10"/>`).join('')}
  </g>
  <path d="M60 660 H1140" stroke="#ffffff" stroke-opacity=".2" stroke-width="3"/>
  <g stroke="${steel}" stroke-opacity=".45" stroke-width="3">
    <line x1="640" y1="430" x2="560" y2="380"/>
    <line x1="860" y1="430" x2="800" y2="380"/>
  </g>
</svg>`;
write('facility.svg', facility);

const construction = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Aluminium construction profiles">
  ${lightBg(1200, 900)}
  <ellipse cx="600" cy="740" rx="380" ry="46" fill="${navy}" fill-opacity=".1"/>
  ${profile(260, 150, 150, 560, 16)}
  ${profile(470, 150, 150, 560, 16, '<circle cx="75" cy="280" r="26" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="6"/>')}
  ${profile(680, 150, 150, 560, 16)}
  <g transform="translate(250 640) skewY(-8)">
    <rect width="580" height="70" rx="4" fill="url(#metal)" stroke="${steelDark}" stroke-width="1.5"/>
    <rect x="16" y="16" width="548" height="38" fill="${navy}" fill-opacity=".82"/>
  </g>
  <path d="M180 210 H1010" stroke="${amber}" stroke-width="5"/>
  <path d="M180 210 v-24 M1010 210 v-24" stroke="${amber}" stroke-width="5"/>
</svg>`;
write('product-construction.svg', construction);

const automotive = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Aluminium automotive components">
  ${lightBg(1200, 900)}
  <ellipse cx="600" cy="760" rx="360" ry="40" fill="${navy}" fill-opacity=".1"/>
  <g transform="translate(600 450)">
    <circle r="250" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    <circle r="205" fill="${navy}"/>
    <circle r="205" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="3"/>
    <circle r="80" fill="url(#metal)"/>
    <circle r="38" fill="${navy}"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return `<circle cx="${Math.cos(a) * 160}" cy="${Math.sin(a) * 160}" r="18" fill="#0a3350" stroke="#e8eef3" stroke-width="4"/>`;
    }).join('')}
  </g>
  <g transform="translate(180 240)">
    <rect width="180" height="90" rx="12" fill="url(#metal)" stroke="${steelDark}"/>
    <circle cx="40" cy="45" r="14" fill="${navy}"/><circle cx="140" cy="45" r="14" fill="${navy}"/>
  </g>
  <path d="M150 700 H1050" stroke="${amber}" stroke-width="4"/>
</svg>`;
write('product-automotive.svg', automotive);

const panel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Custom aluminium panels">
  ${lightBg(1200, 900)}
  <defs>
    <pattern id="holes" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="17" cy="17" r="5" fill="${navy}" fill-opacity=".55"/>
    </pattern>
  </defs>
  <ellipse cx="600" cy="780" rx="400" ry="40" fill="${navy}" fill-opacity=".1"/>
  ${[
    [180, 180, 260, 560, 0.9],
    [450, 120, 260, 620, 1],
    [720, 210, 260, 520, 0.85],
  ].map(([x, y, w, h, o]) => `<g transform="translate(${x} ${y}) skewY(-5)" opacity="${o}">
      <rect width="${w}" height="${h}" rx="6" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
      <rect x="22" y="22" width="${w - 44}" height="${h - 44}" fill="url(#holes)"/>
    </g>`).join('')}
  <path d="M120 760 H1080" stroke="${amber}" stroke-width="4"/>
</svg>`;
write('product-panel.svg', panel);

const accessory = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Aluminium accessories">
  ${lightBg(1200, 900)}
  <ellipse cx="600" cy="760" rx="380" ry="40" fill="${navy}" fill-opacity=".1"/>
  <g transform="translate(220 300)">
    <rect width="300" height="70" rx="35" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    <circle cx="70" cy="35" r="14" fill="${navy}"/><circle cx="230" cy="35" r="14" fill="${navy}"/>
  </g>
  <g transform="translate(650 220)">
    <path d="M0 0 h120 v70 h-120 z" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    <path d="M120 10 h110 v50 h-110 z" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    <circle cx="30" cy="35" r="12" fill="${navy}"/><circle cx="90" cy="35" r="12" fill="${navy}"/>
    <circle cx="170" cy="35" r="12" fill="${navy}"/>
  </g>
  <g transform="translate(300 560)">
    <path d="M0 80 q0 -80 80 -80 t80 80" fill="none" stroke="${steelDark}" stroke-width="26" stroke-linecap="round"/>
    <path d="M0 80 q0 -80 80 -80 t80 80" fill="none" stroke="url(#metal)" stroke-width="18" stroke-linecap="round"/>
  </g>
  <g transform="translate(760 540)">
    <rect width="220" height="140" rx="10" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    ${[30, 110, 190].map((x) => `<circle cx="${x}" cy="70" r="12" fill="${navy}"/>`).join('')}
  </g>
  <path d="M140 800 H1060" stroke="${amber}" stroke-width="4"/>
</svg>`;
write('product-accessory.svg', accessory);

const serviceManufacturing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Aluminium manufacturing">
  ${darkBg(1200, 800)}
  <rect x="120" y="520" width="960" height="120" rx="8" fill="#0a3350" stroke="#7fb4d4" stroke-opacity=".5" stroke-width="2"/>
  <rect x="220" y="240" width="420" height="280" rx="10" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
  <rect x="270" y="290" width="320" height="180" fill="${navy}"/>
  <circle cx="430" cy="380" r="60" fill="none" stroke="#e8eef3" stroke-width="8"/>
  <path d="M640 520 H980" stroke="${amber}" stroke-width="26" stroke-linecap="round"/>
  <g fill="${amber}" fill-opacity=".85">
    ${[[1010, 500], [1050, 470], [1080, 520], [1030, 560], [1080, 430]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}
  </g>
  <path d="M0 640 H1200" stroke="#ffffff" stroke-opacity=".12"/>
</svg>`;
write('service-manufacturing.svg', serviceManufacturing);

const serviceFabrication = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Custom aluminium fabrication">
  ${darkBg(1200, 800)}
  <rect x="140" y="560" width="920" height="60" rx="6" fill="#0a3350" stroke="#7fb4d4" stroke-opacity=".4" stroke-width="2"/>
  <rect x="200" y="470" width="800" height="70" rx="4" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
  <rect x="520" y="180" width="120" height="260" rx="8" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
  <rect x="556" y="220" width="48" height="150" fill="${navy}"/>
  <path d="M580 440 v40" stroke="${amber}" stroke-width="10" stroke-linecap="round"/>
  <g fill="${amber}">
    ${[[540, 500], [520, 530], [610, 510], [630, 540], [560, 545]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${5 + (i % 3)}"/>`).join('')}
  </g>
  <circle cx="580" cy="500" r="70" fill="${amber}" fill-opacity=".12"/>
  <path d="M0 660 H1200" stroke="#ffffff" stroke-opacity=".12"/>
</svg>`;
write('service-fabrication.svg', serviceFabrication);

const serviceComponents = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Aluminium component production">
  ${darkBg(1200, 800)}
  <g transform="translate(600 400)">
    <circle r="210" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/>
    <circle r="165" fill="${navy}"/>
    <circle r="60" fill="url(#metal)"/>
    <circle r="26" fill="${navy}"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return `<circle cx="${Math.cos(a) * 120}" cy="${Math.sin(a) * 120}" r="14" fill="#0a3350" stroke="#e8eef3" stroke-width="3"/>`;
    }).join('')}
  </g>
  <path d="M120 660 H1080" stroke="${amber}" stroke-width="5"/>
</svg>`;
write('service-components.svg', serviceComponents);

const serviceIndustrial = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Industrial aluminium solutions">
  ${darkBg(1200, 800)}
  <g transform="translate(140 180) skewY(-6)">
    ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${c * 210}" y="${r * 150}" width="170" height="110" rx="6" fill="url(#metal)" stroke="${steelDark}" stroke-width="2"/><rect x="${c * 210 + 20}" y="${r * 150 + 20}" width="130" height="70" fill="${navy}" fill-opacity=".85"/>`).join('')).join('')}
  </g>
  <path d="M80 720 H1120" stroke="${amber}" stroke-width="5"/>
  <path d="M80 720 v-30 M1120 720 v-30" stroke="${amber}" stroke-width="5"/>
</svg>`;
write('service-industrial.svg', serviceIndustrial);

console.log('Seed artwork written to', outDir);
