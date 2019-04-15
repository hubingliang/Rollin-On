<template>
  <Sidebar class="event-wrapper" :pose="isVisible ? 'visible' : 'hidden'">
    <Item class="event" v-for="(event, index) in events" :key="index">
      <section class="user">
        <img v-lazy="event.user.avatarUrl">
        <section class="details">
          <p>{{ event.user.nickname }}</p>
          <span>{{ timeHandle(event.eventTime) }}</span>
        </section>
      </section>
      <pre>{{ event.content.msg }}</pre>
      <section class="song" v-if="event.content.song" @click="updatePlayer(event.content.song)">
        <img v-lazy="event.content.song.album.img80x80">
        <section class="detail">
          <p>{{ event.content.song.name }}</p>
          <span>{{ artistHandle(event.content.song.artists) }}</span>
        </section>
      </section>
      <section class="img-wrapper" v-if="!event.currentImg">
        <img
          v-lazy="item.pcSquareUrl"
          v-for="(item, index) in event.pics"
          v-bind:key="index"
          @click="event.currentImg = item.originUrl"
        >
      </section>
      <img
        :src="event.currentImg"
        v-if="event.currentImg"
        class="current-img"
        @click="event.currentImg = null"
      >
      <section class="video" v-if="event.content.video">
        <img v-lazy="jsonHandle(event.json).video.coverUrl" v-if="!event.currentVideo">
        <video :src="event.currentVideo" v-if="event.currentVideo" autoplay controls></video>
        <svg
          class="icon"
          aria-hidden="true"
          @click="getVideo(jsonHandle(event.json).video.videoId, event)"
          v-if="!event.currentVideo"
        >
          <use xlink:href="#icon-play"></use>
        </svg>
      </section>
    </Item>
  </Sidebar>
</template>



<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'
import posed from 'vue-pose'

@Component({
  components: {
    Sidebar: posed.div({
      visible: {
        x: 0,
        beforeChildren: true,
        staggerChildren: 30,
      },
      hidden: {
        afterChildren: true,
      },
    }),
    Item: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }),
  },
})
export default class Layout extends Vue {
  isVisible: boolean = false
  PlayerModule = PlayerModule
  events: any[] = []
  currentImg: string | null = null
  audio: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement

  created() {
    this.getEvent()
  }
  mounted() {
    setTimeout(() => {
      this.isVisible = true
    }, 0)
    this.audio = document.getElementById('audio') as HTMLAudioElement
  }
  jsonHandle(jsonString: string) {
    const json = JSON.parse(jsonString)
    return json
  }
  async getVideo(videoId: string, event: any) {
    try {
      const { data } = await this.$http.get(`/video/url?id=${videoId}`)
      event.currentVideo = data.urls[0].url
    } catch (e) {
      this.$message('error')
    }
  }
  async getEvent() {
    try {
      const { data } = await this.$http.get(`/event`)
      data.event.map((_: any) => {
        _.currentImg = null
        _.currentVideo = null
        _.content = this.jsonHandle(_.json)
        return _
      })
      this.events = data.event
    } catch (e) {
      alert(e)
    }
  }
  updatePlayer(song: any) {
    song.al = {
      picUrl: song.album.picUrl,
    }
    song.ar = [{ name: song.artists[0].name }]
    song.isDiscShow = false
    PlayerModule.updatePlayer(song)
    this.$nextTick(() => {
      this.audio.play()
      PlayerModule.switch(true)
    })
  }
}
</script>

<style lang="less" scoped>
.event-wrapper {
  height: 74vh;
  width: 560px;
  overflow: scroll;
  background: #ffffff;
  margin-left: 100px;
  color: #616770;
  .event {
    padding: 20px;
    border-bottom: 1px solid rgb(229, 229, 229);
    .user {
      display: flex;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        p {
          color: #365899;
          font-size: 15px;
        }
        span {
          font-size: 13px;
        }
      }
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      margin-top: 6px;
      margin-left: 50px;
      font-size: 15px;
      width: 470px;
      color: rgb(44, 62, 80);
    }
    .song {
      display: flex;
      width: 470px;
      height: 60px;
      margin-left: 50px;
      margin-top: 10px;
      background: #616770;
      align-items: center;
      color: #ffffff;
      padding-left: 5px;
      img {
        width: 50px;
        height: 50px;
      }
      .detail {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        p {
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .song:hover {
      background: #365899;
    }
    .img-wrapper {
      display: flex;
      flex-wrap: wrap;
      max-width: 315px;
      max-height: 315px;
      margin-left: 50px;
      margin-top: 10px;
      img {
        width: 100px;
        height: 100px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
    .current-img {
      margin-left: 50px;
      margin-top: 10px;
      max-width: 315px;
    }
    .video {
      margin-left: 50px;
      margin-top: 10px;
      width: 365px;
      height: 200px;
      position: relative;
      video {
        width: 365px;
        height: 200px;
        outline: none;
      }
      img {
        width: 365px;
        height: 200px;
        border-radius: 12px;
      }
      .icon {
        width: 40px;
        height: 40px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        fill: #ffffff;
      }
    }
  }
}
</style>
