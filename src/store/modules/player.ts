import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPlayer {
  song: any
}

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayer {
  song = null
  isPlay = false
  @Mutation
  updatePlayer(song: any) {
    this.song = Object.assign({}, song)
  }

  @Mutation
  switch(newStatus: boolean) {
    this.isPlay = newStatus
  }
}

export const PlayerModule = getModule(Player)
