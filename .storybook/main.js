const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  stories: ['../src/**/*.stories.tsx', '../src/**/*.stories.mdx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader'],
      include: path.resolve(__dirname, '../src')
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src')
    }
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  }
}
