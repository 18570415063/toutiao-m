import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'
Vue.use(Vuex)
const TOKEN_KEY = 'USER_TOKEN'
export default new Vuex.Store({
  state: {
    // 储存本地存储中的当前用户信息(token)
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      // 本地储存用户登录成功后获取的数据中的token
      // window.localStorage.setItem(TOKEN_KEY,JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
