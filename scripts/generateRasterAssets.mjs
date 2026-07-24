import fs from 'node:fs';
import zlib from 'node:zlib';

const root = 'assets';
const ensureParent = (filePath) => fs.mkdirSync(filePath.slice(0, filePath.lastIndexOf('/')), { recursive: true });

function crc32(buffer) {
  let value = ~0;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return ~value >>> 0;
}

function writePng(filePath, width, height, draw) {
  const pixels = Buffer.alloc(width * height * 4);
  const setPixel = (x, y, color) => {
    const px = Math.trunc(x);
    const py = Math.trunc(y);
    if (px < 0 || py < 0 || px >= width || py >= height) return;
    const offset = (py * width + px) * 4;
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
    pixels[offset + 3] = color[3] ?? 255;
  };
  const api = {
    rect: (x, y, w, h, color) => { for (let yy = y; yy < y + h; yy += 1) for (let xx = x; xx < x + w; xx += 1) setPixel(xx, yy, color); },
    ellipse: (cx, cy, rx, ry, color) => { for (let y = cy - ry; y <= cy + ry; y += 1) for (let x = cx - rx; x <= cx + rx; x += 1) if (((x - cx) ** 2) / (rx * rx) + ((y - cy) ** 2) / (ry * ry) <= 1) setPixel(x, y, color); },
    line: (x0, y0, x1, y1, color, width = 1) => { const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= steps; i += 1) { const x = x0 + ((x1 - x0) * i) / steps; const y = y0 + ((y1 - y0) * i) / steps; api.ellipse(x, y, width, width, color); } },
    triangle: (a, b, c, color) => { const [x1, y1] = a; const [x2, y2] = b; const [x3, y3] = c; const minX = Math.min(x1, x2, x3); const maxX = Math.max(x1, x2, x3); const minY = Math.min(y1, y2, y3); const maxY = Math.max(y1, y2, y3); for (let y = minY; y <= maxY; y += 1) for (let x = minX; x <= maxX; x += 1) { const area = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3); const alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / area; const beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / area; const gamma = 1 - alpha - beta; if (alpha >= 0 && beta >= 0 && gamma >= 0) setPixel(x, y, color); } },
  };
  draw(api);
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const chunks = [];
  const chunk = (type, data) => {
    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const output = Buffer.alloc(8 + data.length + 4);
    output.writeUInt32BE(data.length, 0);
    output.write(type, 4);
    data.copy(output, 8);
    output.writeUInt32BE(crc32(typeAndData), 8 + data.length);
    chunks.push(output);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunk('IHDR', ihdr);
  chunk('IDAT', zlib.deflateSync(raw));
  chunk('IEND', Buffer.alloc(0));
  ensureParent(filePath);
  fs.writeFileSync(filePath, Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n', 'binary'), ...chunks]));
}

function actorSheet(filePath, kind) {
  writePng(filePath, 128 * 48, 128, (draw) => {
    for (let i = 0; i < 48; i += 1) {
      const x = i * 128;
      const cx = x + 64;
      const cy = 82;
      draw.ellipse(cx, 112, 34, 8, [0, 0, 0, 80]);
      if (kind === 'kael') {
        draw.rect(cx - 14, cy - 42, 28, 42, [28, 55, 76, 255]);
        draw.ellipse(cx, cy - 52, 10, 10, [220, 190, 150, 255]);
        const pose = i % 6;
        draw.line(cx - 16, cy - 25, cx - 55 + pose * 6, cy - 2 - pose * 3, [190, 235, 255, 255], 3);
        draw.line(cx + 16, cy - 25, cx + 55 - pose * 5, cy - 2 + pose * 3, [250, 215, 120, 255], 3);
        draw.line(cx - 8, cy, cx - 18, cy + 24, [35, 35, 48, 255], 4);
        draw.line(cx + 8, cy, cx + 18, cy + 24, [35, 35, 48, 255], 4);
      } else if (kind === 'soldier') {
        draw.rect(cx - 18, cy - 42, 36, 44, [76, 65, 68, 255]);
        draw.ellipse(cx, cy - 52, 11, 11, [112, 95, 96, 255]);
        draw.line(cx + 14, cy - 26, cx + 46, cy - 10, [150, 130, 115, 255], 4);
        draw.triangle([cx - 8, cy - 30], [cx + 8, cy - 30], [cx, cy - 12], [105, 35, 120, 255]);
      } else {
        draw.ellipse(cx, cy - 28, 32, 34, [86, 83, 82, 255]);
        draw.rect(cx - 24, cy - 4, 48, 32, [60, 58, 62, 255]);
        draw.line(cx + 26, cy - 28, cx + 56, cy + 8, [125, 105, 92, 255], 6);
        draw.triangle([cx - 18, cy - 40], [cx + 18, cy - 40], [cx, cy - 8], [124, 52, 150, 255]);
      }
    }
  });
}

actorSheet(`${root}/characters/kael/kael-atlas.png`, 'kael');
actorSheet(`${root}/enemies/corrupted-soldier/soldier-atlas.png`, 'soldier');
actorSheet(`${root}/enemies/stone-brute/brute-atlas.png`, 'brute');
writePng(`${root}/environments/asteria/asteria-tileset.png`, 512, 256, (draw) => { const colors = [[48,50,57,255],[55,58,66,255],[39,43,47,255],[65,60,55,255],[42,60,48,255],[35,32,41,255],[88,74,58,255],[75,72,78,255]]; for (let i = 0; i < 32; i += 1) { const x = (i % 8) * 64; const y = Math.floor(i / 8) * 64; draw.rect(x, y, 64, 64, colors[i % 8]); draw.line(x + 8, y + 20, x + 56, y + 18, [25,25,30,160], 1); draw.line(x + 20, y + 44, x + 50, y + 50, [20,20,25,120], 1); } });
for (const [path, width, height, color] of [['debug/missing-texture.png',64,64,[255,0,255,255]], ['environments/asteria/asteria-background.png',1280,720,[20,18,25,255]], ['ui/hud-frame.png',512,128,[35,28,38,230]], ['ui/character-select.png',768,512,[28,27,40,240]], ['characters/kael/kael-portrait.png',256,256,[32,57,75,255]], ['ui/skill-icons.png',384,64,[40,38,52,255]], ['characters/kael/kael-icons.png',384,64,[35,50,65,255]]]) writePng(`${root}/${path}`, width, height, (draw) => { draw.rect(0, 0, width, height, color); draw.rect(4, 4, width - 8, height - 8, [139, 110, 70, 255]); });
for (const name of ['sword-effects-atlas', 'status-effects-atlas', 'telegraph-atlas', 'shadows-atlas', 'props-atlas']) writePng(`${root}/effects/${name}.png`, 128 * 16, 128, (draw) => { for (let i = 0; i < 16; i += 1) { const x = i * 128; draw.ellipse(x + 64, 64, 46, 18, [120,220,255,90]); draw.line(x + 20, 96, x + 108, 32, [255,210,110,220], 5); draw.triangle([x + 64,18], [x + 78,64], [x + 64,110], [190,70,220,130]); } });
console.log('Generated local raster placeholder PNG assets.');
