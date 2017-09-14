<template>
  <div>
    <Button  @click="request">请求</Button>
  </div>
</template>

<script>
export default {
  methods : {
    request() {
      this.$emit('complete')
    }
  }
}
</script>

<style>
  
</style>
