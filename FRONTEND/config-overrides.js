const { override, fixBabelImports, addLessLoader } = require('customize-cra');

const { antdOverrides } = require('./antd-overrides');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { ...antdOverrides },
    },
  })
);
