<template>
  <section class="singer">
    <Box class="box" :pose="isFullscreen ? 'fullscreen' : 'thumbnail'">
      <section v-if="isFullscreen && singerData" class="wrapper">
        <section class="singer-detail">
          <img v-lazy="singerData.artist.img1v1Url">
          <section class="name">
            <p>{{ singerData.artist.name }}</p>
            <span v-if="singerData.artist.alias">{{ singerData.artist.alias[0] }}</span>
            <svg
              class="icon"
              aria-hidden="true"
              :style="{ fill: PlayerModule.fontColor }"
              @click="close"
            >
              <use xlink:href="#icon-close-circle"></use>
            </svg>
          </section>
        </section>
        <Sidebar class="songs">
          <Song
            v-for="(song,index) in currentSongs"
            :key="index"
            class="song"
            @click.native="updatePlayer(song)"
          >
            <img v-lazy="song.al.picUrl">
            <p>{{ song.name }}</p>
          </Song>
        </Sidebar>
        <section class="albums">
          <Item class="album" v-for="(album,index) in albumData" :key="index">
            <img v-lazy="album.blurPicUrl" @click="getAlbumSongs(album.id)">
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
    Sidebar: posed.div({
      visible: {
        x: 0,
        beforeChildren: true,
        staggerChildren: 30,
      },
      hidden: {
        x: '-120%',
        afterChildren: true,
      },
    }),
    Song: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }),
  },
})
export default class Singer extends Vue {
  @Prop() singerId!: number
  isFullscreen: boolean = false
  PlayerModule = PlayerModule
  singerData: any = null
  albumData: any = null
  currentSongs: any[] = []
  mounted() {
    this.isFullscreen = true
    PlayerModule.changeState({ key: 'fontColor', value: '#ffffff' })
    this.$nextTick(() => {
      this.getSingerData()
      this.getAllAlbum()
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
      this.currentSongs = data.hotSongs
    } catch (error) {
      this.$message('获取歌手详情失败')
    }
  }
  async getAllAlbum() {
    try {
      const { data } = await this.$http.get(`/artist/album?id=${this.singerId}`)
      this.albumData = data.hotAlbums
    } catch (e) {
      this.$message('e')
    }
  }
  async getAlbumSongs(albumId: number) {
    try {
      const { data } = await this.$http.get(`/album?id=${albumId}`)
      this.currentSongs = data.songs
    } catch (e) {
      this.$message('error')
    }
  }
  updatePlayer(song: any) {
    const audio = document.getElementById('audio') as HTMLAudioElement
    PlayerModule.changeState([{ key: 'song', value: song }, { key: 'songIndex', value: PlayerModule.songIndex }])
    this.$nextTick(() => {
      audio.play()
      this.PlayerModule.changeState({ key: 'isPlay', value: true })
    })
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
    // background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, 0.4) 0) 100% 0 no-repeat,
    //   linear-gradient(-135deg, transparent 1.5em, #333 0);
    // background-size: 2em 2em, auto;
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
        background: #ffffff;
        display: flex;
        color: #333;
        flex-direction: column;
        overflow: scroll;
        padding-top: 17vh;
        padding-left: 29vh;
        flex-wrap: wrap;
        height: 30vh;
        .song {
          display: flex;
          align-items: center;
          padding: 8px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          p {
            font-weight: normal;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .song:hover {
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
        }
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
