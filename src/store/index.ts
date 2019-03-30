import Vue from 'vue'
import Vuex from 'vuex'
import { IPlayerState } from './modules/player'

Vue.use(Vuex)

export interface IApp {
  player: IPlayerState
}

export default new Vuex.Store<IApp>({})
