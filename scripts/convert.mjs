import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function convert() {
  const files = [
    'public/textures/golden_leaf.png',
    'public/textures/realistic_leaf.png',
    'public/textures/earth/earth_atmos_2048.jpg',
    'public/textures/earth/earth_clouds_1024.png',
    'public/textures/earth/earth_normal_2048.jpg',
    'public/textures/earth/earth_specular_2048.jpg'
  ];
  for (const file of files) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const dir = path.dirname(file);
    const out = path.join(dir, `${basename}.webp`);
    try {
      await sharp(file).webp({ quality: 80 }).toFile(out);
      console.log(`Converted ${file} to ${out}`);
      await fs.unlink(file); // remove original
    } catch (e) {
      console.error(e);
    }
  }
}
convert();
