import _ from 'lodash'

import { css } from '../templates/styling'
import { reactIndexJs, reactIndexHtml } from '../templates/react/index'

export default (() => {
  const features = {
    React: {
      group: 'Main library',
      dependencies: configItems => ['react', 'react-dom'],
      packageJson: {
        scripts: {
          start: 'parcel src/index.html',
          'build-prod': 'parcel build src/index.html',
        },
      },
      files: configItems => {
        const isCss = _.includes(configItems, 'CSS')
        const extraImports = _.concat(
          [],
          isCss ? [`import "./styles.css"`] : []
        )

        return {
          'src/index.js': reactIndexJs(extraImports),
          'src/index.html': reactIndexHtml('index.js'),
        }
      },
    },
    Babel: {
      group: 'Transpiler',
      babel: (babelConfig, configItems) =>
        Object.assign({}, babelConfig, {
          presets: _.concat(
            [['@babel/preset-env', { modules: false }]],
            _.includes(configItems, 'React') ? '@babel/preset-react' : []
          ),
        }),
      devDependencies: configItems =>
        _.concat(
          ['babel-loader', '@babel/core', '@babel/preset-env'],
          _.includes(configItems, 'React') ? '@babel/preset-react' : null
        ),
    },
    CSS: {
      group: 'Styling',
      files: configItems => ({ 'src/styles.css': css }),
    },
  }
  const featuresNoNulls = _.mapValues(features, item => {
    if (!item.babel) {
      item.babel = _.identity
    }
    if (!item.dependencies) {
      item.dependencies = () => []
    }
    if (!item.devDependencies) {
      item.devDependencies = () => []
    }
    if (!item.packageJson) {
      item.packageJson = {}
    }
    if (!item.files) {
      item.files = () => {}
    }

    return item
  })
  return {
    features: featuresNoNulls,
    base: {
      packageJson: {
        scripts: {
          start: 'parcel watch src/index.js',
          'build-prod': 'parcel build src/index.js',
        },
      },
      devDependencies: ['parcel-bundler'],
    },
  }
})()
