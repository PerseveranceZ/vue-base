<template>
<div>
    <baidu-map class="map" center="北京">
    </baidu-map>
</div>
</template>
<script>
  export default {
    data() {
      bodyDatas: null
    },
    components: {
    },
    created() {
    }
  }
</script>
<style>
/* The container of BaiduMap must be set width & height. */
.map {
  width: 100%;
  height: 300px;
}
</style>