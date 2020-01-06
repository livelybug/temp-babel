import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import uuidv3 from 'uuid/v3';
import {baseUrl} from '../util/env';

// import example from './module-example'
import showcase from './showcase'

Vue.use(Vuex)

const state = {
  userJwt: {},
  hubJwt: {},
  userInfo: {},
  ErrDev: [],
  Permision: {},
  WebSocket: null,
  language:'zh-hans'
}

const mutations = {
  saveUserToken (state, jwtDetails) {
    state.userJwt = jwtDetails
  },
  saveHubToken (state, jwtDetails) {
    state.hubJwt = jwtDetails
  },
  saveAdminInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  saveErrDev (state, errDev) { // 存放添加工单的故障设备
    state.ErrDev = errDev
  },
  setPermision (state, permision) {  // 设置权限
    state.Permision = permision
  },
  setWebSocket (state, websocket) {  // 存放websocket
    state.WebSocket = websocket
  },
  saveLanguage(state,language){   //存放语言
    state.Language = language
  },

  getBrowserLanguage(state,browserLanguage){
    this.language = navigator.language.toLowerCase()
  
  }

}

const actions = {
  saveAdminInfo ({commit}) {
    commit('saveAdminInfo')
  },
  saveLanguage ({commit}){
    commit('saveLanguage')
  }
}

const getters = {
  getToken: state => state.userJwt.token,
  getHubToken: state => state.hubJwt.token,
  getUserInfo: state => state.userInfo
}


const vuexUuid = uuidv3(baseUrl, uuidv3.URL);
const Store = new Vuex.Store({
  plugins: [createPersistedState({key:vuexUuid})],
  state,
  actions,
  mutations,
  getters,
  modules: {
    showcase
  }
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./showcase'], () => {
    const newShowcase = require('./showcase').default
    Store.hotUpdate({ modules: { showcase: newShowcase } })
  })
}

export default Store;
export {vuexUuid};
/*
export default function () {
  const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state,
    actions,
    mutations,
    getters,
    modules: {
      showcase
    }
  });

  module.hot.accept(['./showcase'], () => {
    const newShowcase = require('./showcase').default
    store.hotUpdate({ modules: { showcase: newShowcase } })
  })

  return store
}
*/

/*
/!*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 *!/

export default function (/!* { ssrContext } *!/) {
  const Store = new Vuex.Store({
    modules: {
      example
    }
  })

  return Store
}
*/
