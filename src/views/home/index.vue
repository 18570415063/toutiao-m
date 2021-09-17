<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <van-button slot="title" class="search-btn" round icon="search">
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
          <articleList :channels='item' />
      </van-tab>

       <div slot="nav-right" class="placeholder">
    </div>
    <div slot="nav-right" class="hamburger-btn">
        <i class="hb hb-gengduo"></i>
    </div>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
import articleList from './article-list.vue'
import { getChannels } from '@/api/user.js'
export default {
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  components: {
    articleList
  },
  async created () {
    try {
      const { data: { data: { channels } } } = await getChannels()
      this.channels = channels
      console.log(this.channels)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    padding-bottom: 100px;
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
