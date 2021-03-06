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
          <img v-lazy="song.al.picUrl" @click="updatePlayer(song, index)">
          <section class="details">
            <p class="name">{{ song.name }}</p>
            <span class="author">
              <span
                v-for="(item, index) in song.ar"
                :key="index"
                @click="$singer(item.id)"
              >{{ item.name }}</span>
            </span>
          </section>
          <svg
            class="icon"
            aria-hidden="true"
            :style="{ fill: PlayerModule.fontColor }"
            @click="unCollect(song.id)"
            v-if="$route.params.playListId"
          >
            <use xlink:href="#icon-delete"></use>
          </svg>
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
  updatePlayer(song: any, index: number) {
    PlayerModule.changeState([
      { key: 'song', value: song },
      { key: 'songIndex', value: index },
      { key: 'playList', value: this.playList },
    ])
    this.$nextTick(() => {
      this.audio.play()
      this.PlayerModule.changeState({ key: 'isPlay', value: true })
    })
  }
  async getPlayList() {
    try {
      if (this.$route.params.playListId) {
        const { data } = await this.$http.get(
          `/playlist/detail?id=${this.$route.params.playListId}&timestamp=${new Date().getTime()}`
        )
        this.name = data.playlist.name
        this.playList = data.playlist.tracks.map((_: any) => {
          _.isDiscShow = false
          return _
        })
      } else {
        const { data } = await this.$http.get(`/recommend/songs?timestamp=${new Date().getTime()}`)
        this.name = data.name
        this.playList = data.recommend.map((_: any) => {
          _.al = _.album
          _.ar = _.artists
          _.isDiscShow = false
          return _
        })
      }
    } catch (e) {
      this.$message()
    } finally {
      this.isVisible = true
    }
  }
  async unCollect(songId: number) {
    try {
      const { data } = await this.$http.get(`/playlist/tracks?op=del&pid=${this.$route.params.playListId}&tracks=${songId}`)
      await this.getPlayList()
    } catch (e) {
      this.$message(e)
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
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
          user-select: none;
          cursor: pointer;
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
            cursor: pointer;
            margin-right: 5px;
          }
        }
        .icon {
          width: 25px;
          height: 25px;
          margin-right: 20px;
          padding: 5px;
        }
        .icon:hover {
          border-radius: 50%;
          visibility: visible;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        }
      }
    }
  }
}
</style>
