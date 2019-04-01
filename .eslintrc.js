module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        'singleline': 2,
        'multiline': {
          'max': 1,
          'allowFirstLine': false
        }
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        "html": {
          "void": "any",
          "normal": "any",
          "component": "any"
        },
        "svg": "always",
        "math": "always"
      }
    ]
  }
}
