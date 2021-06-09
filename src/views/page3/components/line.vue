<template lang="en">
<div class="attr-item">
    <div class="attr-item-header">{{name}}
    </div>
    <div class="chart-container" ref="chart">
    </div>
    </div>
</template>
<script>
import * as echarts from "echarts"
export default {
	name: "app-line",
	props: {
		dataSource: Array,
		name: String,
	},
	mounted() {
		this.chart = echarts.init(this.$refs.chart)
	},
	methods: {},
	updated() {},
	watch: {
		dataSource: {
			handler(v, o) {
				if (v === o) return
				if (!this.dataSource || !this.dataSource.length) return
				const option = {
					grid: {
						top: 5,
						bottom: 5,
						left: 5,
						right: 5,
					},
					xAxis: { type: "category" },
					yAxis: {},
					series: {
						type: "line",
						data: v,
					},
				}
				this.$nextTick(() => {
					const { clientWidth, clientHeight } = this.$refs.chart

					this.chart.setOption(option)
					this.chart.resize({
						width: clientWidth,
						height: clientHeight,
					})
				})
			},
			immediate: true,
		},
	},
}
</script>
<style lang="less">
.attr-item {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	.attr-item-header {
		text-align: center;
	}
	.chart-container {
		flex: 1;
		min-height: auto;
	}
}
</style>
