const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  lintOnSave: false,
  publicPath: '/',
  chainWebpack: (config) => {
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('pages', resolve('./src/pages'))
      .set('network', resolve('./src/network'))
    //注意 store 和 router 没必要配置
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  // devServer: {
  //   proxy: {
  //     '/sys': {
  //       target: '', //域名
  //       ws: true,
  //       changOrigin: true,
  //       pathRewrite: {
  //         '^/sys': '/',
  //       },
  //     },
  //   },
  // },
}
