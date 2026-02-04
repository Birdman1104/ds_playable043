import fs from 'node:fs/promises';
import path from 'node:path';

const PREFIX = 'Property 1=';
const IMAGES_DIR = path.resolve(process.cwd(), 'images');

const renameImages = async () => {
  const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());

  for (const file of files) {
    if (!file.name.startsWith(PREFIX)) continue;

    const nextName = file.name.replace(PREFIX, '');
    const fromPath = path.join(IMAGES_DIR, file.name);
    const toPath = path.join(IMAGES_DIR, nextName);

    try {
      await fs.access(toPath);
      console.warn(`Skip (exists): ${nextName}`);
      continue;
    } catch {
      // ok, destination does not exist
    }

    await fs.rename(fromPath, toPath);
    console.log(`Renamed: ${file.name} -> ${nextName}`);
  }
};

renameImages().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
