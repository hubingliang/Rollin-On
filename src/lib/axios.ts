import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'query-string'
import _Vue from 'vue'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 60000,
  paramsSerializer: (params) => {
    return qs.stringify(params)
  },
  withCredentials: true,
})

const requestInterceptor = (config: AxiosRequestConfig) => {
  return config
}
const responseInterceptor = (response: AxiosResponse) => {
  return response
}

instance.interceptors.request.use(requestInterceptor)
instance.interceptors.response.use(responseInterceptor)

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $http: AxiosInstance
  }
  // tslint:disable-next-line:interface-name
  interface VueConstructor<V extends Vue> {
    http: AxiosInstance
  }
}

export default {
  install(Vue: typeof _Vue, options?: any) {
    Vue.http = instance
    Vue.prototype.$http = instance
  },
}
export { instance as axios }
