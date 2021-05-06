const path = require('path');

const paths = {
  SRC_DIR: path.resolve(__dirname, '../../src'),
  BUILD_DIR: path.resolve(__dirname, '../../build'),
  STATIC_DIR: path.resolve(__dirname, '../../src/templates/static/'),
  HELPERS: path.resolve(__dirname, '../../src/templates/helpers/handlebars.js'),

  SCRIPTS: path.resolve(__dirname, '../../src/js/'),
  TEMPLATES: path.resolve(__dirname, '../../src/templates/'),
  IMAGES: path.resolve(__dirname, '../../src/images/'),
  COMPONENTS: path.resolve(__dirname, '../../src/js/components/'),
  PROVIDERS: path.resolve(__dirname, '../../src/js/providers/'),
};

module.exports = paths;
