import _Vue from 'vue'

function artistHandle(artists: any[]): string {
  if (artists.length === 1) {
    return artists[0].name
  }
  return artists
    .reduce((names: string, _: any) => {
      return names + `/${_.name}`
    }, '')
    .substring(1)
}

export default {
  install(Vue: typeof _Vue, options = {}) {
    Vue.mixin({
      methods: {
        artistHandle,
      },
    })
  },
}
