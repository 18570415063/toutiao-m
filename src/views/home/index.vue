<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button slot="title" class="search-btn" round icon="search" to="/search">
        搜索
      </van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
      通过 animated 属性可以开启切换标签内容时的转场动画。
      通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <articleList :channels="item" />
      </van-tab>

      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right"
      class="hamburger-btn"
      @click="show = true">
        <i class="hb hb-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <van-popup

      v-model="show"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
    <Popup :Mychannels = channels :active = active  @updataActive='updataFn' ></Popup>
    </van-popup>
  </div>
</template>

<script>
import Popup from '@/components/Popup.vue'
import articleList from './article-list.vue'
import { getChannels } from '@/api/user.js'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  data () {
    return {
      active: 0,
      channels: [],
      show: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    articleList,
    Popup
  },
  async created () {
    // 用户登录状态下展示线上即请求返回的数据  未登录状态下展示本地存储中的数据
    try {
      const { data: { data: { channels } } } = await getChannels()
      this.channels = this.user ? channels : getItem('TOUTIAO_CHANNELS')
      console.log(this.channels)
    } catch (err) {
      this.$toast('获取失败，请稍后重试')
      console.log(err)
    }
  },
  methods: {
    updataFn (index, show = true) {
      this.active = index
      this.show = show
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
  padding-top: 174px;
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    color: #fff;
    .van-icon {
      font-size: 32px;
      color: #fff;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.hb {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
