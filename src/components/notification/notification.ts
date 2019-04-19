import Notification from './Notification.vue'

const notifier: any = {}

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $message: any
  }
  // tslint:disable-next-line:interface-name
  interface VueConstructor<V extends Vue> {
    message: any
  }
}

notifier.install = (Vue: any) => {
  const MessageBoxInstance = Vue.extend(Notification)
  let messageBox: any = null
  const initInstance = () => {
    // 实例化vue实例
    messageBox = new MessageBoxInstance()
    const messageEl = messageBox.$mount().$el
    document.body.appendChild(messageEl)
  }
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$message = (massage: string = 'Network error') => {
    initInstance()
    messageBox.message = massage
  }
  Vue.message = (massage: string) => {
    initInstance()
    messageBox.message = massage
  }
}

export default notifier
