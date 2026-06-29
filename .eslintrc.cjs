module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  settings: { react: { version: '18.3' } },
  ignorePatterns: ['dist', 'dist-ssr', 'node_modules', 'figma-make-export', 'src/data'],
  rules: {
    'react/prop-types': 'off',
    // Welsh and English interface copy contains apostrophes; escaping every
    // one harms readability and the content is static, author-controlled text.
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
