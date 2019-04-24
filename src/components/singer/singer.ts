import Singer from './Singer.vue'

const singer: any = {}

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    $singer: any
  }
  // tslint:disable-next-line:interface-name
  interface VueConstructor<V extends Vue> {
    singer: any
  }
}

singer.install = (Vue: any) => {
  const singerCreator = Vue.extend(Singer)
  let singerBox: any = null
  const initInstance = () => {
    // 实例化vue实例
    singerBox = new singerCreator()
    const singerEl = singerBox.$mount().$el
  }
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$singer = (id: number) => {
    initInstance()
    singerBox.singerId = id
  }
  Vue.singer = (id: number) => {
    initInstance()
    singerBox.singerId = id
  }
}

export default singer
