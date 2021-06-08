<template lang="en">
   <div class="toolbox">
       <a-select v-model="yearCode" style="width: 120px" @change="handleYearChange">
      <a-select-option v-for="i of 6" ::key="i" :value="i-1">
        {{getYear(i-1)}}
      </a-select-option>
    </a-select>
	<a-slider style="flex: 1; margin-left: 16px" :tipFormatter="tipFormatter" :dots="true" :max="365" v-model="dateCode" @change="handleSliderChange($event)" />
</div>
</template>
<script>
import { Slider, Select } from "ant-design-vue"
import dayjs from "dayjs"
import moment from 'moment'
export default {
	name: "tool-box",
	components: {
		[Slider.name]: Slider,
		[Select.name]: Select,
		[Select.Option.name]: Select.Option,
	},
	data() {
		return {
			yearCode: 0,
			dateCode: 0,
		}
	},
	mounted() {
		this.emit()
	},
	methods: {
		emit() {
			const isLeapYear = moment([2013 + this.yearCode]).isLeapYear()
			this.$bus.$emit(
				"toolbox-slider",
				this.yearCode * (isLeapYear ? 366 : 365) + this.dateCode
			)
		},
		getYear(code) {
			return dayjs("2013", "YYYY")
				.add(code, "y")
				.format("YYYY")
		},
		tipFormatter(v) {
			return dayjs(`${this.getYear(this.yearCode)}`)
				.add(v, "d")
				.format("YYYY/MM/DD")
		},
		handleYearChange() {
			this.emit()
		},
		handleSliderChange() {
			this.emit()
		},
	},
}
</script>
<style lang="less">
.toolbox {
	position: absolute;
	left: 24px;
	right: 24px;
	top: 24px;
	z-index: 2;
	opacity: 0.9;
	display: flex;
	align-items: center;
}
</style>
