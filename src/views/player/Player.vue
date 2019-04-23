<template>
  <section class="player">
    <section ref="disc" class="discBox">
      <img class="disc" src="@/assets/disc-plus.png" alt>
      <img
        class="disc_light"
        :class="{
                    play: PlayerModule.isPlay,
                    paused: !PlayerModule.isPlay,
                }"
        src="@/assets/disc_light-plus.png"
        alt
        id="disc"
      >
      <img
        class="cover"
        :class="{
                    play: PlayerModule.isPlay,
                    paused: !PlayerModule.isPlay,
                }"
        id="cover"
        :src="PlayerModule.song ? PlayerModule.song.al.picUrl : 'https://i.loli.net/2019/03/29/5c9cfd4e76a24.jpg'"
      >
      <audio
        ref="audio"
        id="audio"
        :src="PlayerModule.song ? `https://music.163.com/song/media/outer/url?id=${PlayerModule.song.id}.mp3` : ''"
      ></audio>
    </section>
    <Login></Login>
    <Controler v-if="false"></Controler>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { styler, spring, listen, pointer, value } from 'popmotion'
import { PlayerModule } from '@/store/modules/player'
import Controler from './Controler.vue'
import Login from '@/components/Login.vue'

@Component({
  components: {
    Controler,
    Login,
  },
})
export default class Player extends Vue {
  PlayerModule = PlayerModule
  audio: any = null
  moving: boolean = false
  mounted() {
    this.audio = this.$refs.audio
    this.audio.volume = 0.5
    this.initDisc()
  }
  nextMusic() {
    if (PlayerModule.playList) {
      if (PlayerModule.playList[PlayerModule.songIndex + 1]) {
        PlayerModule.changeState([
          { key: 'song', value: PlayerModule.playList[PlayerModule.songIndex + 1] },
          { key: 'songIndex', value: PlayerModule.songIndex + 1 },
        ])
      } else {
        PlayerModule.changeState([{ key: 'song', value: PlayerModule.playList[0] }, { key: 'songIndex', value: 0 }])
      }
      this.$nextTick(() => {
        this.audio.play()
        PlayerModule.changeState({ key: 'isPlay', value: true })
      })
    } else {
      return
    }
  }
  lastMusic() {
    if (PlayerModule.playList[PlayerModule.songIndex - 1]) {
      PlayerModule.changeState([
        { key: 'song', value: PlayerModule.playList[PlayerModule.songIndex - 1] },
        { key: 'songIndex', value: PlayerModule.songIndex - 1 },
      ])
    } else {
      PlayerModule.changeState([{ key: 'song', value: PlayerModule.playList[0] }, { key: 'songIndex', value: 0 }])
    }
    this.$nextTick(() => {
      this.audio.play()
      this.PlayerModule.changeState({ key: 'isPlay', value: true })
    })
  }
  switch() {
    if (this.PlayerModule.isPlay) {
      this.audio.pause()
      this.PlayerModule.changeState({ key: 'isPlay', value: false })
    } else {
      this.audio.play()
      this.PlayerModule.changeState({ key: 'isPlay', value: true })
    }
  }
  initDisc() {
    const disc: any = this.$refs.disc
    const divStyler = styler(disc)
    const ballXY: any = value({ x: 0, y: 0 }, divStyler.set)
    this.audio.onended = () => this.nextMusic()
    listen(disc, 'mousedown touchstart').start((e: any) => {
      if (this.moving) {
        return
      }
      e.preventDefault()
      pointer(ballXY.get()).start(ballXY)
    })

    listen(document, 'mouseup touchend').start(() => {
      const endX = ballXY.get().x
      const endY = ballXY.get().y
      if (endX > 100) {
        if (this.moving) {
          return
        }
        this.waitMoving()
        this.$router.push({ name: 'PlayList' })
      } else if (Math.abs(endX) < 100 && endX !== 0) {
        if (endY > 150) {
          if (this.moving) {
            return
          }
          this.waitMoving()
          this.nextMusic()
        } else if (endY < -150) {
          if (this.moving) {
            return
          }
          this.waitMoving()
          this.lastMusic()
        } else {
          if (this.moving) {
            return
          }
          this.waitMoving()
          this.switch()
        }
      } else if (endX < -100) {
        if (this.$route.name === 'Home') {
          this.$router.push({ name: 'Event' })
          this.waitMoving()
        } else {
          this.$router.push({ name: 'Home' })
          this.waitMoving()
        }
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
  waitMoving() {
    this.moving = true
    setTimeout(() => {
      this.moving = false
    }, 1000)
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
.player {
  display: flex;
  flex-direction: column;
  user-select: none;
  .discBox {
    width: 48vh;
    height: 48vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .disc_light {
      position: absolute;
      width: 48vh;
    }
    .disc {
      position: absolute;
      width: 48vh;
      height: 48vh;
    }
    .cover {
      width: 30vh;
      height: 30vh;
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
}
</style>
