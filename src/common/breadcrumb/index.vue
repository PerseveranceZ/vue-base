<template>
    <Breadcrumb style="margin-bottom: 17px;" v-if="breadcrumb.length">
        <Breadcrumb-item :key="index" :href="item.route" v-for="(item, index) in breadcrumb">{{item.label}}</Breadcrumb-item>
        <Breadcrumb-item v-if="$route.path.indexOf('/detail')>-1">详情</Breadcrumb-item>
        <Breadcrumb-item v-if="$route.path.indexOf('api_list/debug')>-1">接口调试</Breadcrumb-item>
    </Breadcrumb>
</template>
<script>
import {
    mapActions,
    mapGetters
} from 'vuex';
export default {
    computed: {
        ...mapGetters(['menuOriginGetter']),
        breadcrumb() {
            var _breadcrumb = [];
            this.menuOriginGetter.map((item) => {
                if (item.route === this.$route.path.slice(0, item.route.length)) {
                    _breadcrumb.push({
                        label: item.label,
                        route: item.route
                    });
                }
            });
            return _breadcrumb || [];
            
        }
    },
    methods: {
        // ...mapActions('home', ['ADD_COUNT'])
    }
}
</script>
