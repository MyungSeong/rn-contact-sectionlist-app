module.exports = {
    root: true,
    extends: ['@react-native-community', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-unused-vars': ['warn'],
                '@typescript-eslint/no-shadow': ['error'],
                'no-shadow': 'off',
                'no-undef': 'off',
                'prettier/prettier': ['error', { endOfLine: 'auto' }],
                'react/jsx-curly-brace-presence': [
                    'warn',
                    { props: 'never', children: 'never' },
                ],
            },
        },
    ],
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            'babel-module': {},
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.native.js'],
            },
        },
    },
};
