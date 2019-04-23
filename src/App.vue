<template>
  <div id="app" :style="{ color: PlayerModule.fontColor }">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'
import getColor from '365color/dist'

@Component
export default class App extends Vue {
  PlayerModule = PlayerModule
  newChannel: string = ''
  async created() {
    this.login()
    // this.refreshLogin()
    PlayerModule.changeState({ key: 'color', value: getColor() })
  }
  async login() {
    const { data } = await this.$http.get('/login/cellphone?phone=15620688207&password=aqgy3602')
    const user = {
      id: data.account.id,
      avatar: data.profile.avatarUrl,
      background: data.profile.backgroundUrl,
      name: data.profile.nickname,
      signature: data.profile.signature,
    }
    localStorage.setItem('user', JSON.stringify(user))
  }
  async refreshLogin() {
    const { data } = await this.$http.get('/login/refresh')
    // const user = {
    //   id: data.account.id,
    //   avatar: data.profile.avatarUrl,
    //   background: data.profile.backgroundUrl,
    //   name: data.profile.nickname,
    //   signature: data.profile.signature,
    // }
    // localStorage.setItem('user', JSON.stringify(user))
  }
}
</script>

<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
