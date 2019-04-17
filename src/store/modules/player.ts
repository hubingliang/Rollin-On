import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPlayerState {
  song: any
  isPlay: boolean
  playList: any[]
  songIndex: number
  color: string
  background: string
  backgroundName: string
  fontColor: string
}

export interface IData {
  key: string
  value: any
}

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayerState {
  [index: string]: any
  song = null
  isPlay = false
  playList = []
  songIndex = 0
  color = ''
  background = ''
  backgroundName = ''
  fontColor = ''

  @Mutation
  changeState(payload: IData | IData[]) {
    if (Object.prototype.toString.call(payload) === '[object Array]') {
      (payload as IData[]).map((_: IData) => {
        this[_.key] = _.value
      })
    } else {
      this[(payload as IData).key] = (payload as IData).value
    }
  }

  @Mutation
  initThemeColor(themeColor: any) {
    this.background = themeColor.background
    this.backgroundName = themeColor.name
    localStorage.setItem('themeColor', JSON.stringify(themeColor))
    if (themeColor.type === 'dark') {
      this.fontColor = '#ffffff'
    } else {
      this.fontColor = '#2c3e50'
    }
  }
}

export const PlayerModule = getModule(Player)
