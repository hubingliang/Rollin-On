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
        :src="PlayerModule.song ? PlayerModule.song.al.picUrl : 'https://source.unsplash.com/random/260x260'"
      >
      <audio
        ref="audio"
        id="audio"
        :src="PlayerModule.song ? `https://music.163.com/song/media/outer/url?id=${PlayerModule.song.id}.mp3` : ''"
      ></audio>
    </section>
    <Login v-if="!UserModule.isLogin"></Login>
    <Controler v-if="UserModule.isLogin"></Controler>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { styler, spring, listen, pointer, value } from 'popmotion'
import { PlayerModule } from '@/store/modules/player'
import { UserModule } from '@/store/modules/user'
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
  UserModule = UserModule
  audio: any = null
  moving: boolean = false
  fmSongs: any[] = []
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
      console.log(PlayerModule.songIndex)
      if (PlayerModule.songIndex === 2) {
        this.getPersonalFm()
      } else {
        PlayerModule.changeState([
          { key: 'songIndex', value: PlayerModule.songIndex + 1 },
          { key: 'song', value: this.fmSongs[PlayerModule.songIndex + 1] },
        ])
        this.$nextTick(() => {
          this.audio.play()
          PlayerModule.changeState({ key: 'isPlay', value: true })
        })
      }
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
    } else if (this.PlayerModule.song) {
      this.audio.play()
      this.PlayerModule.changeState({ key: 'isPlay', value: true })
    } else {
      this.$message('当前没有歌曲播放')
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

      spring({
        from: ballXY.get(),
        velocity: ballXY.getVelocity(),
        to: { x: 0, y: 0 },
        stiffness: 200,
        // mass: 1,
        // damping: 10
      }).start(ballXY)
      if (!UserModule.isLogin) {
        return
      }
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
          // this.$router.push({ name: 'Event' })
          this.getPersonalFm()
          this.waitMoving()
        } else {
          this.$router.push({ name: 'Home' })
          this.waitMoving()
        }
      }
    })
  }
  async getPersonalFm() {
    try {
      const { data } = await this.$http.get(`/personal_fm?timestamp=${new Date().getTime()}`)
      this.fmSongs = data.data.map((_: any) => {
        _.al = _.album
        _.ar = _.artists
        _.isDiscShow = false
        return _
      })
      console.log(this.fmSongs)
      PlayerModule.changeState([
        { key: 'playList', value: null },
        { key: 'song', value: this.fmSongs[0] },
        { key: 'songIndex', value: 0 },
      ])
      this.$nextTick(() => {
        this.audio.play()
        PlayerModule.changeState({ key: 'isPlay', value: true })
      })
    } catch (e) {
      this.$message()
    }
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
    cursor: pointer;
    .disc_light {
      position: absolute;
      width: 48vh;
      border-radius: 50%;
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
