<template>
  <section class="player">
    <section ref="disc" class="discBox">
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
    <section class="controler" ref="controler">
      <section class="iconBox">
        <svg class="icon" aria-hidden="true" :style="{ fill: PlayerModule.fontColor }" @click="switchLike(true)" v-if="!isLike">
          <use xlink:href="#icon-heart"></use>
        </svg>
        <svg class="icon" aria-hidden="true" :style="{ fill: PlayerModule.fontColor }" @click="switchLike(false)" v-if="isLike">
          <use xlink:href="#icon-heart-fill"></use>
        </svg>
        <svg class="icon" aria-hidden="true" :style="{ fill: PlayerModule.fontColor }">
          <use xlink:href="#icon-folder-add"></use>
        </svg>
      </section>
      <div class="progressBar" ref="progressBar" @mouseover="circleVisible = true" @mouseleave="circleVisible = false">
        <div class="complete" :style="{ width: playOut + 'px', background: color }"></div>
        <div
          :pose="circleVisible ? 'visible' : 'hidden'"
          class="circle"
          :style="{ transform: 'translateX(' + (playOut - 2) + 'px)', background: color }"
          ref="circle"
        ></div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { styler, spring, inertia, listen, pointer, value, calc } from 'popmotion'
import { PlayerModule } from '@/store/modules/player'
import posed from 'vue-pose'

@Component({
  components: {
    Box: posed.div({
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    }),
  },
})
export default class Player extends Vue {
  PlayerModule = PlayerModule
  audio: any = null
  playOut: number = 0
  ProgressBar: any = 0
  raf: any = null
  currentLocation: number = 0
  color: string = ''
  circleVisible: boolean = false
  likeListIds: number[] = []
  created() {
    this.color = PlayerModule.color
    this.getLikeList()
  }
  mounted() {
    this.audio = this.$refs.audio
    this.ProgressBar = this.$refs.progressBar
    this.initDisc()
    this.initProgressBar()
    this.updateProgress()
  }
  get isLike() {
    if (PlayerModule.song) {
      const song = PlayerModule.song as any
      const matched = this.likeListIds.filter((_: any) => {
        return _ === song.id
      })
      if (matched.length > 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  async getLikeList() {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') as string)
      const { data } = await this.$http.get(`/likelist?uid=${user.id}`)
      this.likeListIds = data.ids
    } catch (e) {
      alert(e)
    }
  }
  updateProgress() {
    this.playOut = (this.audio.currentTime / this.audio.duration) * this.ProgressBar.offsetWidth
    this.raf = requestAnimationFrame(this.updateProgress)
  }
  nextMusic() {
    if (PlayerModule.playList[PlayerModule.songIndex + 1]) {
      PlayerModule.updatePlayer({ song: PlayerModule.playList[PlayerModule.songIndex + 1], index: PlayerModule.songIndex + 1 })
    } else {
      PlayerModule.updatePlayer({ song: PlayerModule.playList[0], index: 0 })
    }
    this.$nextTick(() => {
      this.audio.play()
      PlayerModule.switch(true)
    })
  }
  switch() {
    if (this.PlayerModule.isPlay) {
      this.audio.pause()
      this.PlayerModule.switch(false)
    } else {
      this.audio.play()
      this.PlayerModule.switch(true)
    }
  }
  initDisc() {
    const disc: any = this.$refs.disc
    const divStyler = styler(disc)
    const ballXY: any = value({ x: 0, y: 0 }, divStyler.set)
    this.audio.onended = () => this.nextMusic()
    listen(disc, 'mousedown touchstart').start((e: any) => {
      e.preventDefault()
      pointer(ballXY.get()).start(ballXY)
    })

    listen(document, 'mouseup touchend').start(() => {
      const endX = ballXY.get().x
      const endY = ballXY.get().y
      if (endX > 100) {
        this.$router.push({ name: 'PlayList' })
      } else if (Math.abs(endX) < 100 && endX !== 0) {
        if (endY > 150) {
          this.nextMusic()
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
  initProgressBar() {
    const mix = calc.getValueFromProgress
    const boundaries = this.$refs.progressBar as HTMLElement
    const box = this.$refs.circle as HTMLElement
    const getBoundariesWidth = () => boundaries.getBoundingClientRect().width - box.getBoundingClientRect().width
    const divStyler = styler(box)
    const boxX: any = value(0, (v: any) => {
      divStyler.set('x', v)
      this.playOut = v
    })
    listen(box, 'mousedown touchstart').start(() => {
      cancelAnimationFrame(this.raf)
      const max = getBoundariesWidth()
      const tug = 0.2

      const applyOverdrag = (v: any) => {
        if (v < 0) {
          return mix(0, v, tug)
        }
        if (v > max) {
          return mix(max, v, tug)
        }
        return v
      }

      pointer({ x: this.playOut })
        .pipe(
          ({ x }: any) => x,
          applyOverdrag
        )
        .start(boxX)
    })

    listen(boundaries, 'mouseup touchend').start(() => {
      console.log(boxX.get())
      if (boxX.get() === 0 || boxX.get() === this.currentLocation) {
        return
      } else if (boxX.get() < 0) {
        this.audio.currentTime = 0
        inertia({
          min: 0,
          max: getBoundariesWidth(),
          from: 0,
          // velocity: boxX.getVelocity(),
          power: 0.6,
          bounceDamping: 20,
        }).start(boxX)
      } else if (boxX.get() >= getBoundariesWidth()) {
        this.audio.currentTime = this.audio.duration
        inertia({
          min: 0,
          max: getBoundariesWidth(),
          from: getBoundariesWidth(),
          // velocity: boxX.getVelocity(),
          power: 0.6,
          bounceDamping: 20,
        }).start(boxX)
      } else {
        this.audio.currentTime = (boxX.get() / getBoundariesWidth()) * this.audio.duration
        inertia({
          min: 0,
          max: getBoundariesWidth(),
          from: boxX.get(),
          // velocity: boxX.getVelocity(),
          power: 0.6,
          bounceDamping: 20,
        }).start(boxX)
      }
      this.currentLocation = boxX.get()
      requestAnimationFrame(this.updateProgress)
    })
  }
  async switchLike(like: boolean) {
    try {
      if (PlayerModule.song) {
        const song = PlayerModule.song as any
        await this.$http.get(`/like?id=${song.id}&like=${like}`)
        this.getLikeList()
      } else {
        alert('当前没有播放歌曲')
      }
    } catch (e) {
      alert(e)
    }
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
  .controler {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
    .iconBox {
      width: 60%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      .icon {
        fill: #ffffff;
        width: 25px;
        height: 25px;
      }
    }
    .progressBar {
      display: flex;
      align-items: center;
      height: 5px;
      position: relative;
      background: #ffffff;
      width: 80%;
      border-radius: 5px;
      position: relative;
      .complete {
        position: absolute;
        left: 0;
        width: 100px;
        background: #6dc1f9;
        height: 5px;
        border-radius: 5px;
      }
      .circle {
        background: #6dc1f9;
        border-radius: 50%;
        margin-right: 15px;
        width: 15px;
        height: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      }
    }
  }
}
</style>
