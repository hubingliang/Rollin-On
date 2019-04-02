import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPlayerState {
  song: any
  isPlay: boolean
  playList: any[]
  songIndex: number
}

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayerState {
  song = null
  isPlay = false
  playList = []
  songIndex = 0
  
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
  updatePlayList(playList: any) {
    this.playList = playList
  }
}

export const PlayerModule = getModule(Player)
