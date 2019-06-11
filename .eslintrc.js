module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  plugins: [
    'import',
    'vue',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module'
  },
  rules: {
    strict: 'error',
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    'no-param-reassign': 0,
    'no-return-assign': ['error', 'always'],
    'func-names': ['error', 'never'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
};
