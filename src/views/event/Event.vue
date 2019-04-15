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
      <pre>{{ jsonHandle(event.json).msg }}</pre>
      <section class="img-wrapper" v-if="event.pics.length">
        <img v-lazy="item.pcSquareUrl" v-for="(item, index) in event.pics" v-bind:key="index">
      </section>
      <video v-if="jsonHandle(event.json).video" :poster="jsonHandle(event.json).video.coverUrl"></video>
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
  created() {
    this.getEvent()
  }
  mounted() {
    setTimeout(() => {
      this.isVisible = true
    }, 0)
  }
  jsonHandle(jsonString: string) {
    const json = JSON.parse(jsonString)
    console.log(json)
    return json
  }
  async getEvent() {
    try {
      const { data } = await this.$http.get(`/event`)
      this.events = data.event
    } catch (e) {
      alert(e)
    }
  }
}
</script>

<style lang="less" scoped>
.event-wrapper {
  height: 74vh;
  width: 560px;
  overflow: scroll;
  background: #ffffff;
  margin-left: 40px;
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
          color: #616770;
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
    video {
      margin-left: 50px;
      margin-top: 10px;
      width: 365px;
      height: 200px;
    }
  }
}
</style>
