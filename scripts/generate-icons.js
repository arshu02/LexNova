const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function createPNG(width, height) {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // no interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data: filter byte (0) + width * 4 bytes per row
  const rawRowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rawRowLen * height);

  // Background deep dark navy (#05070E) with subtle blue-gold badge
  for (let y = 0; y < height; y++) {
    const rowStart = y * rawRowLen;
    rawData[rowStart] = 0; // Filter: None
    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const px = rowStart + 1 + x * 4;

      // Distance from center
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.42) {
        // Inner badge gradient: Royal Blue (#2563EB) to Indigo (#4F46E5) with Gold accent
        const t = (nx + ny) * 0.5;
        rawData[px + 0] = Math.round(37 + t * 50);  // R
        rawData[px + 1] = Math.round(99 + t * 60);  // G
        rawData[px + 2] = Math.round(235 - t * 30); // B
        rawData[px + 3] = 255;                      // A
      } else {
        // Dark background
        rawData[px + 0] = 5;
        rawData[px + 1] = 7;
        rawData[px + 2] = 14;
        rawData[px + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const s of sizes) {
  const png = createPNG(s, s);
  const outPath = path.join(iconsDir, `icon-${s}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Generated: ${outPath} (${png.length} bytes)`);
}
