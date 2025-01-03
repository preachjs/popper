import { build } from 'esbuild'
import dtsPkg from 'npm-dts'

const { Generator } = dtsPkg

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
})

await new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts',
}).generate()

await build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: 'playground/bundle',
  format: 'esm',
})

await new Generator({
  entry: 'src/index.ts',
  output: 'playground/bundle/index.d.ts',
}).generate()