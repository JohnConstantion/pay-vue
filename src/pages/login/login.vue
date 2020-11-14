<template>
  <view>
    <button @tap="login" open-type="getUserInfo"></button>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    login: function () {
      // 这里获取Vue里prototype定义的全局数据
      let that = this;
      uni.login({
        success: resp => {
          // 获取微信登陆临时凭证
          let code = resp.code;
          //获取用户信息
          uni.getUserInfo({
            success: resp => {
              let nickname = resp.userInfo.nickName;
              let avatarUrl = resp.userInfo.avatarUrl;
              // 提交微信登陆发出请求
              uni.request({
                url: that.url.wxLogin,
                method: "POST",
                data: {
                  "code": code,
                  "nickname": nickname,
                  "photo": avatarUrl
                },
                success: resp => {
                  let token = resp.data.token;
                  let expire = resp.data.expire;
                  // 存入到小程序的缓存里
                  uni.setStorageSync("token", token)
                  uni.setStorageSync("expire", expire)
                  uni.switchTab({
                    url: "../index/index",
                  })
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
