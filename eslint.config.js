const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Allow unused variables (useful for learning examples)
            '@typescript-eslint/no-unused-vars': 'warn',

            // Allow any type for learning purposes
            '@typescript-eslint/no-explicit-any': 'warn',

            // Allow empty functions
            '@typescript-eslint/no-empty-function': 'warn',
        },
    },
    {
        ignores: ['node_modules/', '*.js', '*.d.ts', 'dist/', 'build/'],
    }
);
