const path = require('path')
const fs = require('fs')
const prettier = require('prettier')

const aliases = {
  '@': '.',
  '@views': 'src/router/views',
  '@layouts': 'src/router/layouts',
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@design': 'src/design/index.scss',
  
  '@': '.',
  '@src': 'src',
  '@router': 'src/router',
  '@views': 'src/router/views',
  '@layouts': 'src/router/layouts',
  '@routes': 'src/router/routes',
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@utils': 'src/utils',
  '@state': 'src/state',
  '@design': 'src/design/index.scss',
  
  '@sales': '.',
  '@sales-src': 'src/sales',
  '@sales-router': 'src/sales/router',
  '@sales-views': 'src/sales/router/views',
  '@sales-layouts': 'src/sales/router/layouts',
  '@sales-routes': 'src/sales/router/routes',
  '@sales-components': 'src/sales/components',
  '@sales-state': 'src/sales/state',
  
  
  '@manager': '.',
  '@manager-src': 'src/manager',
  '@manager-router': 'src/manager/router',
  '@manager-views': 'src/manager/router/views',
  '@manager-layouts': 'src/manager/router/layouts',
  '@manager-routes': 'src/manager/router/routes',
  '@manager-components': 'src/manager/components',
  '@manager-state': 'src/manager/state',
  
}

module.exports = {
  webpack: {},
  jest: {},
  jsconfig: {},
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
  const aliasHasExtension = /\.\w+$/.test(aliasTo)
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.js`
  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  module.exports.jsconfig[alias + '/*'] = [aliasTo + '/*']
  module.exports.jsconfig[alias] = aliasTo.includes('/index.')
    ? [aliasTo]
    : [
        aliasTo + '/index.js',
        aliasTo + '/index.json',
        aliasTo + '/index.vue',
        aliasTo + '/index.scss',
        aliasTo + '/index.css',
      ]
}

const jsconfigTemplate = require('./jsconfig.template') || {}
const jsconfigPath = path.resolve(__dirname, 'jsconfig.json')

fs.writeFile(
  jsconfigPath,
  prettier.format(
    JSON.stringify({
      ...jsconfigTemplate,
      compilerOptions: {
        ...(jsconfigTemplate.compilerOptions || {}),
        paths: module.exports.jsconfig,
      },
    }),
    {
      ...require('./.prettierrc'),
      parser: 'json',
    }
  ),
  (error) => {
    if (error) {
      console.error(
        'Error while creating jsconfig.json from aliases.config.js.'
      )
      throw error
    }
  }
)

function resolveSrc(_path) {
  return path.resolve(__dirname, _path)
}
