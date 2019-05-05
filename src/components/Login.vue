<template>
  <section class="login">
    <input
      type="text"
      :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,}"
      placeholder
      v-model.number="phoneNumber"
      v-if="!isSend"
    >
    <input
      type="text"
      :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,}"
      placeholder
      v-model.number="verificationCode"
      v-if="isSend"
    >
    <Wrapper v-if="(isPhoneNumber && !isSend)" class="wrapper">
      <button @click="sendVerificationCode">发送验证码</button>
    </Wrapper>
    <Wrapper v-if="(isPhoneNumber && isSend)" class="wrapper">
      <button @click="login">登陆</button>
    </Wrapper>
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
  verificationCode: string | null = null
  isSend: boolean = false
  created() {
    this.getUserData()
  }
  get isPhoneNumber() {
    return (
      this.phoneNumber &&
      `${this.phoneNumber}`.length === 11 &&
      Object.prototype.toString.call(this.phoneNumber) === '[object Number]'
    )
  }
  async sendVerificationCode() {
    try {
      await this.$http.get(`/captch/sent?phone=${this.phoneNumber}`)
      this.$message('发送成功')
      this.isSend = true
    } catch (error) {
      this.$message('发送失败')
    }
  }
  async login() {
    try {
      await this.$http.get(`/captch/verify?phone=${this.phoneNumber}&captcha=${this.verificationCode}`)
      this.getUserData()
    } catch (error) {
      this.$message('验证码不正确')
    }
  }
  async getUserData() {
    try {
      const { data } = await this.$http.get('/login/status')
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
