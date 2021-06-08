<template lang="en">
    <div class="list-container">
        <a-date-picker v-model="date" @change="handleDateChange" />
        <a-checkbox-group
            class="checkbox-group"
            v-model="value"
            name="checkboxgroup"
            @change="onChange"
        >
        <a-row>
            <a-col :span="24" ::key="item.value" v-for="item of plainOptions">
                <a-checkbox :value="item.value">{{
                    item.label}}</a-checkbox>
            </a-col>
            </a-row>
        </a-checkbox-group>
    </div>
</template>
<script>
import { List, Checkbox, DatePicker, Row, Col } from "ant-design-vue";
import moment from "moment";
const { Item } = List;
const { Group } = Checkbox;
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
    this.emitDate();
  },
  data() {
    return {
      date: moment("20130101", "YYYYMMDD"),
      value: [],
    };
  },
  computed: {
    plainOptions() {
      return this.dataSource.length
        ? Object.keys(this.dataSource[0]).map((k) => ({
            label: k,
            value: k,
          }))
        : [];
    },
  },
  methods: {
    emitDate() {
      this.$bus.$emit("date", this.date.format("YYYYMMDD"));
    },
    handleDateChange() {
      this.emitDate();
    },
    onChange(v) {
      console.log(v);
    },
  },
};
</script>
<style lang="less">
.list-container {
  width: 20%;
  display: flex;
  flex-direction: column;
  .checkbox-group {
    flex: 1;
  }
}
</style>
