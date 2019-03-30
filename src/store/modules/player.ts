import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import { axios } from '@/lib/axios'
import store from '@/store'

export interface ISong {
  id: string
  name: string
  url: string
  albumUrl: string
}

export interface IPlayer {
  song: ISong
}

const defaultState = {
  id: 0,
  username: '',
  email: '',
  realName: '',
  mobile: '',
  status: '',
  authorities: [],
  roles: [],
  appModules: [],
}

@Module({ dynamic: true, store, name: 'player' })
class Player extends VuexModule implements IPlayer {
  song = {
    id: '',
    name: '',
    url: '',
    albumUrl: 'https://i.loli.net/2019/03/29/5c9cfd4e76a24.jpg',
  }

  @Mutation
  updatePlayer(song: ISong) {
    this.song = Object.assign({}, song)
  }
}

export const PlayerModule = getModule(Player)
