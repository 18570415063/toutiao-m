// 封装 请求 axios模块
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/' // 基准地址
})
// 请求拦截器、响应拦截器以及接口请求中的错误处理
// 请求拦截器
request.interceptors.request.use(config => {
  // 为请求添加headers 并携带token
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config // 请求拦截器成功时返回值
}, err => {
  return Promise.reject(err) // 请求错误时通过该方法返回配置信息
})
// //响应拦截器
// axios.interceptors.response.use(res => {
//     return res                    //响应成功时return返回的数据
// }, err => {
//     return Promise.reject(err)    //响应错误时返回错误信息
// })
export default request
