<template lang="en">
    <div class="list-container">
        <div class="list-header">属性过滤</div>
        <a-date-picker v-model="date" @change="handleDateChange" />
        <a-checkbox-group
            class="checkbox-group"
            v-model="value"
            name="checkboxgroup"
            @change="onChange"
        >
        <a-row>
            <a-col :span="24" ::key="item" v-for="item of plainOptions">
                <a-checkbox :value="item">{{
                    item}}</a-checkbox>
            </a-col>
            </a-row>
        </a-checkbox-group>
    </div>
</template>
<script>
import { List, Checkbox, DatePicker, Row, Col } from "ant-design-vue"
import moment from "moment"
const { Item } = List
const { Group } = Checkbox
export default {
	name: "list",
	components: {
		[List.name]: List,
		[Item.name]: Item,
		[Checkbox.name]: Checkbox,
		[Group.name]: Group,
		[DatePicker.name]: DatePicker,
		[Row.name]: Row,
		[Col.name]: Col,
	},
	props: {
		dataSource: Array,
	},
	mounted() {
		this.emitDate()
		this.$bus.$emit('selectPrototype', this.value)
	},
	data() {
		return {
			date: moment("20130101", "YYYYMMDD"),
			value: ["PM2.5", "PM10", "SO2", "NO2", "CO", "O3", "AQI", "U", "V", "TEMP", "RH", "PSFC"],
			plainOptions: ["PM2.5", "PM10", "SO2", "NO2", "CO", "O3", "AQI", "U", "V", "TEMP", "RH", "PSFC"]
		}
	},
	computed: {
		// plainOptions() {
		// 	const options = this.dataSource.length
		// 		? Object.keys(this.dataSource[0]).map((k) => ({
		// 				label: k,
		// 				value: k,
		// }))
		// 		: []
        //         return options
		// },
	},
	methods: {
		emitDate() {
			this.$bus.$emit("date", this.date.format("YYYYMMDD"))
		},
		handleDateChange() {
			this.emitDate()
		},
		onChange(v) {
			this.$bus.$emit('selectPrototype', v)
		},
	},
    watch: {
        // dataSource(v) {
        //     this.value  = Object.keys(v[0])
        // }
    }
}
</script>
<style lang="less">
.list-container {
	height: 100%;
	width: 200px;
	display: flex;
	flex-direction: column;
	border: solid 1px #999;
	border-radius: 12px;
	padding: 18px;
    margin-right: 18px;
	.list-header {
		font-weight: bold;
		font-size: 16px;
		margin-bottom: 16px;
	}
	.checkbox-group {
		margin-top: 18px;
		flex: 1;
	}
}
</style>
