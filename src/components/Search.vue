<template>
  <section class="search-wrapper">
    <section class="search-box">
      <Input :pose="isInputVisible ? 'visible': 'hidden'">
        <input
          type="text"
          class="search-input"
          :style="{ borderBottom: '1px solid ' + PlayerModule.fontColor,
          color: PlayerModule.fontColor }"
          v-model="searchValue"
          @keyup="reloadSuggest"
        >
      </Input>
      <svg
        class="search"
        aria-hidden="true"
        :style="{ fill: PlayerModule.fontColor }"
        @click="isInputVisible = !isInputVisible"
      >
        <use xlink:href="#icon-search"></use>
      </svg>
    </section>
    <Sidebar class="suggest" :pose="isSuggestVisible ? 'visible': 'hidden'">
      <Item v-for="song in suggestSongList" :key="song.id">
        <p @click="getSongDetails(song.id)">{{ song.name }}</p>
      </Item>
    </Sidebar>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { keyframes, easing, styler } from 'popmotion'
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
    Input: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 0 },
    }),
  },
})
export default class Search extends Vue {
  PlayerModule = PlayerModule
  searchValue: string = ''
  isInputVisible: boolean = false
  timer: any = null
  suggestSongList: any[] = []
  isSuggestVisible: boolean = false
  reloadSuggest() {
    if (!this.searchValue) {
      this.isSuggestVisible = false
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.getSuggest()
    }, 400)
  }
  async getSuggest() {
    try {
      if (!this.searchValue) {
        this.isSuggestVisible = false
        return
      }
      const { data } = await this.$http.get(`/search/suggest?keywords=${this.searchValue}`)
      this.suggestSongList = data.result.songs
      if (this.suggestSongList && this.suggestSongList.length > 0) {
        this.isSuggestVisible = true
      }
    } catch (e) {
      alert(e)
    }
  }
  async getSongDetails(id: number) {
    try {
      const { data } = await this.$http.get(`/song/detail?ids=${id}`)
      this.updatePlayer(data.songs[0])
    } catch (e) {
      alert(e)
    }
  }
  updatePlayer(song: any) {
    const audio = document.getElementById('audio') as HTMLAudioElement
    PlayerModule.updatePlayer({ song, index: PlayerModule.songIndex })
    this.$nextTick(() => {
      audio.play()
      PlayerModule.switch(true)
    })
    this.isSuggestVisible = false
  }
}
</script>

<style lang="less" scoped>
.search-wrapper {
  position: absolute;
  right: 20px;
  top: 20px;
  .search-box {
    display: flex;
    align-items: center;
    .search {
      width: 20px;
      height: 20px;
    }
    .search-input {
      padding: 10px;
      background: none;
      height: 10px;
      border: none;
      outline: none;
      margin-right: 10px;
      font-size: 16px;
      width: 330px;
    }
  }
  .suggest {
    position: absolute;
    right: 30px;
    top: 40px;
    background: #ffffff;
    color: #333;
    width: 330px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
}
</style>
