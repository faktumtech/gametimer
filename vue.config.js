// access pkgVersion from inside vue app
// https://medium.com/hceverything/how-to-show-your-app-version-from-package-json-in-your-vue-application-11e882b97d8c
const webpack = require('webpack')
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const appVersion = JSON.parse(packageJson).version || 0

module.exports = {
  configureWebpack: {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                PACKAGE_VERSION: '"' + appVersion + '"'
            }
        })
    ]
  },
  // enable eslint standard autofix on save
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  },  
  transpileDependencies: [
    'vuetify'
  ]
}
