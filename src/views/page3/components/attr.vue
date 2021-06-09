<template lang="en">
    <div class="attr-container">
        <div class="attr-header">属性签名

        <a-button type="link" icon="stock" @click="handleSortChart"></a-button>

        </div>
        <div class="body" >
            <div v-if="!data.length" class="no-data">
                <a-empty description="尚未采样数据！" />
            </div>
            <div class="attr-chart" v-for="item in data" :key="item.name" :class="{active: activeKey === item.name}" @click="handleAcive(item.name)">
            <app-line :dataSource="item.data" :name="item.name" ></app-line>
            </div>
        </div>
    </div>
</template>
<script>
import AppLine from "./line.vue"
import _ from "lodash"
import { Button, Empty } from "ant-design-vue"
export default {
	name: "app-attr",
	components: {
		AppLine,
		[Button.name]: Button,
		[Empty.name]: Empty,
	},
	props: {
		selectPrototypes: Array,
		selectData: Array,
	},
	data() {
		return {
			data: [],
			activeKey: "",
		}
	},
	methods: {
		handleAcive(name) {
			this.activeKey = name
		},
		handleSortChart() {
			const baseItem = this.data.find((d) => d.name === this.activeKey)
			const useData = this.data
				.slice(0)
				.map((d) => {
					const distance = d.data.reduce((c, d1, i) => {
						c += Math.pow(baseItem.data[i] - d1, 2)
						return c
					}, 0)
					return { ...d, distance }
				})
				.sort((a, b) => a.distance - b.distance)
            this.data = useData
		},
	},
	watch: {
		selectData(v) {
			if (!v.length) return
			const useData = _.chain(v)
				.map((d) =>
					this.selectPrototypes.reduce((obj, d1) => {
						obj[d1] = _.meanBy(d, d1)
						return obj
					}, {})
				)
				.reduce((obj, d) => {
					this.selectPrototypes.forEach((k) => {
						obj[k] = obj[k] || {
							name: k,
							data: [],
						}
						obj[k].data.push(d[k])
					})
					return obj
				}, {})
				.values()
				.map((d) => {
					const max = _.max(d.data)
					const min = _.min(d.data)
					const useData = d.data.map((d1) => (d1 - min) / (max - min))
					return {
						...d,
						distance: 0,
						data: useData,
					}
				})
				.value()
			this.data = useData
			this.activeKey = this.data[0].name

		},
	},
}
</script>
<style lang="less">
.attr-container {
	width: 400px;
	height: 100%;
	display: flex;
	flex-direction: column;
	border: solid 1px #999;
	border-radius: 12px;
	padding: 18px;
	margin-left: 18px;
	.attr-header {
		font-weight: bold;
		font-size: 16px;
		margin-bottom: 16px;
		display: flex;
		justify-content: space-between;
	}
	.body {
		display: flex;
		flex-wrap: wrap;
        flex: 1;
		.attr-chart {
			border-radius: 10px;
			border: solid 1px rgba(0, 0, 0, 0);
			width: calc(400px / 3 - 15px);
			height: calc(400px / 3);
			&.active {
				border-color: royalblue;
			}
		}
		.no-data {
			position: relative;
			top: 200px;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
