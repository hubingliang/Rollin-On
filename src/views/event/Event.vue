<template>
  <Sidebar class="color-list" :pose="isVisible ? 'visible' : 'hidden'">
    <Item class="color" v-for="(event, index) in events" :key="index">
      <section class="user">
        <img :src="event.user.avatarUrl">
        <section class="details">
          <p>{{ event.nickname }}</p>
        </section>
      </section>
      <article>{{ contentHandle(event.json) }}</article>
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
    }),
  },
})
export default class Layout extends Vue {
  isVisible: boolean = false
  PlayerModule = PlayerModule
  events: any[] = []
  created() {
    // this.getEvent()
  }
  contentHandle(json: string) {
    const a = JSON.parse(json)
    console.log(a)
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