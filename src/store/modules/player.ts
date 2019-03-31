import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPlayer {
  song: any
}

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayer {
  song = null
  isPlay = false
  playList = []
  @Mutation
  updatePlayer(song: any) {
    this.song = Object.assign({}, song)
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
