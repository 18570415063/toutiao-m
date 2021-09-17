<template>
  <div class="my-container">
    <!-- 用户登录成功后显示的状态 -->
    <div class="header user-info" v-if="user">
      <div class="base">
        <div class="top">
          <div class="head">
            <van-image
              fit="cover"
              :src="UserInfo.photo"
              class="head_portrait"
              round
            />
            <span class="text">{{UserInfo.name}}</span>
          </div>
          <div class="btn">
            <van-button round size="mini">编辑头像</van-button>
          </div>
        </div>
        <div class="data">
          <div class="data-item">
            <span>{{UserInfo.art_count}}</span>
            <span>头条</span>
          </div>
          <div class="data-item">
            <span>{{UserInfo.follow_count}}</span>
            <span>关注</span>
          </div>
          <div class="data-item">
            <span>{{UserInfo.fans_count}}</span>
            <span>粉丝</span>
          </div>
          <div class="data-item">
            <span>{{UserInfo.like_count}}</span>
            <span>获赞</span>
          </div>
        </div>
      </div>
    </div>
    <!-- /用户登录成功后显示的状态 -->

    <!-- 用户未登录显示的状态 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img src="~@/assets/mobile.png" alt="" />
        <span>登录 / 注册</span>
      </div>
    </div>
    <!--/ 用户未登录显示状态 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="hb hb-shoucang" />
        <span slot="text">收藏</span>
      </van-grid-item>

      <van-grid-item class="grid-item">
        <i slot="icon" class="hb hb-lishi" />
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 单元格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      @click="onLogOut"
      title="退出登录"
      center
      clickable
    />
    <!-- /单元格导航 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      UserInfo: {} // 用户信息
    }
  },
  methods: {
    // 退出登录事件处理
    onLogOut () {
      // 用于确认消息，包含取消和确认按钮。
      // 需要通过this.$(方法名称)来调用组件方法
      this.$dialog
        .confirm({
          title: '确认退出'
        })
        .then(() => {
          // 点击确认时执行
          // 提交vuex中的setUser事件 将state中的user(token)制空 同时将本地存储的token制空
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 点击取消时执行
        })
    }
  },
  async created () {
    if (this.user) {
      try {
        const { data } = await getUserInfo()
        this.UserInfo = data.data
        console.log(this.UserInfo)
      } catch (err) {
        console.log('获取用户信息失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .top {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .head {
        color: #fff;
        display: flex;
        align-items: center;
        .head_portrait {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
        }
        .text {
          font-size: 29px;
          margin-left: 22px;
        }
      }
    }
    .data {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        span:nth-child(1) {
          font-size: 36px;
          margin-bottom: 15px;
        }
        span:nth-child(2) {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.hb {
        font-size: 45px;
      }
      .hb-shoucang {
        color: #eb5253;
      }
      .hb-lishi {
        color: #ff9d1d;
      }
      span {
        font-size: 28px ;
      }
    }
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
