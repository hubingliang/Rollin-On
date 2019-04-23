<template>
  <div id="app" :style="{ color: PlayerModule.fontColor }">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { PlayerModule } from '@/store/modules/player'

@Component
export default class App extends Vue {
  UserModule = UserModule
  PlayerModule = PlayerModule
  async created() {
    this.userInit()
  }
  userInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') as string)
      this.UserModule.changeState([
        {
          key: 'id',
          value: user.id,
        },
        {
          key: 'avatar',
          value: user.avatarUrl,
        },
        {
          key: 'background',
          value: user.backgroundUrl,
        },
        {
          key: 'name',
          value: user.nickname,
        },
        {
          key: 'signature',
          value: user.signature,
        },
        {
          key: 'isLogin',
          value: true,
        },
      ])
    }
  }
  async login() {
    try {
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user') as string)
        this.UserModule.changeState([
          {
            key: 'id',
            value: user.id,
          },
          {
            key: 'avatar',
            value: user.avatarUrl,
          },
          {
            key: 'background',
            value: user.backgroundUrl,
          },
          {
            key: 'name',
            value: user.nickname,
          },
          {
            key: 'signature',
            value: user.signature,
          },
          {
            key: 'isLogin',
            value: true,
          },
        ])
      } else {
        const { data } = await this.$http.get('/login/cellphone?phone=15620688207&password=aqgy3602')
        const user = {
          id: data.account.id,
          avatar: data.profile.avatarUrl,
          background: data.profile.backgroundUrl,
          name: data.profile.nickname,
          signature: data.profile.signature,
        }
        this.UserModule.changeState([
          {
            key: 'id',
            value: data.account.id,
          },
          {
            key: 'avatar',
            value: data.profile.avatarUrl,
          },
          {
            key: 'background',
            value: data.profile.backgroundUrl,
          },
          {
            key: 'name',
            value: data.profile.nickname,
          },
          {
            key: 'signature',
            value: data.profile.signature,
          },
          {
            key: 'isLogin',
            value: true,
          },
        ])
        localStorage.setItem('user', JSON.stringify(user))
      }
    } catch (e) {
      this.$router.push({ name: 'Home' })
    }
  }
  async refreshLogin() {
    const { data } = await this.$http.get('/login/refresh')
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
