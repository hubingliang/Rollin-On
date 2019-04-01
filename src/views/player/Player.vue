<template>
  <section ref="disc" class="discBox" @click="change">
    <img class="disc" src="@/assets/disc-plus.png" alt="" />
    <img
      class="disc_light"
      :class="{ play: PlayerModule.isPlay, paused: !PlayerModule.isPlay }"
      src="@/assets/disc_light-plus.png"
      alt=""
      id="disc"
    />
    <img
      class="cover"
      :class="{ play: PlayerModule.isPlay, paused: !PlayerModule.isPlay }"
      id="cover"
      :src="PlayerModule.song ? PlayerModule.song.al.picUrl : 'https://i.loli.net/2019/03/29/5c9cfd4e76a24.jpg'"
    />
    <audio
      ref="audio"
      id="audio"
      :src="PlayerModule.song ? `https://music.163.com/song/media/outer/url?id=${PlayerModule.song.id}.mp3` : ''"
    ></audio>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { styler, spring, listen, pointer, value } from 'popmotion'
import { PlayerModule } from '@/store/modules/player'

@Component
export default class App extends Vue {
  play: boolean = false
  isVisible: boolean = true
  musicUrl: string = ''
  PlayerModule = PlayerModule
  change() {
    // this.play = !this.play
  }
  switch() {
    const audio: any = this.$refs.audio
    if (this.PlayerModule.isPlay) {
      audio.pause()
      this.PlayerModule.switch(false)
    } else {
      audio.play()
      this.PlayerModule.switch(true)
    }
  }
  disc() {
    const disc: any = this.$refs.disc
    const audio: any = this.$refs.audio
    const divStyler = styler(disc)
    const ballXY: any = value({ x: 0, y: 0 }, divStyler.set)
    // audio.onended = () => this.nextMusic()
    listen(disc, 'mousedown touchstart').start((e: any) => {
      e.preventDefault()
      pointer(ballXY.get()).start(ballXY)
    })

    listen(document, 'mouseup touchend').start(() => {
      const endX = ballXY.get().x
      const endY = ballXY.get().y
      if (endX > 100) {
        // if (this.$store.state.homePage) {
        //   this.$router.push(`/Album/${this.$store.state.currentListName}`)
        //   this.$store.commit('changeComponent', false)
        // } else {
        this.$router.push({ name: 'PlayList' })
        //   this.$store.commit('changeComponent', true)
        // }
      } else if (Math.abs(endX) < 100 && endX !== 0) {
        if (endY > 150) {
          // this.nextMusic()
          console.log('下一首')
        } else if (endY < -150) {
          console.log('上一首')
          // this.lastMusic()
        } else {
          console.log('播放')
          this.switch()
        }
      } else if (endX < -100) {
        this.$router.push({ name: 'home' })

        // if (this.$store.state.homePage) {
        //   this.$store.commit('changeComponent', false)
        //   this.$router.push('/Describe')
        // } else {
        //   this.$store.commit('changeComponent', true)
        //   this.$router.push('/')
        // }
      }
      spring({
        from: ballXY.get(),
        velocity: ballXY.getVelocity(),
        to: { x: 0, y: 0 },
        stiffness: 200,
        // mass: 1,
        // damping: 10
      }).start(ballXY)
    })
  }
  mounted() {
    // this.login()
    // this.ss()
    this.disc()
  }
}
</script>

<style lang="less" scoped>
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.discBox {
  width: 330px;
  height: 330px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .disc_light {
    position: absolute;
    width: 330px;
  }
  .disc {
    position: absolute;
    width: 330px;
    height: 330px;
  }
  .cover {
    width: 205px;
    height: 205px;
    position: absolute;
    border-radius: 50%;
  }
  .play {
    animation: circle 30s infinite linear;
  }
  .paused {
    animation: circle 30s infinite linear;
    animation-play-state: paused;
  }
}
</style>
