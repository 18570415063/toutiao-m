<template>
  <van-button
   @click="onCollected"
   :icon="isCollected ? 'star' : 'star-o' "
   :class="{active : isCollected}"
   :loading="loading" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/collect'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'update-collected'
  },
  props: {
    isCollected: {
      type: Boolean,
      require: true
    },
    isId: {
      type: [Number, String, Object],
      require: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    onCollected () {
      this.loading = true
      try {
        this.isCollected ? deleteCollect(this.isId) : addCollect(this.isId)
      } catch (err) {
        this.$toast('收藏文章失败,请稍后重试')
        console.log(err)
      }
      this.loading = false
      this.$emit('update-collected', !this.isCollected)
    }
  }
}
</script>

<style lang="less" scoped>
.active {
    .van-icon{
        color:#ffa500
    }
}
</style>
