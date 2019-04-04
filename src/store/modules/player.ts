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

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayerState {
  song = null
  isPlay = false
  playList = []
  songIndex = 0
  color = ''
  background = ''
  backgroundName = ''
  fontColor = ''
  @Mutation
  updatePlayer(song: any) {
    this.song = song.song
    this.songIndex = song.index
  }

  @Mutation
  switch(newStatus: boolean) {
    this.isPlay = newStatus
  }

  @Mutation
  initColor(color: string) {
    this.color = color
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

  @Mutation
  updatePlayList(playList: any) {
    this.playList = playList
  }
}

export const PlayerModule = getModule(Player)
