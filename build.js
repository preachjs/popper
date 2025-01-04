import path, { basename, extname, join } from 'node:path'
import { parseArgs } from 'node:util'
import chokidar from 'chokidar'
import { analyzeMetafile, context } from 'esbuild'
import dtsPkg from 'npm-dts'
const { Generator } = dtsPkg

const flag = parseArgs({
  options: {
    watch: {
      type: 'boolean',
      short: 'w',
      default: false,
    },
  },
})

const { watch } = flag.values
const input = ['src/index.ts', 'src/arrow.ts']
await createBuilder(input, 'dist')
await createBuilder(input, 'docs/bundle', 'docs')

async function createBuilder(input, output, serveDir) {
  const watchGraph = []
  const ctx = await context({
    entryPoints: [].concat(input),
    bundle: true,
    outdir: output,
    format: 'esm',
    metafile: true,
    plugins: [
      {
        name: 'watch-graph',
        setup(builder) {
          builder.onResolve({ filter: /.*/ }, args => {
            watchGraph.push(path.resolve(args.path))
            return
          })
        },
      },
    ],
  })

  async function generateBundle() {
    const buildOut = await ctx.rebuild()
    console.log(await analyzeMetafile(buildOut.metafile))
    const baseFile = input[0]
    await new Generator({
      entry: baseFile,
      output: path.join(
        output,
        basename(baseFile).replace(extname(baseFile), '.d.ts')
      ),
    }).generate()
  }

  if (watch) {
    const watcher = chokidar.watch(input, {
      ignored(f) {
        return f.startsWith('node_modules') || f.startsWith(path.join(output))
      },
    })
    const usableGraph = watchGraph.filter(
      d => Boolean(d) && join(d) != join(input)
    )
    if (usableGraph.length) {
      watcher.add(...usableGraph)
    }
    watcher.on('all', async (e, f) => {
      if (e === 'change') {
        console.log(`${f} changed, rebuilding...`)
      }
      await generateBundle()
    })
  }

  await generateBundle()
  if (!watch) {
    await ctx.dispose()
  }

  if (watch && serveDir) {
    await ctx.serve({
      servedir: serveDir,
    })
  }
}
