<template>
  <div class="Search-container">
    <form action="/" class="search-from">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="result = false"
      />
    </form>

    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result :searchText="value" v-if="result" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      @search="onSearch"
      :searchText="value"
      v-else-if="value"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      @event="eventFn"
      @clean="searchHistorys = []"
      :searchHistorys="searchHistorys"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import SearchHistory from '@/components/search-history.vue'
import SearchSuggestion from '@/components/search-suggestion.vue'
import SearchResult from '@/components/search-result.vue'
export default {
  data () {
    return {
      value: '',
      result: false,
      searchHistorys: getItem('HISTORYS')
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  watch: {
    searchHistorys (val) {
      setItem('HISTORYS', val)
    }
  },
  // async created() {
  //   try {
  //     const {
  //       data: {
  //         data: { keywords },
  //       },
  //     } = await getHistory();
  //     console.log(keywords);
  //      this.searchHistorys = keywords
  //     console.log(this.searchHistorys);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  methods: {
    onSearch (val) {
      this.result = true
      this.value = val
      const index = this.searchHistorys.indexOf(val)
      if (index !== -1) {
        this.searchHistorys.splice(index, '1')
      }
      this.searchHistorys.unshift(val)

      console.log('onSearch')
    },
    eventFn (item) {
      this.onSearch(item)
    },
    onCancel () {
      this.$router.back()
      console.log('onCancel')
    }
  }
}
</script>
<style lang="less" scoped>
.Search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
