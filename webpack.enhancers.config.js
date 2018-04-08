const glob = require('glob');
const path = require('path');
const defaultConfig = require('./webpack.config');

const enhancersDir = path.resolve(__dirname, 'src/enhancers');

function getEntries() {
  const foo = glob.sync(`${enhancersDir}/*.js`);
  if (foo.length === 0) {
    return;
  }

  return foo.reduce((acc, filePath) => {
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
    path: path.resolve(defaultConfig.output.path, 'enhancers')
  },
  module: defaultConfig.module,
  plugins: defaultConfig.plugins
};
