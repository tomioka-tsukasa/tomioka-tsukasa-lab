import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      // Webpack loaders
      'src/lib/glsl/glsl-include-loader.js',
      // Build outputs
      '.next/',
      'out/',
      'dist/',
      // Dependencies
      'node_modules/',
    ],
    rules: {
      'eol-last': ['error', 'always'],
      'indent': ['error', 2, {'SwitchCase': 1}],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-trailing-spaces': ['error', {
        'ignoreComments': true
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'padding-line-between-statements': ['error',
        { blankLine: 'always', prev: '*', next: 'return' }
      ]
    }
  }
]

export default eslintConfig
