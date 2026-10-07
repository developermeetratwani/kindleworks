import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public')
const TARGETS = ['.jpg', '.jpeg', '.png']

for (const file of readdirSync(PUBLIC_DIR)) {
  const ext = extname(file).toLowerCase()
  if (!TARGETS.includes(ext)) continue
  const srcPath = join(PUBLIC_DIR, file)
  const destPath = join(PUBLIC_DIR, `${basename(file, ext)}.webp`)
  const before = statSync(srcPath).size
  const meta = await sharp(srcPath).metadata()
  await sharp(srcPath).webp({ quality: 82 }).toFile(destPath)
  const after = statSync(destPath).size
  console.log(`${file} (${meta.width}x${meta.height}, ${Math.round(before / 1024)}KB) -> ${basename(destPath)} (${Math.round(after / 1024)}KB)`)
}
