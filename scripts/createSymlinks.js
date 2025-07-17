import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const links = [
  {
    target: path.resolve(__dirname, '../dist/blogs/design-patterns'),
    link: path.resolve(__dirname, '../public/blogs/design-patterns'),
  },
  {
    target: path.resolve(__dirname, '../dist/blogs/oops'),
    link: path.resolve(__dirname, '../public/blogs/oops'),
  },
  {
    target: path.resolve(__dirname, '../dist/blogs/system-design'),
    link: path.resolve(__dirname, '../public/blogs/system-design'),
  },
];

links.forEach(({ target, link }) => {
  try {
    if (fs.existsSync(link)) {
      fs.unlinkSync(link);
      console.log(`Deleted existing symlink or folder: ${link}`);
    }
    fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
    console.log(`Symlink created: ${link} -> ${target}`);
  } catch (err) {
    console.error(`Failed to create symlink for ${link}:`, err.message);
  }
});