module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.js',
                    '.ios.js',
                    '.android.js',
                    '.jsx',
                    '.ts',
                    '.ios.ts',
                    '.android.ts',
                    '.tsx',
                    '.json',
                ],
                alias: {
                    '@': './src',
                    '@api': './src/api',
                    '@assets': './src/assets',
                    '@components': './src/components',
                    '@layouts': './src/layouts',
                    '@utils': './src/utils',
                },
            },
        ],
        ['react-native-reanimated/plugin'],
    ],
};
