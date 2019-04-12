<template>
  <Sidebar class="sidebar" :pose="isVisible ? 'visible' : 'hidden'">
    <Item class="title">
      <h1>{{ name ? name : '日推' }}</h1>
    </Item>
    <section class="wrapper">
      <Item class="item" v-for="(song, index) in playList" v-bind:key="song.id">
        <img
          class="disc"
          src="@/assets/disc-plus.png"
          :class="{ show: song.isDiscShow, hidden: !song.isDiscShow }"
        >
        <section
          class="song"
          @mouseover="song.isDiscShow = true"
          @mouseleave="song.isDiscShow = false"
        >
          <img v-lazy="song.al.picUrl" @click="updatePlayer({ song: song, index: index })">
          <section class="details">
            <p class="name">{{ song.name }}</p>
            <span class="author">{{ song.ar[0].name }}</span>
          </section>
        </section>
      </Item>
    </section>
  </Sidebar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
export default class DailyRecommendation extends Vue {
  isVisible: boolean = false
  playList: any[] = []
  PlayerModule = PlayerModule
  name: string = ''
  audio: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement
  created() {
    this.getPlayList()
  }
  mounted() {
    this.audio = document.getElementById('audio') as HTMLAudioElement
  }
  updatePlayer(song: any) {
    PlayerModule.updatePlayer(song)
    PlayerModule.updatePlayList(this.playList)
    this.$nextTick(() => {
      this.audio.play()
      PlayerModule.switch(true)
    })
  }
  async getPlayList() {
    try {
      if (this.$route.params.playListId) {
        const { data } = await this.$http.get(`/playlist/detail?id=${this.$route.params.playListId}`)
        this.name = data.playlist.name
        this.playList = data.playlist.tracks.map((_: any) => {
          _.isDiscShow = false
          return _
        })
      } else {
        const { data } = await this.$http.get('/recommend/songs')
        this.name = data.name
        this.playList = data.recommend.map((_: any) => {
          _.al = {
            picUrl: _.album.picUrl,
          }
          _.ar = [{ name: _.artists[0].name }]
          _.isDiscShow = false
          return _
        })
      }
    } catch (e) {
      alert(e)
    } finally {
      this.isVisible = !this.isVisible
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes showRecord {
  0% {
    left: 0;
    display: none;
  }
  100% {
    display: block;
    left: -15px;
  }
}
@keyframes hiddenRecord {
  0% {
    left: -15px;
    display: block;
  }
  100% {
    display: none;
    left: 0;
  }
}
.sidebar {
  // background: #54e365;
  margin-left: 100px;
  height: 74vh;
  .title {
    padding-left: 24px;
    margin-bottom: 20px;
    max-width: 340px;
  }
  .wrapper {
    overflow-x: scroll;
    margin-top: 10px;
    height: calc(100% - 60px);
    padding-left: 24px;
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
        user-select: none;
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
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        img {
          width: 80px;
          height: 80px;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
          // box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
          user-select: none;
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
  }
}
</style>
