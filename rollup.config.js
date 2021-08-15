import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import * as path from 'path'
import copy from 'rollup-plugin-copy'

const pkg = require('./package.json')
const rootDir = path.resolve(__dirname, './src')
const EXTENSIONS = ['.ts', '.tsx']
const EXTERNAL = [Object.keys(pkg.devDependencies)].concat(Object.keys(pkg.peerDependencies))

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
      // preserveModules: true // important
    }
  ],
  watch: {
    include: 'src/**'
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss(),
    alias({
      resolve: EXTENSIONS,
      entries: [
        {
          find: '@',
          replacement: rootDir
        }
      ]
    }),
    babel({
      extensions: EXTENSIONS, // Compile our TypeScript files
      babelHelpers: 'bundled',
      include: EXTENSIONS.map(ext => `src/**/*${ext}`),
      babelrc: true
    }),
    copy({
      targets: [
        {
          src: 'src/variables.scss',
          dest: 'lib',
          rename: 'variables.scss'
        },
        {
          src: 'src/typography.scss',
          dest: 'lib',
          rename: 'typography.scss'
        }
      ]
    })
  ],
  external: EXTERNAL
}
