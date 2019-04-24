<template>
  <section class="singer">
    <Box class="box" :pose="isFullscreen ? 'fullscreen' : 'thumbnail'" v-on:click.native="close">
      <p v-if="isFullscreen">{{singerId}}</p>
    </Box>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import posed from 'vue-pose'

@Component({
  components: {
    Box: posed.div({
      fullscreen: {
        width: 'calc(145.5vh - 40px)',
        height: 'calc(90vh - 40px)',
        transition: { duration: 400 },
        flip: true,
      },
      thumbnail: {
        width: 1,
        height: 1,
        transition: { duration: 500 },
        flip: true,
      },
    }),
  },
})
export default class Singer extends Vue {
  @Prop() singerId!: number
  isFullscreen: boolean = false
  mounted() {
    this.isFullscreen = true
    this.getSingerData()
  }
  close() {
    this.isFullscreen = false
    setTimeout(() => {
      const layout = document.getElementById('layout') as HTMLElement
      layout.removeChild(this.$el)
    }, 500)
  }
  async getSingerData() {
    try {
      console.log(this.singerId)
      // await this.$http.get(`/artists?id=${this.singerId}`)
    } catch (error) {}
  }
}
</script>

<style lang="less" scoped>
.singer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  p {
    width: 100px;
    height: 200px;
    background: darkblue;
  }
  .box {
    width: 100px;
    height: 100px;
    background: #54e365;
  }
}
</style>
