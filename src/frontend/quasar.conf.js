// Configuration for your app
const path = require('path')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'babel-polyfill',
      'i18n',
      'axios',
      'vuelidate',
      'apex'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    build: {
      env: {
        ENV_TO_RUN: JSON.stringify(process.env.ENV_TO_RUN)
        },
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg, { isServer, isClient }) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias

          // Add your own alias like this
          '#': path.resolve(__dirname, './src')
        };
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /node_modules/
        });
        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        });
      },
      transpileDependencies: [
        'vuex-persist',
        'webpack-dev-server',
        'ansi-strip'
       //  'quasar-cli',
       //  'quasar-extras',
       //  'quasar-framework',
       //  'babel-polyfill',
       //  'csvtojson',
       // 'jwt-decode',
       // 'p-iteration',
       //  'vue-i18n',
       //  'vuex',
       // 'axios',
       //  'uuid',
       //  'vuelidate',
       //  'vuex-persistedstate'

      ],
      distDir: "../main/resources/static/"
    },
    devServer: {
      // https: true,
      port: 8005,
      open: true // opens browser window automatically
    },
    // framework: 'all', //--- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QInput',
        'QCheckbox',
        'QCard', 'QCardMain','QCardActions', 'QCardTitle', 'QCardSeparator',
        'QBtnDropdown',
        'QItemSeparator', 'QModal','QUploader','QProgress','QAjaxBar',
        'QItemTile', 'QPopover', 'QActionSheet', 'QScrollArea', 'QTable', 'QTableColumns', 'QSearch', 'QSelect','QDatetime','QRadio','QTd','QChip','QCollapsible','QTr',
        'QPullToRefresh','QTooltip'
      ],
      directives: [
        'Ripple', 'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify', 'ActionSheet','Dialog'
      ],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      i18n: 'zh-hans' // Quasar language
    },
    // animations: 'all', //--- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
