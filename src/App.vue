<template>
	<a-layout id="components-layout-demo-top" class="layout">
		<a-layout-header>
			<div class="logo" >大气污染预测可视化分析</div>
			<a-menu
				theme="dark"
				mode="horizontal"
				:default-selected-keys="['1']"
				:style="{ lineHeight: '64px' }"
			>
				<a-menu-item key="1">
					<router-link to="/">综合预测概览</router-link>
				</a-menu-item>
				<a-menu-item key="2">
					<router-link to="#">污染物详情分析</router-link>
				</a-menu-item>
				<a-menu-item key="3">
					<router-link to="/page3">属性签名</router-link>
				</a-menu-item>
			</a-menu>
		</a-layout-header>
		<a-layout-content>
			<div class="layout-content">
				<router-view />
			</div>
		</a-layout-content>
	</a-layout>
</template>
<script>
import { Layout, Menu } from "ant-design-vue"
const { Header, Content } = Layout
const { Item } = Menu
export default {
	name: "App",
	components: {
		[Layout.name]: Layout,
		[Header.name]: Header,
		[Content.name]: Content,
		[Menu.name]: Menu,
		[Item.name]: Item,
	},
}
</script>
<style lang="less">
@import url(./style/variable.less);
@import url(./style/common.less);

#components-layout-demo-top {
	min-width: 1280px;
	.logo {
		width: 320px;
		height: 31px;
		line-height: 31px;
		color: #fff;
		font-size: 28px;
		// background: rgba(255, 255, 255, 0.2);
		margin: 16px 24px 16px 0;
		float: left;
	}
	.ant-layout-content {
		// margin: 0 @content-margin;
		.layout-content {
			min-height: @content-height;
			height: @content-height;
			background: #fff;
			// padding: @content-padding;
		}
	}
}
</style>
