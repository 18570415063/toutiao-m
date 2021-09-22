<template>
  <van-button
    v-if="articles.is_followed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="isFollowLoading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    :loading="isFollowLoading"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/article'
export default {
  name: 'Follow',
  props: {
    articles: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      isFollowLoading: false
    }
  },
  methods: {
    onFollow () {
      this.isFollowLoading = true
      try {
        // 根据用户的是否 关注的状态 调用对应的添加或取消关注的方法
        this.articles.is_followed
          ? deleteFollow(this.articles.aut_id)
          : addFollow(this.articles.aut_id)
        // 更新视图
        this.$emit('updateIsFollowed', !this.articles.is_followed)
      } catch (err) {
        let message = '操作失败，请稍后测试'
        if (err.response && err.response.status === 400) {
          message = '不能关注自己'
        }
        this.$toast(message)
      }
      setTimeout(() => {
        this.isFollowLoading = false
      }, 100)
    }
  }
}
</script>

<style>
</style>
