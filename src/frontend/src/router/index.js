import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import {getAdminById} from '#/interface/getData';
import { notifyOk, notifyErr } from '#/libs/notify';
import store from '#/store/index';
import {httpStatus, pageUrls} from '#/util/env';
import {setAxios, setAxiosHub} from '#/interface/getData';
import {i18n} from '../plugins/i18n';
import {checkHttp} from '../libs/utils'
import { Quasar } from 'quasar';


Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({y: 0}),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    //mode: 'history',
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {

    /*
      Change the lang of Quasar's internal tag
     */
    const currentLang = store.state.language;
    import(`quasar-framework/i18n/${currentLang}`).then(lang => {
      Quasar.i18n.set(lang.default)
    })
    /*
      Change the lang of Quasar's internal tag
     */

    if (to.meta.check) {
      setAxios();
      setAxiosHub();
      let returnHome = () => {
        // NProgress.done()
        notifyOk(i18n.t('pleaseLogin'));
        next({path: '/' + pageUrls.login});
      }

      let check = async () => {
        try {
          const result = await getAdminById({id: store.state.userJwt.details.jti});
          
          if (result.status && checkHttp(result.status)) {
            // store.state.userInfo = result.data[0]
            store.commit('saveAdminInfo', result.data[0]);
            // store.state.Permision = Permision(result.data[0].group);
            store.state.Permision = result.data[0].group.permission
            // console.log(store.state);
            // NProgress.done()
            next()
          } else {
            returnHome()
          }
        } catch (e) {
          console.error(e);
          returnHome();
        }
      }

      check()  //后台验证session

    } else {
      next()
    }
  })

  return Router
}
