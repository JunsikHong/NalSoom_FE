const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@HeadComponent': path.resolve(__dirname, 'src/components/HeadComponent'),
            '@FootComponent': path.resolve(__dirname, 'src/components/FootComponent'),
            '@LoginComponent': path.resolve(__dirname, 'src/components/LoginComponent'),
            '@MainComponent': path.resolve(__dirname, 'src/components/MainComponent'),
            '@MapComponent': path.resolve(__dirname, 'src/components/MainComponent/MapComponent'),
            '@ShelterComponent': path.resolve(__dirname, 'src/components/MainComponent/ShelterComponent'),
            '@Pages': path.resolve(__dirname, 'src/pages'),
            '@Style': path.resolve(__dirname, 'src/style'),
            '@Store': path.resolve(__dirname, 'src/store'),
            '@Images' : path.resolve(__dirname, 'src/images'),
            '@Services': path.resolve(__dirname, 'src/services')
        }
    }
};
