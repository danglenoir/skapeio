import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import next from 'eslint-config-next';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([{
    extends: [...next],
    ignores: ['output/**'],
    plugins: {
        '@stylistic': stylistic,
        'simple-import-sort': simpleImportSort,
        'unused-imports': unusedImports,
    },
    rules: {
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/quotes': ['error', 'single', {
            allowTemplateLiterals: 'always',
            avoidEscape: true,
        }],
        'no-unused-vars': 'off',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': ['error', {
            groups: [
                ['^\\u0000'],
                ['^node:'],
                ['^react$', '^next', '^@?\\w'],
                ['^@/'],
                ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                ['^.+\\.s?css$'],
            ],
        }],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn', {
            args: 'after-used',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_',
        }],
    },
}]);
