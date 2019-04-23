import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IUserState {
  id: string
  avatar: string
  background: string
  name: string
  signature: string
  isLogin: boolean
}

export interface IData {
  key: string
  value: any
}

@Module({ dynamic: true, store, name: 'User' })
class User extends VuexModule implements IUserState {
  [index: string]: any
  isLogin = false
  id = ''
  avatar = ''
  background = ''
  name = ''
  signature = ''

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
}

export const UserModule = getModule(User)
