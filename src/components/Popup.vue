<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button
        size="mini"
        class="btn"
        round
        type="danger"
        plain
        @click="isShow = !isShow"
        >{{ isShow ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(item, index) in Mychannels"
        :key="item.id"
        @click="Onchannels(item, index)"
      >
        <van-icon
          name="close"
          slot="icon"
          v-show="isShow && !flex.includes(item.id)"
        />

        <span slot="text" class="text" :class="{ active: active === index }">
          {{ item.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <van-cell
      class="recommend-grid"
      title="频道推荐"
      :border="false"
    ></van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(item, index) in remondChannels"
        :key="index"
        :text="item.name"
        icon="plus"
        @click="onAddChannels(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, PostChannels, DeleteChannels } from '@/api/channels.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    Mychannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true

    }
  },
  data () {
    return {
      channels: [], // 推荐列表
      isShow: false, // 是否为编辑状态 默认为 不是
      flex: [0] // 我的列表中的默认项 不允许删除
    }
  },
  computed: {
    // 推荐频道列表 去除 我的频道 中有的重复数据 我的频道 少一项 则 推荐列表 多一个项
    // 计算属性 会自动检测 依赖值的变化 如果发生变化则重新计算
    remondChannels () {
      return this.channels.filter((item) => {
        return !this.Mychannels.find((obj) => {
          return obj.id === item.id
        })
      })
    },
    ...mapState(['user'])
  },
  watch: {},
  async created () {
    // 获取所有频道列表项的数据
    try {
      const { data: { data: { channels } } } = await getAllChannels()
      this.channels = channels
    } catch (err) {
      this.$toast('获取列表失败')
      console.log(err)
    }
  },
  mounted () {},
  methods: {
    // 我的频道 编辑状态与删除状态
    Onchannels (item, index) {
      if (this.isShow) {
        // 删除状态下
        if (this.flex.includes(item.id)) { // 如果默认列表项被触发了 则退出
          return
        }
        this.Mychannels.splice(index, 1) // 删除
        if (index <= this.active) { // 保证删除选中项之后的项不会影响选择项的选择状态
        // 子向父传  将父组件中的 选中项变量 减一 且 不允许关闭弹出层
          this.$emit('updataActive', this.active - 1, true)
        }
        this.deleteChannel(item.id)
      } else {
        // 子向父传 让当前点击的频道选项被选中 必须前往列表详情页展示该选项内容
        this.$emit('updataActive', index, false)
      }
    },
    // 添加我的频道项
    async onAddChannels (channels) {
      this.Mychannels.push(channels)
      // 持久化添加
      // 登录状态 发起请求 增加列表项 防止刷新重置
      if (this.user) {
        try {
          await PostChannels({
            id: channels.id, // 频道id
            // 顺序序号
            seq: this.Mychannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
          console.log(err)
        }
      } else {
        // 未登录  将频道列表项存到本地
        setItem('TOUTIAO_CHANNELS', this.Mychannels)
      }
    },
    // 持久化删除
    async deleteChannel (id) {
      try {
        if (this.user) {
          await DeleteChannels(id)
        } else {
          setItem('TOUTIAO_CHANNELS', this.Mychannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 86px 0;
  .btn {
    width: 104px;
    height: 48px;
  }
  /deep/ .channel-item {
    height: 86px;
    width: 160px;
    .van-grid-item__content {
      background-color: #f5f5f6;
      flex-direction: row;
      padding: 0.42667rem 0.10333rem;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 20px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }

  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 36px;
    color: #ccc;
  }
}
</style>
