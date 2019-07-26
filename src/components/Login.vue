<template>
  <section class="login">
    <input
      type="text"
      :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,}"
      placeholder="mobile number"
      v-model.number="phoneNumber"
    />
    <input
      type="text"
      :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,}"
      placeholder="password"
      v-model="password"
      class="input"
    />
    <section class="wrapper">
      <button @click="login">Login</button>
    </section>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'
import { UserModule } from '@/store/modules/user'

@Component
export default class Login extends Vue {
  PlayerModule = PlayerModule
  UserModule = UserModule
  phoneNumber: number | null = null
  password: string | null = null
  created() {
    this.getUserData()
  }
  async login() {
    try {
      await this.$http.get(`/login/cellphone?phone=${this.phoneNumber}&password=${this.password}`)
      this.getUserData()
    } catch (error) {
      this.$message('password is wrong')
    }
  }
  async getUserData() {
    try {
      const { data } = await this.$http.get(`/login/status?timestamp=${new Date().getTime()}`)
      this.UserModule.changeState([
        {
          key: 'id',
          value: data.profile.userId,
        },
        {
          key: 'avatar',
          value: data.profile.avatarUrl,
        },
        {
          key: 'name',
          value: data.profile.nickname,
        },
        {
          key: 'isLogin',
          value: true,
        },
      ])
      const user = {
        id: data.profile.userId,
        avatar: data.profile.avatarUrl,
        name: data.profile.nickname,
      }
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      this.$message('需要登录')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: space-around;
  padding: 4vh 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
  input {
    border: none;
    outline: none;
    background: none;
    padding: 10px;
    height: 10px;
    border: none;
    font-size: 16px;
    width: 140px;
    text-align: center;
  }
  .input {
    margin: 20px 0;
  }
  .wrapper {
    margin-top: 20px;
    button {
      border: none;
      border-radius: 300px;
      color: #000;
      font-size: 18px;
      letter-spacing: -0.2px;
      cursor: pointer;
      padding: 10px 30px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
