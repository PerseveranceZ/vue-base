<template>
    <div>
        <div :key="'slevel' + index" v-for="(slevel, index) in _orderBy(baseData, ['order'], 'desc')">
            <Submenu v-if="baseData && baseData.length && slevel.show && slevel.children.length" :name="slevel.route.slice(1)">
                <template slot="title">
                    <Icon v-if="slevel.icon" :type="slevel.icon"></Icon>
                    {{slevel.label}}
                </template>
            <Menu-item :key="'flevel' + index" :name="flevel.route" v-if="slevel.children.length && flevel.show" v-for="(flevel, index) in _orderBy(slevel.children, ['order'])">
                <Icon v-if="flevel.icon" :type="flevel.icon"></Icon>
                {{flevel.label}}
            </Menu-item>
        </Submenu>
        <Menu-item :name="slevel.route" v-if="slevel.show && !slevel.children.length">
            <Icon v-if="slevel.icon" :type="slevel.icon"></Icon>
            {{slevel.label}}
        </Menu-item>
    </div>
    </div>
</template>

<script>
    import _orderBy from 'lodash/orderBy'
    export default {
        name: 'navbar-tmp',
        props: {
            baseData: [Object, Array]
        },
        methods: {
            _orderBy
        }
    }
</script>
