<template lang="en">
    <div class="page-container">
        <app-list :dataSource="dataSource"></app-list>
        <app-map :dataSource="dataSource" ></app-map>
        <app-attr :selectPrototypes="selectPrototypes" :selectData="selectData"></app-attr>
    </div>
</template>
<script>
import appList from './components/list.vue'
import appMap from './components/map.vue'
import appAttr from './components/attr.vue'
export default {
    components: {
        'appList': appList,
        appMap,
        appAttr
    },
    data() {
        return {
            dataSource: [],
            selectPrototypes: [],
            selectData: []
        }
    },
    created() {
        this.initBus()
    },
    mounted() {
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

            this.$bus.$on('selectPrototype', v => {
                console.log(v);
                this.selectPrototypes = v
            })

            this.$bus.$on('selectData', v => {
                this.selectData = v
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
    .page-container {
        height: 100%;
        padding: 24px;
        display: flex;
    }
</style>