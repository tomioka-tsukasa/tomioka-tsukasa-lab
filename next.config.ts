import type { NextConfig } from 'next'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    // 既存のGLSLルールを削除
    config.module.rules = config.module.rules.filter((rule) => {
      if (rule.test) {
        const testStr = rule.test.toString()
        if (testStr.includes('glsl') || testStr.includes('vert') || testStr.includes('frag') || testStr.includes('vs') || testStr.includes('fs')) {
          return false
        }
      }
      return true
    })

    // 新しいGLSLルールを追加
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/i,
      use: [
        'raw-loader',
        {
          loader: require.resolve('./src/lib/glsl/glsl-include-loader.js'),
        },
      ],
    })

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    })

    return config
  },
}

export default withVanillaExtract(nextConfig)
