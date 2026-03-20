#!/usr/bin/env node
/**
 * 生成适用于 Chrome Web Store 的截图。
 * 输出尺寸：
 * - 1280 x 800
 * - 640 x 400
 *
 * 保持原图比例并使用白底填充，避免透明背景带来上传兼容性问题。
 */

import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE_DIRS = ['ch', 'en']
const OUTPUT_DIR = 'chrome-store'
const TARGET_SIZES = [
  { width: 1280, height: 800, name: '1280x800' },
  { width: 640, height: 400, name: '640x400' }
]
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 }

async function ensureDir(path) {
  await mkdir(path, { recursive: true })
}

async function exportImage(inputPath, locale, filename) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  for (const size of TARGET_SIZES) {
    const outputPath = join(
      __dirname,
      OUTPUT_DIR,
      size.name,
      locale,
      filename
    )

    await ensureDir(dirname(outputPath))

    await sharp(inputPath)
      .resize(size.width, size.height, {
        fit: 'contain',
        background: BACKGROUND
      })
      .flatten({ background: BACKGROUND })
      .png({ compressionLevel: 9 })
      .toFile(outputPath)

    console.log(
      `✓ ${locale}/${filename} (${metadata.width}x${metadata.height} → ${size.name})`
    )
  }
}

async function processLocale(locale) {
  const localeDir = join(__dirname, locale)
  const entries = await readdir(localeDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.png')) {
      continue
    }

    await exportImage(join(localeDir, entry.name), locale, entry.name)
  }
}

async function main() {
  console.log('生成 Chrome Web Store 截图...\n')

  for (const locale of SOURCE_DIRS) {
    await processLocale(locale)
  }

  console.log(`\n✅ 完成，输出目录：${OUTPUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
