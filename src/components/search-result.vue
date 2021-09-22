<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync= error
      error-text="加载数据失败，请稍后重试"
    >
      <van-cell
      v-for="(item,index) in list" :key="index"
      :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1.获取请求数据
        const { data: { data: { results } } } = await getSearchResult({
          page: this.page,
          per_page: 20,
          q: this.searchText
        })
        // 随机错误 检测error是否生效
        // if(Math.random() > 0.5){
        //     JSON.parse('sdasdasfsdg')
        // }

        // 2.将数据存放到list数组中
        this.list.push(...results)
        console.log(this.list)
        // 3.将loading关闭
        this.loading = false
        // 4.判断数据是否加载完毕
        if (results.length) {
          this.page++ // 展示下一页数据
        } else {
          this.finished = true // 表示数据加载完毕
        }
      } catch (err) {
        this.loading = false
        // 展示加载失败后的状态
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
