// 封装 请求 axios模块
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import jsonBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/', // 基准地址
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})
// 请求拦截器、响应拦截器以及接口请求中的错误处理
// 请求拦截器
request.interceptors.request.use(config => {
  // 为请求添加headers 并携带token
  if (!config.refresh_token) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }

  return config // 请求拦截器成功时返回值
}, err => {
  return Promise.reject(err) // 请求错误时通过该方法返回配置信息
})

// 响应拦截器
request.interceptors.response.use(res => {
  return res // 响应成功时return返回的数据
}, async err => {
  if (err.response && err.response.status === 401) { // 判断响应状态码是否为401
    // 获取vuex中的 token,refresh_token数据
    const { user } = store.state
    if (!user || !user.refresh_token) {
      // 如果token不存在 则跳转到登录页面要用户重新登录
      router.push({
        path: '/login'
      })
      return
    }
    try {
      // 调用更新token的接口 拿到最新的token
      const { data } = await request({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        },
        refresh_token: true
        // 告诉请求拦截器，这一次是刷新token
      })
      console.log(data.data.token)
      //  更新vuex和loaclStoreage存储的token
      store.commit('setUser', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })
    } catch (err) {
      // 调用接口失败 用户重新登录
      router.push({
        path: '/login'
      })
      return
    }
    // 用最新的token调用展示用户信息的接口 解决token过期问题
    // err.config就是调用接口时的配置信息
    return request(err.config)
  }

  return Promise.reject(err) // 响应错误时返回错误信息
})
export default request
