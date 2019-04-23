<template>
  <section>
    <h1
      class="theme-color"
      @click="isVisible = !isVisible"
    >{{ PlayerModule.backgroundName }} Rollin' On</h1>
    <Sidebar class="color-list" :pose="isVisible ? 'visible' : 'hidden'">
      <Item class="color" v-for="(themeColor, index) in themeColorList" :key="index">
        <p
          @click="
            PlayerModule.initThemeColor(themeColor)
            isVisible = false
          "
        >{{ themeColor.name }}</p>
      </Item>
    </Sidebar>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { PlayerModule } from '@/store/modules/player'
import posed from 'vue-pose'

interface IThemeColor {
  background: string
  name: string
  type: string
}

@Component({
  components: {
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
export default class Theme extends Vue {
  isVisible: boolean = false
  PlayerModule = PlayerModule
  themeColorList: IThemeColor[] = [
    { background: 'linear-gradient(to bottom, #f7bb97, #dd5e89)', name: 'V a p o r w a v e', type: 'dark' },
    { background: 'linear-gradient(to bottom, #F45C43, #EB3349)', name: 'Cherry', type: 'dark' },
    { background: 'linear-gradient(to bottom, #71B280, #134E5E)', name: 'Moss', type: 'dark' },
    { background: 'linear-gradient(to bottom, #414345, #232526)', name: 'Midnight City', type: 'dark' },
    { background: 'linear-gradient(to bottom, #93EDC7, #1CD8D2)', name: 'Sea Blizz', type: 'light' },
    { background: 'linear-gradient(to bottom, #FFFFFF, #ECE9E6)', name: 'Clouds', type: 'light' },
    { background: 'linear-gradient(to bottom, #F3A183, #EC6F66)', name: 'Bourbon', type: 'dark' },
    { background: 'linear-gradient(to top, #ee9ca7, #ffdde1)', name: 'Piggy Pink', type: 'light' },
    { background: '#3db6e3', name: 'Zima Blue', type: 'light' },
  ]
  created() {
    this.getThemeColor()
  }
  getThemeColor() {
    const themeColor = localStorage.getItem('themeColor') as string
    if (themeColor) {
      PlayerModule.initThemeColor(JSON.parse(themeColor))
    } else {
      PlayerModule.initThemeColor({ background: 'linear-gradient(to bottom, #FFFFFF, #ECE9E6)', name: 'Clouds', type: 'light' })
    }
  }
}
</script>

<style lang="less" scoped>
.theme-color {
  user-select: none;
  position: absolute;
  left: 20px;
  top: 20px;
  font-weight: bold;
  font-size: 16px;
}
.color-list {
  user-select: none;
  position: absolute;
  left: 20px;
  top: 44px;
  .color {
    margin-bottom: 4px;
  }
}
</style>
