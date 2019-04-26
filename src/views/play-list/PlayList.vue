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
          <img v-lazy="item.coverImgUrl">
          <p>{{ item.name }}</p>
        </section>
      </Item>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
  }
  async getPlayList() {
    try {
      const user = JSON.parse(localStorage.getItem('user') as string)
      const { data } = await this.$http.get(`/user/playlist?uid=${user.id}&timestamp=${new Date().getTime()}`)
      this.playList = data.playlist
    } catch (e) {
      this.$message()
    }
  }
  toListDetail(id: string) {
    if (id === 'daily-recommendation') {
      this.$router.push({ name: 'DailyRecommendation' })
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
    section {
      display: flex;
      flex-direction: column;
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
}
</style>
