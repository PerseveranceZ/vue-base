<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <h2>demos</h2>
        <ul>
          <li @click="go('Bind')">Bind</li>
          <li @click="go('Nav')">Nav</li>
          <li @click="go('Layout')">Layout</li>
          <li @click="go('Count')">Count</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'hello',
    data () {
        return {
          msg: 'Welcome to Your Vue.js App'
        }
    },
    methods: {
        go(name) {
            this.$router.push({name})
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
