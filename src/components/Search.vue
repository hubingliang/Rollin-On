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
          @blur="isSuggestVisible = false"
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
        <SearchValue @click.native="getSongDetails(song.id)">
          <p>{{ song.name }} - {{ song.artists[0].name }}</p>
        </SearchValue>
      </Item>
    </Sidebar>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
        x: '140%',
        afterChildren: true,
      },
    }),
    Item: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 0 },
    }),
    Input: posed.div({
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: '140%' },
    }),
    SearchValue: posed.p({
      hoverable: true,
      init: {
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
      hover: {
        boxShadow: '0px 5px 10px rgba(0,0,0,0.2)',
      },
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
    PlayerModule.updatePlayer(song)
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
      width: 140px;
    }
  }
  .suggest {
    position: absolute;
    right: 30px;
    top: 40px;
    user-select: none;
    background: #ffffff;
    color: #333;
    min-width: 140px;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    padding: 10px;
    p {
      width: 100%;
      margin-bottom: 4px;
      padding: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
