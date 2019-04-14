<template>
  <Sidebar class="wrapper" :pose="isVisible ? 'visible' : 'hidden'">
    <Item>
      <p>{{ message }}</p>
    </Item>
  </Sidebar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import posed from 'vue-pose'
import { setTimeout } from 'timers'

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
  },
})
export default class Notification extends Vue {
  @Prop() message!: string
  isVisible: boolean = false
  mounted() {
    setTimeout(() => {
      this.isVisible = true
    }, 0)
    setTimeout(() => {
      this.isVisible = false
    }, 2000)
  }
}
</script>


<style lang="less" scoped>
.wrapper {
  position: fixed;
  right: 20px;
  top: 20px;
  background: #ffffff;
}
</style>
