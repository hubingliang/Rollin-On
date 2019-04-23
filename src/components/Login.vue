<template>
  <section class="login">
    <input type="text" :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,}">
  </section>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'

@Component
export default class Login extends Vue {
  PlayerModule = PlayerModule
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
}
</style>
