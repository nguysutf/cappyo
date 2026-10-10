import config from '../../configs/eslint/node.mjs'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config,
]