<template>
	<a-layout id="components-layout-demo-top" class="layout">
		<a-layout-header>
			<div class="logo" />
			<a-menu
				theme="dark"
				mode="horizontal"
				:default-selected-keys="['1']"
				:style="{ lineHeight: '64px' }"
			>
				<a-menu-item key="1">
					<router-link to="/">页面1</router-link>
				</a-menu-item>
				<a-menu-item key="2">
					<router-link to="/home">页面2</router-link>
				</a-menu-item>
				<a-menu-item key="3">
					<router-link to="/home">页面3</router-link>
				</a-menu-item>
			</a-menu>
		</a-layout-header>
		<a-layout-content style="padding: 0 50px">
			<div
				:style="{
					background: '#fff',
					padding: '24px',
					minHeight: '280px',
				}"
			>
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
<style>
#components-layout-demo-top .logo {
	width: 120px;
	height: 31px;
	background: rgba(255, 255, 255, 0.2);
	margin: 16px 24px 16px 0;
	float: left;
}
</style>
