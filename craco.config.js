const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@HeadComponent': path.resolve(__dirname, 'src/HeadComponent'),
            '@LoginComponent': path.resolve(__dirname, 'src/LoginComponent'),
            '@MainComponent': path.resolve(__dirname, 'src/MainComponent'),
            '@MapComponent': path.resolve(__dirname, 'src/MainComponent/MapComponent'),
            '@Pages': path.resolve(__dirname, 'src/Pages'),
            '@Style': path.resolve(__dirname, 'src/Style'),
            '@Store': path.resolve(__dirname, 'src/Store'),
            '@Images' : path.resolve(__dirname, 'src/Images')
        }
    }
};
