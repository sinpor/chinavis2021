<template lang="en">
    <div class="page-container">
        <tool-box />
        <main-view></main-view>
    </div>
</template>
<script>
import mainView from "./components/main-view"
import Toolbox from "./components/toolbox"
export default {
	name: "meterorology",
	components: { mainView, [Toolbox.name]: Toolbox },
}
</script>
<style lang="less">
@import url(../../style/variable.less);
.page-container {
	width: 100%;
    height: 100%;
    position: relative;
}
</style>
