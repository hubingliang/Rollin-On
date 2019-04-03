<template>
  <section class="app-wrapper" ref="layout">
    <player></player>
    <router-view />
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Player from '@/views/player/Player.vue'
import { keyframes, easing, styler } from 'popmotion'

@Component({
  components: {
    Player,
  },
})
export default class Layout extends Vue {
  mounted() {
    this.initLayout()
  }
  initLayout() {
    const layout: any = styler(this.$refs.layout as HTMLElement)
    keyframes({
      values: ['#FF1C68', '#14D790', '#198FE3', '#FF1C68'],
      duration: 10000,
      ease: easing.linear,
      loop: Infinity,
    }).start(layout.set('background'))
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  background: #eb3349; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #f45c43, #eb3349); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #f45c43, #eb3349); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  width: 145.5vh;
  height: 90vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
}
</style>
