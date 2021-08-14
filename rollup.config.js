import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import sass from 'dart-sass'
import * as path from 'path'

const pkg = require('./package.json')
const root = path.resolve(__dirname)

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
  plugins: [
    peerDepsExternal(), // 避免将peer依赖 打包到最终bundle中
    resolve({
      extensions: ['.ts', '.tsx']
    }), // 是否循序第三方库打包到bundle中
    commonjs(), // 能转换为cjs
    typescript({ useTsconfigDeclarationDir: true }), // 编译typescript
    alias({
      entries: {
        find: '@',
        replacement: path.resolve(root, 'src')
      }
    }),
    postcss({
      preprocessor: (content, id) =>
        new Promise(res => {
          const result = sass.renderSync({ file: id })

          res({ code: result.css.toString() })
        }),
      // plugins: [autoprefixer],
      // modules: {
      //   scopeBehaviour: 'global',
      // },
      sourceMap: true,
      extract: true
    })
  ]
}
