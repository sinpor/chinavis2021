<template lang="en">
    <div ref="container" class="chart-container">
    </div>
</template>
<script>
import * as echarts from "echarts"
import "echarts-gl"
// import "echarts/extension/bmap/bmap"
import "echarts-extension-amap"

import chinaJson from "@/assets/map/china-geo.json"
// import mapStyle from "@/assets/map/mapStyle.json"
import dayjs from "dayjs"
// import * as d3 from "d3"
import moment from "moment"

const options = {
	legend: {
		right: 20,
		bottom: 20,
		orient: "vertical",
		data: [{
			name: '风场'
		}, {
			name: '温度'
		}, {
			name: 'AQI',
			itemStyle: {
				color: 'purple'
			}
		}]
	},
	brush: {
		toolbox: ["rect", "clear"],
		seriesIndex: 2,
		z: 20000,
	},
	visualMap: [
		{
			show: false,
			id: "flowGL",
			seriesIndex: 0,
			left: "left",
			bottom: 40,
			// min: minMag,
			// max: maxMag,
			dimension: 4,
			inRange: {
				color: [
					"#313695",
					"#4575b4",
					"#74add1",
					"#abd9e9",
					"#e0f3f8",
					"#ffffbf",
					"#fee090",
					"#fdae61",
					"#f46d43",
					"#d73027",
					"#a50026",
					"rgba(0,0,0,0)",
				],
			},
			realtime: false,
			calculable: true,
			textStyle: {
				color: "#fff",
			},
		},
		{
			id: "temperature",
			seriesIndex: 1,
			show: false,
		},
		{
			id: "aqi",
			type: "piecewise",
			bottom: 50,
			left: 20,
			splitNumber: 5,
			seriesIndex: 3,
			calculable: true,
			inRange: {
				color: ["purple"],
				colorAlpha: [0.2, 0.9],
			},
			textStyle: {
				color: "#aaa",
			},
		},
	],
	// bmap: {
	// 	// 百度地图中心经纬度
	// 	center: [110.14166322374, 35.240018034923],
	// 	// 百度地图缩放
	// 	zoom: 5,
	// 	// 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
	// 	roam: "move",
	// 	// 百度地图的自定义样式，见 http://developer.baidu.com/map/jsdevelop-11.htm
	// 	mapStyle: {
	// 		styleJson: mapStyle,
	// 	},
	// },
	amap: {
		// 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
		viewMode: "3D",
		// 高德地图支持的初始化地图配置
		// 高德地图初始中心经纬度
		center: [108.39, 39.9],
		// 高德地图初始缩放级别
		zoom: 4,
		// 是否开启resize
		resizeEnable: true,
		// 自定义地图样式主题
		mapStyle: "amap://styles/whitesmoke",
		// 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
		renderOnMoving: true,
		// 设置 ECharts 图层是否可交互 默认为 true
		// 设置为 false 可实现高德地图自身图层交互
		// 此配置项从 v1.9.0 起开始支持
		echartsLayerInteractive: true,
		// 是否启用大数据模式 默认为 false
		// 此配置项从 v1.9.0 起开始支持
		largeMode: true,
		// 拖拽
		dragEnable: true,
	},
	series: [
		{
			id: "flowGL",
			name: "风场",
			type: "flowGL",
			coordinateSystem: "amap",
			supersampling: 4,
			particleType: "line",
			particleDensity: 128,
			particleSpeed: 1,
			// gridWidth: windData.nx,
			// gridHeight: windData.ny,
			itemStyle: {
				opacity: 0.7,
			},
			z: 10,
		},
		{
			id: "temperature",
			name: "温度",
			type: "heatmap",
			coordinateSystem: "amap",
			pointSize: 5,
			blurSize: 6,
			z: 0,
		},
		{
			id: "scatter",
			type: "scatter",
			coordinateSystem: "amap",
			symbolSize: 0,
		},
		{
			id: "aqi",
			name: "AQI",
			type: "heatmap",
			coordinateSystem: "amap",
			pointSize: 5,
			blurSize: 6,
		},
	],
}

export default {
	name: "mainView",

	data() {
		return {
			dateCode: 0,
			originData: [],
		}
	},
	beforeMount() {},
	async mounted() {
		this.initBus()
		echarts.registerMap("china", chinaJson)
		this.chart = echarts.init(this.$refs.container)
		this.setOption(options)
		this.handleBrush()
		this.setOption({
			toolbox: {
				feature: {
					myTool1: {
						title: "查看详情",
						icon:
							"path://M942.193778 486.200889C847.388444 286.520889 704.113778 185.998222 512 185.998222c-192.199111 0-335.388444 100.494222-430.193778 300.288a60.302222 60.302222 0 0 0 0 51.512889c94.805333 199.68 238.08 300.202667 430.193778 300.202667 192.199111 0 335.388444-100.494222 430.193778-300.288 7.68-16.213333 7.68-35.015111 0-51.512889zM512 766.008889c-161.28 0-279.409778-81.806222-362.695111-254.008889C232.590222 339.797333 350.691556 257.991111 512 257.991111c161.28 0 279.409778 81.806222 362.695111 254.008889-83.2 172.202667-201.301333 254.008889-362.695111 254.008889z m-3.982222-429.994667a176.014222 176.014222 0 1 0 0 352 176.014222 176.014222 0 0 0 0-352z m0 287.971556A111.957333 111.957333 0 0 1 395.975111 512a111.957333 111.957333 0 0 1 111.985778-112.014222A111.957333 111.957333 0 0 1 620.003556 512a111.957333 111.957333 0 0 1-112.014223 112.014222z",
						onclick: () => {
							const date = moment("20130101", "YYYYMMDD")
								.add(this.dateCode, "d")
								.format("YYYY/MM/DD")
							this.$router.push({ name: 'Detail', params: { date, data: this.skipData }})
						},
					},
				},
			},
		})
		await this.fetchData()
	},
	methods: {
		initBus() {
			console.log(this)
			this.$bus.$on("toolbox-slider", async (v) => {
				this.dateCode = v
				await this.fetchData()
			})
		},
		offBus() {
			// this.$b
		},
		async fetchData() {
			const { dateCode } = this
			const fileName = dayjs("20130101", "YYYYMMDD")
				.add(dateCode, "d")
				.format("YYYYMMDD")
			const res = await this.$http.get(`${fileName}00`)
			this.originData = res
			this.initAmapControl()
			this.initFlow(res)
			this.initTemperature(res)
			// this.initIsoline(res)
			this.initAqi(res)
			this.initScatter(res)
			return res
		},
		initFlow(data) {
			let maxMag = 0
			let minMag = Infinity
			const useData = data.map((d) => {
				const u = d["U"],
					v = d["V"]
				const mag = Math.sqrt(u * u + v * v)
				maxMag = Math.max(maxMag, mag)
				minMag = Math.min(minMag, mag)
				return [d.lon, d.lat, u, v, mag]
			})
			this.setOption({
				visualMap: {
					id: "flowGL",
					min: minMag,
					max: maxMag,
				},
				series: {
					id: "flowGL",
					data: useData,
				},
			})
		},
		initTemperature(data) {
			let min = Infinity
			let max = 0
			const useData = data.map((d) => {
				min = Math.min(min, d.TEMP)
				max = Math.max(max, d.TEMP)
				// return [d.lon, d.lat, d.TEMP]
				return {
					...d,
					coordinate: [d.lon, d.lat],
				}
			})
			// this.setOption({
			// 	visualMap: {
			// 		id: "temperature",
			// 		min,
			// 		max,
			// 		show: false,
			// 		top: "top",
			// 		seriesId: "temperature",
			// 		calculable: true,
			// 		inRange: {
			// 			color: [
			// 				"rgba(0, 0, 255, 0.3)",
			// 				"rgba(0, 255, 0, 0.3)",
			// 				"rgba(255, 255, 0, 0.3)",
			// 				"rgba(255, 0, 0, 0.2)",
			// 			],
			// 			// color: ['blue', 'green', 'yellow', 'red'],
			// 			// colorAlpha: [0.1, 0.1, 0.1, 0.2],
			// 			// opacity: [0.1, 0.1]
			// 		},
			// 	},
			// 	series: [
			// 		{
			// 			id: "temperature",
			// 			name: "温度",
			// 			type: "heatmap",
			// 			coordinateSystem: "amap",
			// 			data: useData,
			// 			pointSize: 5,
			// 			blurSize: 6,
			// 		},
			// 	],
			// })
			var layer = new window.Loca.HeatmapLayer({
				map: this.amap,
			})
			layer.setData(useData, {
				lnglat: "coordinate",
				value: "TEMP",
			})

			layer.setOptions({
				style: {
					radius: 1.5,
					opacity: [0.5, 0.9],
					color: {
						0: "#2c7bb6",
						0.2: "#abd9e9",
						0.5: "#ffffbf",
						0.7: "#fde468",
						1.0: "#d7191c",
					},
				},
			})

			layer.render()
		},
		initAmapControl() {
			// 获取 ECharts 高德地图组件
			const amapComponent = this.chart.getModel().getComponent("amap")
			// 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
			const amap = amapComponent.getAMap()
			this.amap = amap
			// 添加控件
			// amap.addControl(new window.AMap.Scale())
			// amap.addControl(new window.AMap.ToolBar())
			// 添加图层
			// const satelliteLayer = new AMap.TileLayer.Satellite()
			// const roadNetLayer = new AMap.TileLayer.RoadNet()
			// amap.add([satelliteLayer, roadNetLayer])
			//  添加一个 Marker
			// amap.add(
			// 	new AMap.Marker({
			// 		position: [115, 35],
			// 	})
			// )
			// 禁用 ECharts 图层交互，从而使高德地图图层可以点击交互
			// amapComponent.setEChartsLayerInteractive(false)
		},
		// initIsoline(data) {
			// const useData = data.map((d) => {
			// 	return {
			// 		...d,
			// 		// lnglat: [d.lon, d.lat].join(','),
			// 	}
			// })
			// .slice(0, 10)
			// console.log(d3)
			// const contour = d3
			// 	.contourDensity()
			// 	.x((d) => d.lon)
			// 	.y((d) => d.lat)

			// const contours = contour(useData)

			// console.log(contours)
		// },
		initScatter(data) {
			const useData = data.map((d) => [d.lon, d.lat, d])
			this.setOption({
				series: {
					id: "scatter",
					data: useData,
				},
			})
		},
		initAqi(data) {
			let max = 0
			let min = Infinity
			const useData = data.map((d) => {
				max = Math.max(max, d.AQI)
				min = Math.min(min, d.AQI)
				return [d.lon, d.lat, d.AQI]
			})
			this.setOption({
				visualMap: {
					id: "aqi",
					min,
					max,
				},
				series: {
					id: "aqi",
					data: useData,
				},
			})
		},
		handleBrush() {
			this.chart.on("globalcursortaken", (opt) => {
				if (opt.brushOption.brushType) {
					this.amap.setStatus({
						dragEnable: false,
					})
				} else {
					this.amap.setStatus({
						dragEnable: true,
					})
				}
			})
			this.chart.on("brushselected", "series.scatter", (opt) => {
				clearTimeout(this.selectTimer)
				this.selectTimer = setTimeout(() => {
					try {
						const data = this.chart
							.getOption()
							.series.find((d) => d.id === "scatter").data
						const dataIndexs = opt.batch[0].selected.find(
							(d) => d.seriesId === "scatter"
						).dataIndex
						const useData = dataIndexs.map((i) => data[i].slice(0, 2))
						this.skipData = useData
					} catch (error) {
						console.log(error)
					}
				}, 300)
			})
		},
		setOption(options) {
			this.chart.setOption(options)
		},
	},
}
</script>
<style lang="less">
.chart-container {
	position: relative;
}
</style>
