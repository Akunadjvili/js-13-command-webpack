const { STATIC_DIR } = require('../utils/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function filterHtmlFiles(files, ext = 'hbs') {
  const baseFiles = files.filter(file =>
    file.toLocaleLowerCase().endsWith(`.${ext}`),
  );
  const outputFiles = baseFiles.map(name => {
    return name.split('.').slice(0, -1).join('.');
  });
  return outputFiles;
}

function getHtmlFiles(path) {
  return fs.readdirSync(path, { withFileTypes: false });
}

module.exports = function configurateStaticHtmlPages({
  compress = false,
  input = 'hbs',
  output = 'html',
} = {}) {
  const options = compress
    ? {
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }
    : {
      minify: false,
    };

  const fileList = filterHtmlFiles(getHtmlFiles(STATIC_DIR), input);
  console.log(fileList);

  return fileList.map(
    file =>
      new HtmlWebpackPlugin({
        filename: `${file}.${output}`,
        template: `${STATIC_DIR}/${file}.${input}`,
        chunks: [`${file}`],
        ...options,
      }),
  );
};
