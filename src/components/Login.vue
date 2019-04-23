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
    <Wrapper
      :pose="(isPhoneNumber && !isSend) ? 'visible' : 'hidden'"
      v-if="(isPhoneNumber && !isSend)"
      class="wrapper"
    >
      <button @click="sendVerificationCode">发送验证码</button>
    </Wrapper>
    <Wrapper
      :pose="(isPhoneNumber && isSend) ? 'visible' : 'hidden'"
      v-if="(isPhoneNumber && isSend)"
      class="wrapper"
    >
      <button @click="login">登陆</button>
    </Wrapper>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'
import posed from 'vue-pose'

@Component({
  components: {
    Wrapper: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 0 },
    }),
  },
})
export default class Login extends Vue {
  PlayerModule = PlayerModule
  phoneNumber: number | null = null
  verificationCode: string | null = null
  isSend: boolean = false
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
      this.$http.get(`/captch/verify?phone=${this.phoneNumber}&captcha=${this.verificationCode}`)
    } catch (error) {
      this.$message('验证码不正确')
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
