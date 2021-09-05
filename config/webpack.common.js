const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const deps = require('../package.json').dependencies

const isDev = process.env.NODE_ENV === 'development'

const jstsRegex = /\.(js|jsx|ts|tsx)$/
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const cssModuleOptions = (type, useModules) => {
  const options = { importLoaders: type || 1 }
  if (useModules) {
    options.modules = {
      localIdentName: '[path][name]_[hash:base64:5]',
      // localIdentContext: paths.src,
      exportLocalsConvention: 'camelCase'
    }
  }
  return options
}

const lessOptions = () => {
  const vars = paths.src + '/styles/variables.less'
  const lessOptions = {
    modifyVars: { hack: `true; @import "${vars}";` },
    javascriptEnabled: true
  }
  return {
    lessOptions
  }
}

const config = {
  // FIXBUG: 解决webpack-dev-server 热更新未开启bug
  target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',
  entry: {
    app: paths.src + '/index.tsx'
  },
  output: {
    path: paths.build,
    // publicPath: isDev ? '/' : './',
    publicPath: 'auto', // 解决 federation 找不到模块bug
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash].js',
    chunkFilename: isDev ? 'js/[name].js' : 'js/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': paths.src
    }
  },
  module: {
    rules: [
      // {
      //   test: /bootstrap\.tsx$/,
      //   loader: 'bundle-loader'
      //   // options: {
      //   //   lazy: true
      //   // }
      // },
      {
        test: jstsRegex,
        exclude: '/node_modules/',
        include: paths.src,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: cssRegex,
        exclude: [cssModuleRegex, '/node_modules/'],
        include: paths.src,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: cssModuleOptions(1, false)
          },
          'postcss-loader'
        ],
        sideEffects: true
      },
      {
        test: cssModuleRegex,
        exclude: '/node_modules/',
        include: paths.src,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: cssModuleOptions(1, true)
          },
          'postcss-loader'
        ]
      },
      {
        test: lessRegex,
        exclude: [lessModuleRegex, '/node_modules/'],
        include: paths.src,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: cssModuleOptions(1, false)
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: lessOptions()
          }
        ],
        sideEffects: true
      },
      {
        test: lessModuleRegex,
        exclude: '/node_modules/',
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: cssModuleOptions(1, true) },
          'postcss-loader',
          { loader: 'less-loader' }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'React Webpack Template',
      template: paths.public + '/index.html', // template file
      favicon: paths.public + '/favicon.ico',
      filename: 'index.html', // output file
      inject: 'body' // script插入body底部
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new ModuleFederationPlugin({
      name: 'reactComponent',
      filename: 'react-component.js',
      remotes: {
        app2: 'app2@http://localhost:3000/app2.js'
        // home: 'home@http://localhost:3002/home.js',
        // reactApp: 'reactApp@http://localhost:8081/react-app.js'
        // cookie: 'cookie@http://localhost:8080/cookie.js'
      },
      exposes: {
        './Button': './src/components/Button',
        './ChartDemo': './src/components/ChartDemo'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom']
        }
      }
    })
  ]
}

module.exports = config
