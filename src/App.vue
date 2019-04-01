<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  newChannel: string = ''
  async created() {
    this.login()
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
    sessionStorage.setItem('user', JSON.stringify(user))
  }
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
