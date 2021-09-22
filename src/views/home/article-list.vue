<template>
  <div class="articleList">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="isLoadingText"
      success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
         v-for="(item, index) in list" :key="index"
         :article="item"
          />

      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/Article-item'
import { getNewList } from '@/api/user.js'
export default {
  props: {
    channels: {
      type: Object,
      require: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 是否加载结束
      time: null, // 请求下一页数据的时间戳
      error: false, // 是否加载失败
      isLoading: false, // 控制下拉刷新的loding状态
      isLoadingText: '' // 下拉刷新时提示的文本内容
    }
  },
  methods: {
    // loading 控制上拉加载更多的 loading 状态
    // finished 控制数据是否加载结束
    // load 事件：当触发上拉加载更多的时候会触发调用 load 事件
    // List 初始化后会触发一次 load 事件，用于加载第一屏的数据
    // 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成

    // 当触发上拉加载更多的时候调用该函数
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getNewList({
          channel_id: this.channels.id, // 频道 id
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          timestamp: this.time || Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })
        // 随机错误 触发错误加载事件
        // if(Math.random() > 0.5){
        //     JSON.parse('sdsadasdasfdsgdh')
        // }

        console.log(data)
        // 获取请求数据中的新闻列表数据
        const {
          data: { results }
        } = data
        // 将新闻列表数据展开并追加到list数组中进行页面渲染
        this.list.push(...results)
        console.log(this.list)
        this.loading = false
        // 数据是否加载完毕
        if (results.length) {
          // 如果数据未加载完 获取请求数据中请求下一页的时间戳
          this.time = data.data.pre_timestamp
        } else {
          // 数据加载结束
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.loading = false // 关闭 loading 效果
        this.error = true // 是否开启错误提示
      }
    },
    async onRefresh () {
      try {
        const { data } = await getNewList({
          channel_id: this.channels.id, // 频道 id
          // 时间戳，下拉刷新 传入最新时间戳
          timestamp: Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })
        //  随机错误 触发错误加载事件
        // if(Math.random() > 0.5){
        //     JSON.parse('sdsadasdasfdsgdh')
        // }
        this.isLoading = false
        const { results } = data.data

        this.list.unshift(...results) // 将最新数据放在最前面展示

        this.isLoadingText = `刷新成功,更新${results.length}条数据` // 刷新成功后提示的文本和数据数量
      } catch (err) {
        this.isLoadingText = '刷新失败'
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.articleList {
  // 1vw = 可视窗口宽度的百分之一 比如窗口宽度是750 则1vw = 7.5
  // 1vh = 可视窗口高度的百分之一 比如窗口高度是750 则1vh = 7.5
  height: 79vh;
  overflow-y: auto;
}
</style>
