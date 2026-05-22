import fs from "node:fs";
import path from "node:path";

// Build an .ico file that embeds PNG images (supported by modern browsers).
// Spec: ICO header + directory entries + raw image data blocks.

function u16(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n, 0);
  return b;
}

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n, 0);
  return b;
}

function makeIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.concat([u16(0), u16(1), u16(count)]);

  let offset = 6 + 16 * count;
  const entries = [];
  const images = [];

  for (const buf of pngBuffers) {
    // width/height are 0 when 256 in ICO directory; we only embed 16/32 here.
    // We don't parse PNG IHDR; we use known sizes from filenames in this script's usage.
    const entry = Buffer.alloc(16);
    // Bytes: width, height, colors, reserved, planes(2), bpp(2), size(4), offset(4)
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    images.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...images]);
}

function main() {
  const root = process.cwd();
  const iconDir = path.join(root, "public", "icons");
  const png16 = fs.readFileSync(path.join(iconDir, "favicon-16x16.png"));
  const png32 = fs.readFileSync(path.join(iconDir, "favicon-32x32.png"));

  // Set width/height fields in directory entries based on our known sizes.
  const ico = makeIco([png16, png32]);

  // Patch width/height bytes per entry (entry layout fixed).
  // Entry 1 @ 6, entry 2 @ 22
  ico.writeUInt8(16, 6 + 0);
  ico.writeUInt8(16, 6 + 1);
  ico.writeUInt8(32, 6 + 16 + 0);
  ico.writeUInt8(32, 6 + 16 + 1);

  fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico);
}

main();

