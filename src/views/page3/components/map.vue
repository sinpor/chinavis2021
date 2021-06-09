<template lang="en">
<div class="map">
    <div class="map-header">
		采样视图
		<div>
		<a-button :type="open ? 'primary': 'link'" icon="select" @click="handleOpen"></a-button>
		<a-button :type="'link'" :icon="endBrush ? 'line-chart' : 'caret-right'" @click="handleConfirm"></a-button>
		</div>
	</div>
    <div class="map-container">
		<div class="chart-container" ref="chart">
    </div>
		<div class="chart-container up-layer" :class="{visible: open}" ref="chartUp">
    </div>
	
    </div>
    </div>
</template>
<script>
import * as echarts from "echarts"
import chinaJson from "@/assets/map/china-geo.json"
import { Icon, Button } from "ant-design-vue"
// import dayjs from "dayjs"

const sampleSize = 50

echarts.registerMap("china", chinaJson)
const options = {
	geo: {
		map: "china",
		center: [105.97, 34.71],
		roam: true,
		zoom: 2,
	},
	series: [
		{
			id: "scatter",
			coordinateSystem: "geo",
			type: "scatter",
			symbolSize: 1,
			itemStyle: {
				// color: 'pur'
			},
			silent: false,
			large: true,
		},
	],
}
const options1 = {
	graphic: [
		{
			id: "handle",
			ignore: true,
			type: "rect",
			draggable: true,
			shape: {
				x: 0,
				y: 0,
				width: 50,
				height: 50,
			},
			style: {
				fill: "rgba(0, 200,0, 0.3)",
			},
			z: 10,
		},
		{
			id: "line",
			type: "polyline",
			shape: {
				smooth: 0.5,
			},
			style: {
				fill: null,
				stroke: "orange",
				lineWidth: 3,
			},
		},
	],
}
export default {
	name: "app-map",
	components: {
		[Icon.name]: Icon,
		[Button.name]: Button,
	},
	props: {
		dataSource: Array,
	},
	data() {
		return {
			open: false,
			endBrush: false,
			points: [],
		}
	},
	mounted() {
		this.initChart()
	},
	methods: {
		initChart() {
			this.chart = echarts.init(this.$refs.chart)
			this.chart.setOption(options)

			options1.graphic[0].ondrag = this.handleDrag.bind(this)
			this.chart1 = echarts.init(this.$refs.chartUp)
			this.chart1.setOption(options1)

			// this.chart.on("brushselected", "series.scatter", (opt) => {
			// 	clearTimeout(this.selectTimer)
			// 	this.selectTimer = setTimeout(() => {
			// 		console.log(opt.batch[0].selected)
			// try {
			// 	const data = this.chart
			// 		.getOption()
			// 		.series.find((d) => d.id === "scatter").data
			// 	const dataIndexs = opt.batch[0].selected.find(
			// 		(d) => d.seriesId === "scatter"
			// 	).dataIndex
			// 	const useData = dataIndexs.map((i) => data[i].slice(0, 2))
			// 	this.skipData = useData
			// } catch (error) {
			// 	console.log(error)
			// }
			// }, 300)
			// })
		},
		setChart(data) {
			const useData = data.map((d) => [d.lon, d.lat])
			this.chart.setOption({
				series: {
					id: "scatter",
					data: useData,
				},
			})
		},
		handleDrag(e) {
			if (!this.endBrush) return
			const { target } = e
			this.points.push([target.x + 25, target.y + 25])
			this.chart1.setOption({
				graphic: {
					id: "line",
					shape: {
						points: this.points,
					},
				},
			})
		},
		handleOpen() {
			this.open = !this.open
			this.points = []
			this.chart1.setOption({
				graphic: {
					id: "handle",
					ignore: !this.open,
				},
			})
			if (!this.open) {
				this.chart1.setOption({
					graphic: [
						...this.rectPoints.map((d, i) => {
							return {
								id: i,
								$action: "remove",
							}
						}),
						{
							id: "line",
							shape: {
								points: [],
							},
						},
					],
				})
				this.points = []
			}
		},
		handleConfirm() {
			if (!this.endBrush) {
				this.endBrush = !this.endBrush
				return
			}
			this.endBrush = !this.endBrush
			// console.log(this.points)
			this.rectPoints = [this.points[0]]
			let distance = 0
			for (let i = 0, j = 1; j < this.points.length; i++, j++) {
				const itme1 = this.points[i]
				const itme2 = this.points[j]
				distance += Math.sqrt(
					Math.pow(itme1[0] - itme2[0], 2) +
						Math.pow(itme1[1] - itme2[1], 2)
				)
				if (distance >= sampleSize) {
					distance = 0
					this.rectPoints.push(itme2)
				}
			}
			if (this.rectPoints.length < 2) return
			this.chart1.setOption({
				graphic: [
					{
						id: "handle",
						ignore: true,
					},
					...this.rectPoints.map((d, i) => {
						return {
							id: i,
							type: "rect",
							shape: {
								x: d[0] - 25,
								y: d[1] - 25,
								width: 50,
								height: 50,
							},
							style: {
								fill: "rgba(0, 0,255, 0.3)",
							},
							z: 10,
						}
					}),
				],
			})

			const rectByMap = this.rectPoints.map((d) => {
				const p1 = this.chart.convertFromPixel({ geoIndex: 0 }, d)
				const p2 = this.chart.convertFromPixel({ geoIndex: 0 }, [
					d[0] + 25,
					d[1] + 25,
				])
				return [p1, p2]
			})
			// console.log(rectByMap)

			this.selectData = []

			this.dataSource.forEach((d) => {
				rectByMap.forEach((d1, i) => {
					const useData = this.selectData[i] || []
					if (
						d.lon >= d1[0][0] &&
						d.lon <= d1[1][0] &&
						d.lat <= d1[0][1] &&
						d.lat >= d1[1][1]
					) {
						useData.push(d)
						this.selectData[i] = useData
					}
				})
			})

			this.$bus.$emit("selectData", this.selectData)
		},
	},
	watch: {
		dataSource(v) {
			this.setChart(v)
		},
	},
}
</script>
<style lang="less" scoped>
.map {
	flex: 1;
	height: 100%;
	display: flex;
	flex-direction: column;
	border: solid 1px #999;
	border-radius: 12px;
	padding: 18px;
	.map-header {
		// font-weight: bold;
		// font-size: 16px;
		// margin-bottom: 16px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	.map-container {
		width: 100%;
		flex: 1;
		position: relative;
		margin: 0;
		padding: 0;
	}
	.chart-container {
		flex: 1;
		&.up-layer {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: -10;
			opacity: 0;
			&.visible {
				z-index: 100;
				opacity: 1;
			}
		}
	}
}
</style>
