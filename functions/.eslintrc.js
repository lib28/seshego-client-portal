module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // keep google defaults, but stop blocking deploy
    'require-jsdoc': 'off',
    indent: 'off',

    // enforce the ones you’re hitting (so lint is consistent)
    quotes: ['error', 'single'],
    'object-curly-spacing': ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
    'no-console': 'off',
  },
};
