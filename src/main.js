import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import { fetch } from "@/http"
import bus from '@/event-bus'

Vue.config.productionTip = false
Vue.prototype.$http = fetch
Vue.prototype.$bus = bus

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app")
