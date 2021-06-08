<template lang="en">
    <div class="page-container">
        <app-list :dataSource="dataSource"></app-list>
    </div>
</template>
<script>
import appList from './components/list.vue'
export default {
    components: {
        'appList': appList
    },
    data() {
        return {
            dataSource: []
        }
    },
    mounted() {
        this.initBus()
    },
    methods: {
        initBus() {
			this.$bus.$on("date", async (v) => {
                await this.fetchData(v)

				// this.dateCode = v
				// await this.fetchData()
				// this.initFlow(this.originData)
				// this.initTemperature(this.originData)
				// this.initIsoline(this.originData)
			})
            
		},
        async fetchData(date) {
         const data = await   this.$http.get(`${date}00`)
         this.dataSource = data
         console.log(data);
         return data
        }
    }
}
</script>
<style lang="less">
    
</style>