<template>
    <!--<Affix>-->
        <Menu class="navbar" ref="menu" v-if="menuTreeGetter.length" router :active-name="defaultActive" @on-select="selected" accordion :open-names="openNames">
            <NavbarTMP :baseData="menuTreeGetter"></NavbarTMP>
        </Menu>
    <!--</Affix>-->
</template>
<script>
import {
    mapActions,
    mapGetters
} from 'vuex';
import NavbarTMP from './tmp'
export default {
    name: 'navbar',
    components: {
        NavbarTMP
    },
    computed: {
        ...mapGetters(['menuTreeGetter']),
        defaultActive() {
            let route = this.$route.path,
                position = route.indexOf('/detail') + route.indexOf('/add') + 1
            this.$nextTick(() => {
                this.$refs.menu && this.$refs.menu.updateActiveName()
            })
            return position > -1 ? route.slice(0, position) : route
        },
        openNames() {
            let route = this.$route.path,
                arr = route.split('/')
                
            this.openNames = ['document', 'api_list']
            this.$refs.menu && this.$refs.menu.updateOpened()
            return arr.splice(1, 2)
        }
    },
    methods: {
        selected(name) {
            this.$router.push(name)
        }
    }
}
</script>