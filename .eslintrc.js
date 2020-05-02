module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-underscore-dangle': 0,
    'arrow-parens': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': ['error', { props: false }],
    'arrow-body-style': 1,
    'no-unused-vars': 1,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-shadow': 1,
    'no-param-reassign': 1,
    'prefer-rest-params': 0,
    'func-names': ['error', 'as-needed'],
    'no-undef': 1,
    'no-trailing-spaces': ['error', { ignoreComments: true }],
    'max-classes-per-file': ['error', 2],
    'prefer-arrow-callback': 1,
    'func-names': ['warn', 'as-needed'],
  },
};
