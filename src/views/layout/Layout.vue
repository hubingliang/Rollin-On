<template>
  <section class="app-wrapper" ref="layout" :style="{ background: PlayerModule.background }">
    <player></player>
    <router-view/>
    <search></search>
    <Theme></Theme>
    <a href="https://github.com/hubingliang/Rollin-On" target="_blank">
      <svg class="github" aria-hidden="true" :style="{ fill: PlayerModule.fontColor }">
        <use xlink:href="#icon-github"></use>
      </svg>
    </a>
    <p
      class="song-name"
    >{{ PlayerModule.song?PlayerModule.song.name + ' - ' + artistHandle(PlayerModule.song.ar): '' }}</p>
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Player from '@/views/player/Player.vue'
import Search from '@/components/Search.vue'
import Theme from '@/components/Theme.vue'
import { PlayerModule } from '@/store/modules/player'
import posed from 'vue-pose'
import getColor from '365color/dist'

@Component({
  components: {
    Player,
    Search,
    Theme,
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
    Item: posed.div({
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 20 },
    }),
  },
})
export default class Layout extends Vue {
  PlayerModule = PlayerModule
  created() {
    PlayerModule.changeState({ key: 'color', value: getColor() })
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  width: 145.5vh;
  height: 90vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  .song-name {
    position: absolute;
    bottom: 20px;
    left: 20px;
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    font-weight: bold;
  }
  .github {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 25px;
    height: 25px;
  }
}
</style>
