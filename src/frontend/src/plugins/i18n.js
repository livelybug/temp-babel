import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import store from '#/store/index';

let i18n = undefined;

export default ({ app, Vue }) => {

  Vue.use(VueI18n)
  // Set i18n instance on app
  app.i18n = new VueI18n({

    locale: store.state.language,
    fallbackLocale: 'zh-hans',
    messages,
  })

  i18n = app.i18n;
}

export {i18n};
