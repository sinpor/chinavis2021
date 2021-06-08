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
import * as d3 from "d3"

const options = {
	legend: {
		right: 20,
		bottom: 20,
		orient: "vertical",
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
				color: '#aaa'
			}
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
		mapStyle: "amap://styles/dark",
		// 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
		renderOnMoving: true,
		// 设置 ECharts 图层是否可交互 默认为 true
		// 设置为 false 可实现高德地图自身图层交互
		// 此配置项从 v1.9.0 起开始支持
		echartsLayerInteractive: true,
		// 是否启用大数据模式 默认为 false
		// 此配置项从 v1.9.0 起开始支持
		largeMode: true,
		// 说明：如果想要添加卫星、路网等图层
		// 暂时先不要使用layers配置，因为存在Bug
		// 建议使用amap.add的方式，使用方式参见最下方代码
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
			itemStyle: {
				radius: 0,
			},
		},
		{
			id: "aqi",
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
		await this.fetchData()
	},
	methods: {
		initBus() {
			console.log(this)
			this.$bus.$on("toolbox-slider", async (v) => {
				this.dateCode = v
				await this.fetchData()
				// this.initFlow(this.originData)
				// this.initTemperature(this.originData)
				// this.initIsoline(this.originData)
				// this.initAqi(this.originData)
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
			this.initIsoline(res)
			this.initAqi(res)
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
		initIsoline(data) {
			const useData = data.map((d) => {
				return {
					...d,
					// lnglat: [d.lon, d.lat].join(','),
				}
			})
			// .slice(0, 10)
			console.log(d3)
			const contour = d3
				.contourDensity()
				.x((d) => d.lon)
				.y((d) => d.lat)

			const contours = contour(useData)

			console.log(contours)
		},
		// initScatter(data) {

		// },
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
