<template>
  <Sidebar class="list-wrapper" :pose="isVisible ? 'visible' : 'hidden'">
    <Item class="list" v-for="(playList, index) in playLists" :key="index">
      <section @click="collect(playList.id)">
        <img v-lazy="playList.coverImgUrl">
        <p>{{ playList.name }}</p>
        <span> {{ playList.trackCount }} </span>
      </section>
    </Item>
  </Sidebar>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
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
      hoverable: true,
      init: {
        scale: 1,
      },
      hover: {
        scale: 1.1,
      },
    }),
  },
})
export default class SongList extends Vue {
  PlayerModule = PlayerModule
  playLists: any[] = []
  isVisible: boolean = false
  created() {
    this.getPlayList()
  }
  async getPlayList() {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') as string)
      const { data } = await this.$http.get(`/user/playlist?uid=${user.id}`)
      data.playlist.shift()
      this.playLists = data.playlist.filter((_: any) => {
        return _.subscribed === false
      })
      this.isVisible = true
    } catch (e) {
      alert(e)
    }
  }
  async collect(listId: number) {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') as string)
      const song = PlayerModule.song as any
      const { data } = await this.$http.get(`/playlist/tracks?op=add&pid=${listId}&tracks=${song.id}`)
      this.playLists = data.playlist
    } catch (e) {
      alert(e)
    }
  }
}
</script>

<style lang="less" scoped>
.list-wrapper {
  width: 400px;
  padding: 15px 20px;
  overflow: scroll;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .list {
    display: flex;
    height: 80px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-bottom: 15px;
    width: 370px;
    section {
      display: flex;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
      p {
        margin-left: 20px;
        font-size: 16px;
        width: 250px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
