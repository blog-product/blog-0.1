import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

service.interceptors.response.use(
  (response) => {
    const { data, status, msg } = response
    if (status === 200) {
      return Promise.resolve(data)
    } else {
      console.log('服务端错误')
      return Promise.reject(new Error(msg || 'Error'))
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('token 过期')
          router.replace({
            path: '/login'
          })
      }
      return Promise.reject(error.response.data) // 返回接口返回的错误信息
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
