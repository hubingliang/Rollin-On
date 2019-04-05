<template>
  <div class="pen">
    <div class="carousel">
      <Item class="item">
        <section @click="toListDetail('daily-recommendation')">
          <div :style="{ background: PlayerModule.color }">
            <span>{{ new Date().getDate() }}</span>
          </div>
          <p>日推</p>
        </section>
      </Item>
      <Item class="item" v-for="item in playList" v-bind:key="item.id">
        <section @click="toListDetail(item.id)">
          <img v-lazy="item.coverImgUrl" />
          <p>{{ item.name }}</p>
        </section>
      </Item>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { styler, decay, listen, pointer, value, transform } from 'popmotion'
import { clamp } from '@popmotion/popcorn'
import posed from 'vue-pose'
import { PlayerModule } from '@/store/modules/player'

@Component({
  components: {
    Item: posed.div({
      hoverable: true,
      init: {
        scale: 1,
      },
      hover: {
        scale: 1.1,
      },
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }),
    Sidebar: posed.div({
      visible: {
        x: 0,
        beforeChildren: true,
        staggerChildren: 30,
      },
      hidden: {
        // x: '100%',
        afterChildren: true,
      },
    }),
  },
})
export default class App extends Vue {
  PlayerModule = PlayerModule
  playList: any[] = []
  mounted() {
    this.getPlayList()
    // this.init()
  }
  init() {
    const slider: any = document.querySelector('.carousel')
    const divStyler: any = styler(slider)
    const sliderX: any = value(0, divStyler.set('x'))

    listen(slider, 'mousedown touchstart').start((e: any) => {
      // console.log(e)
      pointer({ x: sliderX.get() })
        .pipe(({ x }: any) => clamp(-(this.playList.length * 255), 0, x))
        .start(sliderX)
    })

    listen(document, 'mouseup touchend').start((e: any) => {
      decay({
        from: sliderX.get(),
        // velocity: sliderX.getVelocity(),
        // power: 0.8,
        // timeConstant: 1400,
        // restDelta: 0.5,
        // modifyTarget: (v: any) => Math.round(v / 100) * 100,
      }).start(sliderX)
      // .while((v) => v > 600)
    })
  }
  async getPlayList() {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') as string)
      const { data } = await this.$http.get(`/user/playlist?uid=${user.id}`)
      this.playList = data.playlist
    } catch (e) {
      alert(e)
    }
  }
  toListDetail(id: string) {
    if (id === 'daily-recommendation') {
      this.$router.push({ name: 'ListDetail' })
    } else {
      this.$router.push({ name: 'ListDetail', params: { playListId: `${id}` } })
    }
  }
}
</script>

<style lang="less" scoped>
.pen {
  width: 44%;
  max-width: 600px;
  padding: 0 20px;
  margin-left: 40px;
}
.carousel {
  display: flex;
  height: 38vh;
  overflow: scroll;
  padding: 60px 20px;
  user-select: none;
  .item {
    background: #ffffff;
    border-radius: 5px;
    margin-right: 20px;
    flex: 0 0 30vh;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    user-select: none;
    div {
      width: 30vh;
      border-radius: 5px 5px 0 0;
      height: 30vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #333;
      span {
        font-size: 80px;
        color: #ffffff;
      }
    }
    img {
      width: 30vh;
      height: 30vh;
      border-radius: 5px 5px 0 0;
    }
    p {
      padding: 10px;
      width: calc(30vh - 20px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      color: #2c3e50;
    }
  }
}
</style>
