<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <van-icon slot="left" @click="$router.back()" name="arrow-left" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="articles.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articles.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articles.aut_photo"
          />
          <div slot="title" class="user-name">{{ articles.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articles.pubdate | relativeTime }}
          </div>
          <Follow
            :articles="articles"
            @updateIsFollowed="articles.is_followed = $event"
            class="follow-btn"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          ref="articleImg"
          v-html="articles.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" info="123" color="#777" />
          <CollectArticle
            v-model="articles.is_collected"
            :isId="articles.art_id"
          />
          <GoodJob v-model="articles.attitude"  :isId="articles.art_id" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import { ImagePreview } from 'vant'
import Follow from '@/components/Follow_user'
import CollectArticle from '@/components/collect-article'
import GoodJob from '@/components/GoodJob'
export default {
  name: 'ArticleIndex',
  components: {
    Follow,
    CollectArticle,
    GoodJob
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      articles: {},
      loading: false,
      errStatus: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        // 随机错误
        // if (Math.random() > 0.2) {
        //   JSON.parse("sdasgdhdfgsds");
        // }
        // 根据当前文章的id发请求 获取当前文章详情
        const { data } = await getArticle(this.articleId)
        this.articles = data.data
        this.loading = false

        // dom更新是异步的
        // setTimeout(() => {
        //   this.Preview();
        // }, 0);
        // 延迟更新回调
        await this.$nextTick()
        // 调用预览图片方法
        this.Preview()
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
          console.log(err)
        }
      }
      this.loading = false
    },
    Preview () {
      const articleimg = this.$refs.articleImg
      // 1、页面渲染完成从文章内容中获取到所有的 img DOM 节点
      const img = articleimg.querySelectorAll('img')

      const images = []

      img.forEach((item, index) => {
        // 2、获取文章内容中所有的图片地址
        images.push(item.src)
        // 3、遍历所有 img 节点，给每个节点注册点击事件
        item.onclick = () => {
          // 4、在 img 点击事件处理函数中，调用 ImagePreview 预览
          ImagePreview({
            // 预览的图片的路径数组
            images,
            // 预览图片的起始位置
            startPosition: index
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  /deep/ .page-nav-bar {
    .van-icon {
      color: #fff;
    }
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
   /deep/ .van-button__icon{
        font-size: 45px;
    }
  }
}
</style>
