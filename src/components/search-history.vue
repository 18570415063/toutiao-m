<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span class="right" @click="$emit('clean')">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>

      <van-icon @click="isDeleteShow = true" v-else name="delete" />
    </van-cell>
    <van-cell
    v-for="(item, ind) in searchHistorys"
    :key="ind"
    :title="item"
    @click="deleteFn(item,ind)"
    >
      <van-icon  v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistorys: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      isDeleteShow: false,
      list: []
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {},
  methods: {
    deleteFn (item, index) {
      if (this.isDeleteShow) {
        this.searchHistorys.splice(index, 1)
      } else {
        this.$emit('event', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-history {
  .van-cell__value {
    /deep/ span.right {
      margin-right: 10px;
    }
  }
}
</style>
