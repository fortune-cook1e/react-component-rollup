import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import html from '@rollup/plugin-html'
import alias from '@rollup/plugin-alias'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

import * as path from 'path'

const pkg = require('./package.json')
const isDev = process.env.NODE_ENV === 'development'
const extensions = ['.js', '.ts', '.tsx']
const rootDir = path.resolve(__dirname, './src')
const EXTERNAL = [Object.keys(pkg.devDependencies)]
  .concat(Object.keys(pkg.peerDependencies))
  .concat(Object.keys(pkg.dependencies))
  .push(/@babel\/runtime/)

export default {
  // 开发模式则用main，组件库打包则用index.ts
  input: './src/index.ts',
  output: {
    file: pkg.module,
    format: 'esm',
    sourcemap: true
  },
  // TIP: 打包应该分为两种 一种为需要依赖(dev:page 和 page部署需要) 第二种组件话不需要依赖
  external: EXTERNAL, // 解决打包问题 可以替换rollup-plugin-peer-deps-external
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      // plugins: [],
      modules: false, // 模块化
      minimize: true,
      use: {
        sass: null,
        stylus: null,
        less: { javascriptEnabled: true }
      },
      extract: true,
      config: false // 不走配置文件 与 webpack隔离
    }),
    resolve({
      browser: true,
      extensions
    }),
    alias({
      resolve: extensions,
      entries: [
        {
          find: '@',
          replacement: rootDir
        }
      ]
    }),
    commonjs({
      include: /node_modules/
    }),
    replace({
      browser: true, // 这个很重要
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production')
    }),
    babel({
      extensions: extensions, // Compile our TypeScript files
      babelHelpers: 'runtime',
      include: extensions.map(ext => `src/**/*${ext}`),
      babelrc: true
    }),
    // html({
    //   fileName: 'index.html',
    //   title: 'Rollup + TypeScript + React = ❤️',
    //   template: ({ title }) => {
    //     return `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //     <meta charset="utf-8">
    //     <title>${title}</title>
    //     <link rel="stylesheet" href="index.esm.css">
    //   </head>
    //   <body>
    //     <div id="root"></div>
    //     <script src="index.esm.js" type='module'></script>
    //   </body>
    //   </html>
    //   `
    //   }
    // }),
    // serve({
    //   host: 'localhost',
    //   port: 3000,
    //   contentBase: ['lib']
    // }),
    // livereload({
    //   watch: 'lib'
    // }),
    copy({
      targets: [
        {
          src: 'src/styles/variables.less',
          dest: 'lib',
          rename: 'styles/variables.less'
        }
      ]
    })
  ]
}
