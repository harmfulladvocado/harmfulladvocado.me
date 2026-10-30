import * as fs from 'fs'

import * as esbuild from 'esbuild'

import site from './content/site.json'

interface BuildConfig {
  cssDest: string
  cssSource: string
  entryPoint: string
  htmlDest: string
  htmlFallbackDest: string
  htmlSource: string
  minify: boolean
  outfile: string
  siteUrl: string
  sourcemap: boolean
}

interface StaticCopy {
  dest: string
  source: string
}

const config: BuildConfig = {
  cssDest: 'dist/styles.css',
  cssSource: 'src/styles/styles.css',
  entryPoint: 'src/index.tsx',
  htmlDest: 'dist/index.html',
  htmlFallbackDest: 'dist/404.html',
  htmlSource: 'src/index.html',
  minify: true,
  outfile: 'dist/index.js',
  siteUrl: 'https://harmfulladvocado.me',
  sourcemap: false,
}

const STATIC_FILES: StaticCopy[] = [
  { dest: 'dist/CNAME', source: 'CNAME' },
  { dest: 'dist/llms.txt', source: 'src/llms.txt' },
  { dest: 'dist/robots.txt', source: 'src/robots.txt' },
  { dest: 'dist/site.webmanifest', source: 'src/site.webmanifest' },
]

const STATIC_DIRECTORIES: StaticCopy[] = [
  { dest: 'dist/Skript-blocks', source: 'Skript-blocks' },
  { dest: 'dist/images', source: 'src/images' },
]

/**
 * Builds the site, watching for changes when --watch is passed.
 */
async function build(): Promise<void> {
  const isWatch = process.argv.includes('--watch')

  try {
    fs.mkdirSync('dist', { recursive: true })
    copyAssets()
    writeSitemap()

    if (isWatch) {
      await startWatchMode()
    } else {
      await compileBundles(config.minify, config.sourcemap)
      verifyOutput()
      console.log('Build complete')
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Build failed: ${message}`)
    process.exit(1)
  }
}

/**
 * Compiles the JavaScript and CSS bundles.
 * @param minify - Whether to minify the output.
 * @param sourcemap - Whether to emit source maps.
 */
async function compileBundles(minify: boolean, sourcemap: boolean): Promise<void> {
  await esbuild.build({
    bundle: true,
    define: {
      'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'),
    },
    entryPoints: [config.entryPoint],
    format: 'esm',
    minify,
    outfile: config.outfile,
    platform: 'browser',
    sourcemap,
    target: ['es2020'],
  })

  await esbuild.build({
    bundle: true,
    entryPoints: [config.cssSource],
    minify,
    outfile: config.cssDest,
    sourcemap,
  })

  console.log('Bundles compiled')
}

async function startWatchMode(): Promise<void> {
  console.log('Starting development watch mode')

  await (
    await esbuild.context({
      bundle: true,
      define: {
        'process.env.NODE_ENV': '"development"',
      },
      entryPoints: [config.entryPoint],
      format: 'esm',
      outfile: config.outfile,
      platform: 'browser',
      sourcemap: true,
      target: ['es2020'],
    })
  ).watch()

  await (
    await esbuild.context({
      bundle: true,
      entryPoints: [config.cssSource],
      outfile: config.cssDest,
      sourcemap: true,
    })
  ).watch()

  fs.watch(config.htmlSource, (eventType: string) => {
    if (eventType === 'change') {
      copyHtml()
      console.log('HTML rebuilt')
    }
  })

  STATIC_DIRECTORIES.forEach((entry: StaticCopy) => {
    if (!fs.existsSync(entry.source)) {
      return
    }

    fs.watch(entry.source, { recursive: true }, () => {
      copyDirectory(entry)
      console.log(`${entry.source} updated`)
    })
  })

  STATIC_FILES.forEach((entry: StaticCopy) => {
    if (!fs.existsSync(entry.source)) {
      return
    }

    fs.watch(entry.source, (eventType: string) => {
      if (eventType === 'change') {
        copyFile(entry)
        console.log(`${entry.source} updated`)
      }
    })
  })

  console.log('Watching for changes')
}

function copyAssets(): void {
  copyHtml()
  STATIC_FILES.forEach((entry: StaticCopy) => {
    copyFile(entry)
  })
  STATIC_DIRECTORIES.forEach((entry: StaticCopy) => {
    copyDirectory(entry)
  })
}

function copyHtml(): void {
  const html = fs.readFileSync(config.htmlSource, 'utf-8')
  const themeColorMeta = `    <meta content="${site['theme-color']}" name="theme-color" />`
  const fallbackHtml = html
    .replace(/<title>.*?<\/title>/, `<title>${site['not-found-title']}</title>`)
    .replace(themeColorMeta, `${themeColorMeta}\n    <meta content="noindex" name="robots" />`)

  fs.writeFileSync(config.htmlDest, html)
  fs.writeFileSync(config.htmlFallbackDest, fallbackHtml)
}

function copyFile(entry: StaticCopy): void {
  if (fs.existsSync(entry.source)) {
    fs.copyFileSync(entry.source, entry.dest)
  }
}

function copyDirectory(entry: StaticCopy): void {
  if (fs.existsSync(entry.source)) {
    fs.cpSync(entry.source, entry.dest, { recursive: true })
  }
}

function writeSitemap(): void {
  const paths = ['/', '/Skript-blocks/']
  const urls = paths.map((path: string) => `  <url><loc>${config.siteUrl}${path}</loc></url>`).join('\n')
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')

  fs.writeFileSync('dist/sitemap.xml', sitemap)
}

function verifyOutput(): void {
  const required = [
    config.htmlDest,
    config.htmlFallbackDest,
    config.outfile,
    config.cssDest,
    'dist/CNAME',
    'dist/robots.txt',
    'dist/sitemap.xml',
    'dist/images/pfp.svg',
  ]

  required.forEach((output: string) => {
    if (!fs.existsSync(output)) {
      throw new Error(`Missing build output: ${output}`)
    }
  })
}

build().catch((error: unknown) => {
  console.error('Build failed:', error)
  process.exit(1)
})
