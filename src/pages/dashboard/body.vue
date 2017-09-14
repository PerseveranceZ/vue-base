<template>
  <table :data="bodyDatas" v-if="bodyDatas"></table>
</template>

<script>
export default {
    props: {
        bodyDatas: {
            type: Array
        }
    }
}
</script>

<style>
  
</style>
