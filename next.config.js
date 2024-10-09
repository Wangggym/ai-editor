const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new MonacoWebpackPlugin({
        languages: ['javascript', 'typescript', 'html', 'css'],
        filename: 'static/[name].worker.js',
      }))
    }
    return config
  },
}

module.exports = nextConfig