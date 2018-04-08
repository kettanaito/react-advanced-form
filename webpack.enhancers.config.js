const glob = require('glob');
const path = require('path');
const defaultConfig = require('./webpack.config');

function getEntries() {
  const entriesFilePaths = glob.sync(path.resolve(__dirname, 'src/enhancers/*.js'));
  if (entriesFilePaths.length === 0) {
    return;
  }

  return entriesFilePaths.reduce((acc, filePath) => {
    const { name } = path.parse(filePath);
    acc[name] = filePath;
    return acc;
  }, {});
}

module.exports = {
  entry: getEntries(),
  externals: defaultConfig.externals,
  output: {
    filename: '[name].js',
    path: path.resolve(defaultConfig.output.path, 'enhancers'),
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: defaultConfig.module,
  plugins: defaultConfig.plugins
};
