<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    title="登录">
     <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->

    <!--
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <!-- maxlength  最大长度 -->

        <!-- 输入框左侧字体图标  使用插槽实现 -->
        <i slot="left-icon" class="hb hb-shouji"></i>
      </van-field>
      <van-field
        type="number"
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <!-- 输入框左侧字体图标 和右侧的发送验证码按钮  使用插槽实现 -->
        <i slot="left-icon" class="hb hb-yanzhengma"></i>
        <template #button>

          <van-count-down :time="1000 * 60" format="ss s" v-if="isShow" @finish="isShow = false"/>

          <van-button v-else class="send-sms-btn"
           round size="small"
            type="default"
            native-type="button"
            @click="onSendSms">
            发送验证码
            </van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      // 表单数据
      user: {
        mobile: '',
        code: '246810'
      },
      // 表单验证规则配置
      userFormRules: {
        mobile: [
          { required: true, message: '请填写用户名' },
          { pattern: /^1[3|5|8|9|7]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写用户名' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 表单提交
    async onSubmit () {
      const user = this.user
      // 简单消息提示

      // 提示：在组件中可以直接通过 this.$toast 调用
      this.$toast.loading({
        message: '登录中...', // 提示消息
        forbidClick: true, // 是否禁止背景点击
        duration: 0 //  持续时间，0表示持续展示不停止
      })

      // 提交表单请求
      try {
        const res = await login(user)

        // 结构拿到 用户token数据对象
        const { data: { data } } = res
        console.log(data)
        // 将用户token数据对象提交到vuex数据容器中储存
        this.$store.commit('setUser', data)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success('登录成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    // 点击发送验证码
    async onSendSms () {
      try {
        // 校验手机号是否合格
        this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('手机号验证失败')
      }
      // 校验成功后 显示倒计时
      this.isShow = true

      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        // 发送失败 关闭倒计时
        this.isShow = false
        if (err.response.status === 429) {
          this.$toast.fail('发送过于频繁，请稍后再试')
        } else {
          this.$toast.fail('发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.login-container {
  .hb {
    font-size: 37px;
  }
  .send-sms-btn {
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
  .van-nav-bar .van-icon{
    color:#fff
  }
}
</style>
