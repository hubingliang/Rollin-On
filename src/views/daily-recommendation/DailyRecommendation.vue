<template>
  <Sidebar class="sidebar" :pose="isVisible ? 'visible' : 'hidden'">
    <Item>
      <h2>每日推荐</h2>
    </Item>
    <Item class="item" v-for="song in dailyList" v-bind:key="song.id">
      <img class="disc" src="@/assets/disc-plus.png" :class="{ show: song.isDiscShow, hidden: !song.isDiscShow }" />
      <section class="song" @mouseover="song.isDiscShow = true" @mouseleave="song.isDiscShow = false" @click="updatePlayer(song)">
        <img :src="song.album.picUrl" />
        <section class="details">
          <p class="name">{{ song.name }}</p>
          <span class="author">{{ song.artists[0].name }}</span>
        </section>
      </section>
    </Item>
  </Sidebar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import posed from 'vue-pose'
import { PlayerModule } from '@/store/modules/player'

@Component({
  components: {
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
    Item: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }),
  },
})
export default class App extends Vue {
  isDiscShow: boolean = false
  isVisible: boolean = false
  items: number[] = [0, 1, 2, 3, 4]
  dailyList: any[] = []
  PlayerModule = PlayerModule
  created() {
    this.getDailyList()
  }
  mounted() {
    setTimeout(() => {
      this.isVisible = !this.isVisible
    }, 500)
  }
  updatePlayer(song: any) {
    PlayerModule.updatePlayer(song)
  }
  async getDailyList() {
    const { data } = await this.$http.get('/recommend/songs')
    this.dailyList = data.recommend.map((_: any) => {
      _.isDiscShow = false
      return _
    })
  }
}
</script>

<style lang="less" scoped>
@keyframes showRecord {
  0% {
    left: 0;
  }
  100% {
    left: -15px;
  }
}
@keyframes hiddenRecord {
  0% {
    left: -15px;
  }
  100% {
    left: 0;
  }
}
.sidebar {
  // background: #54e365;
  height: 70vh;
  padding: 20px;
  overflow: scroll;
}
h2 {
  color: white;
  margin-bottom: 20px;
}
.item {
  border-radius: 5px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  position: relative;
  .disc {
    position: absolute;
    left: -15px;
    width: 80px;
    height: 80px;
  }
  .show {
    animation: showRecord 0.5s;
    animation-fill-mode: forwards;
  }
  .hidden {
    animation: hiddenRecord 0.5s;
    animation-fill-mode: forwards;
  }
  .song {
    color: #ffffff;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    img {
      width: 80px;
      height: 80px;
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
    .details {
      margin-left: 20px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        font-weight: bold;
        width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      span {
        width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
