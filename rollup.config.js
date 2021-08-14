import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import sass from 'dart-sass'
import * as path from 'path'
const pkg = require('./package.json')

const rootDir = path.resolve(__dirname, './src')

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
    }
  ],
  watch: {
    include: 'src/**'
  },
  plugins: [
    peerDepsExternal(), // 避免将peer依赖 打包到最终bundle中
    commonjs(), // 能转换为cjs
    alias({
      resolve: ['.ts', '.tsx'],
      entries: [
        {
          find: '@',
          replacement: rootDir
        }
      ]
    }),

    resolve(), // 是否循序第三方库打包到bundle中
    typescript({ useTsconfigDeclarationDir: true }), // 编译typescript
    postcss({
      preprocessor: (content, id) =>
        new Promise(res => {
          const result = sass.renderSync({ file: id })

          res({ code: result.css.toString() })
        }),
      plugins: [autoprefixer],
      sourceMap: true,
      extract: true
    })
  ],
  external: Object.keys(pkg.peerDependencies || {})
}
