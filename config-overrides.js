const { override, fixBabelImports, addLessLoader } = require('customize-cra')
module.exports = override(
    // 针对antd实现按需打包
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    // 使用less-loader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),
);