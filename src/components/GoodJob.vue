<template>
  <van-button
    :icon="value <= 0 ? 'good-job-o' : 'good-job'"
    :class="{ active: value === 1 }"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/collect'
export default {
  name: 'like',
  props: {
    value: {
      type: Number,
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
    async onLike () {
      this.loading = true
      try {
        if (this.value === 1) {
          await deleteLike(this.isId)

          this.$emit('input', -1)
        } else {
          await addLike(this.isId)

          this.$emit('input', 1)
        }
      } catch (err) {
        this.$toast('操作失败,请稍后重试')
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  .van-icon {
    color: #ffa500;
  }
}
</style>
