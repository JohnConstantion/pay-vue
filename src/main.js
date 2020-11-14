import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
let bestUrl = "http://localhost:8080/renren-fast";
Vue.prototype.url = {
    "wxLogin": bestUrl + "/app/wx/login",
    "searchUserOrderList": bestUrl + "/app/order/searchUserOrderList",
    "microAppPayOrder": bestUrl + "/app/wx/microAppPayOrder",
    "updateOrderStatus": bestUrl + "/app/wx/updateOrderStatus"
}
