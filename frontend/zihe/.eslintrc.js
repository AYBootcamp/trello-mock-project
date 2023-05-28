module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'prettier', 'simple-import-sort', 'import'],
  rules: {
    // simple-import-sort
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'promise/param-names': 0
    // "react/prop-types": 0,
  }
}
