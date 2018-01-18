<template>
    <Menu ref="sideMenu" :active-name="defaultActive" theme="dark" :open-names="openNames" width="auto" @on-select="changeMenu">
        <template v-for="item in _orderBy(menuTreeGetter, ['order'], 'desc')">
            <MenuItem v-if="item.show && !item.children.length" :name="item.route" :key="'menuitem' + item.id">
                <Icon v-if="item.icon" :type="item.icon" :key="'menuicon' + item.id"></Icon>
                <span class="layout-text" :key="'title' + item.id">{{ item.label }}</span>
            </MenuItem>

            <Submenu v-if="item.show && item.children.length > 0" :name="item.route.slice(1)" :key="item.id">
                <template slot="title">
                    <Icon v-if="item.icon" :type="item.icon" :key="'menuicon' + item.id"></Icon>
                    <span class="layout-text" :key="'title' + item.id">{{ item.label }}</span>
                </template>
                <template v-for="child in _orderBy(item.children, ['order'], 'desc')">
                    <MenuItem :name="child.route" :key="'menuitem' + child.name">
                        <Icon v-if="child.icon" :type="child.icon" :key="'icon' + child.id"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ child.label }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
import {
    mapActions,
    mapGetters
} from 'vuex';
import _orderBy from 'lodash/orderBy'

export default {
    name: 'sidebarMenu',
    computed:{
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
                arr = route.split('/');
            return arr.slice(1, 2);
        }
    },
    methods: {
        _orderBy,
        changeMenu (active) {
            this.$router.push(active)
        }
    },
    updated () {
        this.$nextTick(() => {
            this.$refs.sideMenu && this.$refs.sideMenu.updateOpened();
        });
    }

};
</script>
