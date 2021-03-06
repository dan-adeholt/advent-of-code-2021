module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'object-curly-newline': 0,
    'no-restricted-syntax': 0,
    'no-bitwise': 0,
    'no-plusplus': 0,
    'no-console': 0,
    'no-continue': 0,
    '@typescript-eslint/no-loop-func': 0,
    '@typescript-eslint/no-implied-eval': 0,
    'comma-dangle': 0,
    'max-len': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'import/prefer-default-export': 0
  },
};
