<template>
  <section class="singer">
    <Box class="box" :pose="isFullscreen ? 'fullscreen' : 'thumbnail'" v-on:click.native="close">
      <section v-if="isFullscreen && singerData" class="wrapper">
        <section class="singer-detail">
          <img v-lazy="singerData.artist.img1v1Url">
          <section class="name">
            <p>{{ singerData.artist.name }}</p>
            <span v-if="singerData.artist.alias">{{ singerData.artist.alias[0] }}</span>
          </section>
        </section>
        <section class="songs"></section>
        <section class="albums">
          <Item class="album" v-for="(album,index) in albumData" :key="index">
            <img v-lazy="album.blurPicUrl">
            <p>{{ album.name }}</p>
            <span>{{ timeHandle(album.publishTime, 'YYYY-MM-DD') }}</span>
          </Item>
        </section>
      </section>
    </Box>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import posed from 'vue-pose'
import { PlayerModule } from '@/store/modules/player'

@Component({
  components: {
    Box: posed.div({
      fullscreen: {
        width: '145.5vh',
        height: '90vh',
        transition: { duration: 400 },
        flip: true,
      },
      thumbnail: {
        width: 1,
        height: 1,
        transition: { duration: 500 },
        flip: true,
      },
    }),
    Item: posed.div({
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
export default class Singer extends Vue {
  @Prop() singerId!: number
  isFullscreen: boolean = false
  PlayerModule = PlayerModule
  singerData: any = null
  albumData: any = null
  mounted() {
    this.isFullscreen = true
    PlayerModule.changeState({ key: 'fontColor', value: '#ffffff' })
    this.$nextTick(() => {
      this.getSingerData()
      this.getAlbumData()
    })
  }
  close() {
    this.isFullscreen = false
    const themeColor = localStorage.getItem('themeColor') as string
    PlayerModule.initThemeColor(JSON.parse(themeColor))
    setTimeout(() => {
      const layout = document.getElementById('layout') as HTMLElement
      layout.removeChild(this.$el)
    }, 500)
  }
  async getSingerData() {
    try {
      const { data } = await this.$http.get(`/artists?id=${this.singerId}`)
      this.singerData = data
      console.log(data)
    } catch (error) {
      this.$message('获取歌手详情失败')
    }
  }
  async getAlbumData() {
    try {
      const { data } = await this.$http.get(`/artist/album?id=${this.singerId}`)
      console.log(data)
      this.albumData = data.hotAlbums
    } catch (e) {
      this.$message('error')
    }
  }
}
</script>

<style lang="less" scoped>
.singer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .box {
    border-radius: 10px;
    background: #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333;
    .wrapper {
      display: flex;
      justify-content: center;
      width: 145.5vh;
      height: calc(90vh - 120px);
      padding: 0 20px;
      flex-direction: column;
      position: relative;
      .singer-detail {
        width: 100%;
        height: 28vh;
        background: #333;
        display: flex;
        img {
          width: 28vh;
          height: 28vh;
        }
        .name {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          p {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }
        }
      }
      .songs {
        flex: 1;
        background: #ffffff;
      }
      .albums {
        position: absolute;
        width: 110vh;
        height: 30vh;
        top: 14vh;
        left: 32vh;
        display: flex;
        align-items: center;
        overflow-x: scroll;
        .album {
          color: #2c3e50;
          margin-right: 10px;
          padding-left: 10px;
          img {
            width: 18vh;
            height: 18vh;
            border-radius: 14px;
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
            cursor: pointer;
          }
          p {
            margin-top: 10px;
            width: 18vh;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
          }
          span {
            width: 18vh;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>
