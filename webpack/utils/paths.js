const path = require('path');

const paths = {
  SRC_DIR: path.resolve(__dirname, '../../src'),
  BUILD_DIR: path.resolve(__dirname, '../../build'),
  STATIC_DIR: path.resolve(__dirname, '../../src/assets/templates/static/'),
  HELPERS: path.resolve(__dirname, '../../src/assets/templates/helpers/handlebars.js'),

  SCRIPTS: path.resolve(__dirname, '../../src/'),
  TEMPLATES: path.resolve(__dirname, '../../src/assets/templates/'),
  IMAGES: path.resolve(__dirname, '../../src/assets/images/'),
  COMPONENTS: path.resolve(__dirname, '../../src/components/'),
  PROVIDERS: path.resolve(__dirname, '../../src/providers/'),
};

module.exports = paths;
