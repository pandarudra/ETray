module.exports = {
  root: true,                          // This tells ESLint that this is the root config (no parent configs above)
  env: { browser: true, es2020: true }, // Defines environment: browser globals + ES2020 features available

  extends: [
    'eslint:recommended',               // Starts with ESLint's recommended default rules
    'plugin:@typescript-eslint/recommended', // Adds recommended TypeScript rules
    'plugin:react-hooks/recommended',   // Adds recommended rules for React Hooks usage
  ],

  ignorePatterns: ['dist', '.eslintrc.cjs'], // ESLint will ignore these files/folders

  parser: '@typescript-eslint/parser',  // Uses the TS parser so ESLint understands TypeScript code

  plugins: ['react-refresh'],           // Adds React Refresh plugin (helps with fast refresh in dev)

  rules: {
    'react-refresh/only-export-components': [
      'warn',                           // Show warning (not error) for rule violations
      { allowConstantExport: true },    // Allow components exported as constants
    ],
  },
}

