<template>
  <view class="page">
    <view class="order" v-for="one of list" :key="one">
      <view class="line-1">
        <text>订单号：{{ one.code }}</text>
        <text>{{ one.status }}</text>
      </view>
      <view class="line-2">
        <text>假设这是商品的信息</text>
      </view>
      <view class="line-3">
        <text>金额：{{ one.amount }}元</text>
        <!-- type = "primary" 现实异常，之后查看原因-->
        <button class="pay-btn" type="button" v-if="one.status === '未付款'"
                @tap="pay(one.id)">付款
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "order",
  data() {
    return {
      list: []
    }
  },
  methods: {
    pay: function (id) {
      let that = this
      uni.request({
        url: that.url.microAppPayOrder,
        method: "POST",
        header: {
          "token": this.getStorageSync("token"),
        },
        data: {
          "orderId": id
        },
        success: function (resp) {
          let timeStamp = resp.data.timeStamp;
          let pk = resp.data.package;
          let nonceStr = resp.data.nonceStr;
          let paySign = resp.data.paySign;

          uni.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': pk,
            'signType': 'MD5',
            'paySign': paySign,
            'success': function (res) {
              uni.showToast({
                title: "支付成功"
              })
              uni.request({
                url: that.url.updateOrderStatus,
                method: "POST",
                header: {
                  "token": uni.getStorageSync("token"),
                },
                data: {
                  "orderId": id
                },
                success: function (resp) {
                  let pages = getCurrentPages();
                  let page = pages[pages.length - 1]
                  page.onShow();
                },
                fail: function () {
                  console.log("更新订单状态失败")
                }
              })
            },
            'fail': function (res) {
              uni.showToast({
                title: "支付失败"
              })
            }
          })
        }
      })
    }
  },
  // 点击订单菜单时，进入这个页面就出初始化页面
  onShow: function () {
    let that = this;
    uni.request({
      url: that.url.searchUserOrderList,
      method: "POST",
      header: {
        "token": uni.getStorageSync("token"),
      },
      data: {
        "page": 1,
        "length": 20
      },
      success: function (resp) {
        let list = resp.data.list;
        for (let one of list) {
          // 学习时为两个等号，这里为了安全自己填加一个等号，不仅判断值，也判断类型
          if (one.status === 1) {
            one.status = "未支付"
          }
          if (one.status === 2) {
            one.status = "已付款"
          }
          if (one.status === 3) {
            one.status = "已发货"
          }
          if (one.status === 4) {
            one.status = "已签收"
          }
        }
        this.list = list
      }
    })
  }
}
</script>

<style scoped>
.page {
  padding: 10px;
}

.order {
  padding: 10px;
  border-bottom: solid 1px #e0e0e0;
  font-size: 16px;
}

.line-1 {
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
}

.line-2 {
  padding-bottom: 5px;
}

.line-3 {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.pay-btn {
  margin: 0;
  font-size: 14px;
  line-height: 2;
}
</style>
