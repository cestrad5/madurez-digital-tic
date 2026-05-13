module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.3' } },
  plugins: ['react-refresh'],
  rules: {
    // Detecta imports declarados pero nunca usados
    'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

    // Obliga a declarar dependencias correctas en useEffect/useCallback/useMemo
    'react-hooks/exhaustive-deps': 'warn',

    // Avisa si un componente no puede recargarse en caliente correctamente
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // No es necesario importar React en cada archivo (nuevo JSX transform)
    'react/react-in-jsx-scope': 'off',

    // PropTypes es opcional cuando no se usa TypeScript
    'react/prop-types': 'off',
  },
};
