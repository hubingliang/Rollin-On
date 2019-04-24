<template>
  <section class="controler" ref="controler">
    <section class="iconBox">
      <svg
        class="icon"
        aria-hidden="true"
        :style="{ fill: PlayerModule.fontColor }"
        @click="switchLike(true)"
        v-if="!isLike"
      >
        <use xlink:href="#icon-heart"></use>
      </svg>
      <svg
        class="icon"
        aria-hidden="true"
        :style="{ fill: PlayerModule.fontColor }"
        @click="switchLike(false)"
        v-if="isLike"
      >
        <use xlink:href="#icon-heart-fill"></use>
      </svg>
      <svg
        class="icon"
        aria-hidden="true"
        :style="{ fill: PlayerModule.fontColor }"
        @click="showCollect()"
      >
        <use xlink:href="#icon-folder-add"></use>
      </svg>
    </section>
    <div class="progressBar" ref="progressBar">
      <div class="complete" :style="{ width: playOut + 'px', background: PlayerModule.color }"></div>
      <div
        class="circle"
        :style="{
                        transform: 'translateX(' + (playOut - 2) + 'px)',
                        background: PlayerModule.color,
                    }"
        ref="circle"
      ></div>
    </div>
    <Collect :collectVisible="collectVisible" @hiddenCollect="hiddenCollect"></Collect>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { styler, inertia, listen, pointer, value, calc } from 'popmotion'
import { PlayerModule } from '@/store/modules/player'
import posed, { PoseTransition } from 'vue-pose'
import Collect from './Collect.vue'

@Component({
  components: {
    Collect,
    PoseTransition,
    Shade: posed.div({
      enter: {
        opacity: 1,
        beforeChildren: true,
        transition: { duration: 200, ease: 'linear' },
      },
      exit: {
        opacity: 0,
        afterChildren: true,
        transition: { duration: 200, ease: 'linear' },
      },
    }),
    Modal: posed.div({
      enter: { opacity: 1, z: 0 },
      exit: { opacity: 0, z: -150 },
    }),
    Controler: posed.div({
      enter: {
        opacity: 1,
        beforeChildren: true,
        transition: { duration: 200, ease: 'linear' },
      },
      exit: {
        opacity: 0,
        afterChildren: true,
        transition: { duration: 200, ease: 'linear' },
      },
    }),
  },
})
export default class Player extends Vue {
  PlayerModule = PlayerModule
  audio: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement
  playOut: number = 0
  ProgressBar: any = 0
  raf: any = null
  currentLocation: number = 0
  collectVisible: boolean = false
  likeListIds: number[] = []
  moving: boolean = false
  mounted() {
    this.ProgressBar = this.$refs.progressBar
    this.getLikeList()
    this.audio = document.getElementById('audio') as HTMLAudioElement
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
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user') as string)
        const { data } = await this.$http.get(`/likelist?uid=${user.id}`)
        this.likeListIds = data.ids
      }
    } catch (e) {
      this.$message()
    }
  }
  updateProgress() {
    this.playOut = (this.audio.currentTime / this.audio.duration) * this.ProgressBar.offsetWidth
    this.raf = requestAnimationFrame(this.updateProgress)
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
  showCollect() {
    const song = PlayerModule.song as any
    if (song && song.id) {
      this.collectVisible = true
    }
  }
  hiddenCollect() {
    this.collectVisible = false
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
        this.$message('当前没有播放歌曲')
      }
    } catch (e) {
      this.$message()
    }
  }
}
</script>

<style lang="less" scoped>
.controler {
  display: flex;
  justify-content: space-around;
  padding: 4vh 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
  .iconBox {
    width: 60%;
    display: flex;
    justify-content: space-around;
    margin-bottom: 4vh;
    .icon {
      fill: #ffffff;
      width: 25px;
      height: 25px;
      padding: 5px;
      cursor: pointer;
    }
    .icon:hover {
      border-radius: 50%;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
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
      cursor: pointer;
    }
  }
}
</style>
