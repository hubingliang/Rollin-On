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
  const initInstance = (id: number) => {
    // 实例化vue实例
    singerBox = new singerCreator()
    const singerEl = singerBox.$mount().$el
    const layout = document.getElementById('layout') as HTMLElement
    layout.appendChild(singerEl)
    singerBox.singerId = id
  }
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$singer = (id: number) => {
    initInstance(id)
  }
  Vue.singer = (id: number) => {
    initInstance(id)
  }
}

export default singer
