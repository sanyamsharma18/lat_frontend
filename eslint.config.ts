import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const ignoresConfig = [
    {
        name: 'custom/eslint/ignores',
        // the ignores option needs to be in a separate configuration object
        // replaces the .eslintignore file
        ignores: ['.next/', '.vscode/', 'public/', '.yarn/', '.pnp.cjs', '.pnp.loader.mjs'],
    },
];

export default [
    ...compat.extends(
        'airbnb',
        'airbnb/hooks',
        'prettier',
    ),
    ...ignoresConfig,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: ['./tsconfig.json'],
                },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin as never,
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'warn',
        },
        rules: {
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                    json: 'always',
                },
            ],
            'react/jsx-filename-extension': [
                1,
                {
                    extensions: ['.js', '.ts', '.tsx'],
                },
            ],
            'react/jsx-indent': [2, 4],
            'react/jsx-indent-props': [2, 4],
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error'],
                },
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': ['error'],
            'react/react-in-jsx-scope': 0,
            'object-curly-spacing': ['error', 'always'],
            'max-len': [
                'error',
                {
                    code: 120,
                    comments: 150,
                    ignoreUrls: true,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                },
            ],
            'no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                },
            ],
            'jsx-a11y/anchor-is-valid': 0,
            'react/jsx-props-no-spreading': 'off',
            'no-param-reassign': 'off',
            'import/prefer-default-export': 'off',
            'jsx-a11y/control-has-associated-label': 'off',
            'react/require-default-props': 'off',
            'react/prop-types': 'off',
            'no-underscore-dangle': 'off',
            'no-shadow': 'off',
            camelcase: 'off',
            'no-undef': 'off',
            'import/no-cycle': 'off',
            'jsx-a11y/media-has-caption': 'off',
            'jsx-quotes': ['error', 'prefer-single'],
            'import/no-named-as-default': 'off',
            'no-nested-ternary': 'off',
            'import/no-named-as-default-member': 'off',
            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',
            'react/function-component-definition': [
                0,
                {
                    namedComponents: 'arrow-function',
                },
            ],
            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: [
                        '**/*.test.js',
                        '**/*.spec.js',
                        '**/test/**',
                        '**/tests/**',
                        '**/*.config.js',
                        '**/*.config.ts',
                        '**/*.eslintrc.js',
                        '**/eslint.config.js',
                    ],
                },
            ],
        },
    },
];
