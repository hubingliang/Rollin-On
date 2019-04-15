import _Vue from 'vue'
import dayjs from 'dayjs'

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

function timeHandle(value: number, formatType: string = 'M月DD日 HH:mm'): string {
  if (!value) {
    return '-'
  }
  try {
    return dayjs(value).format(formatType)
  } catch (error) {
    console.error(error)
    return '-'
  }
}

export default {
  install(Vue: typeof _Vue, options = {}) {
    Vue.mixin({
      methods: {
        artistHandle,
        timeHandle,
      },
    })
  },
}
