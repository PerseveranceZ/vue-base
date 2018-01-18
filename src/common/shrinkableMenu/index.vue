<style scope>
    .ivu-shrinkable-menu{
    height: 100%;
    width: 100%;
    background: #495060;
}
</style>

<template>
    <div class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu
            v-show="!shrink"
        ></sidebar-menu>
        <sidebar-menu-shrink
            v-show="shrink"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import { oneOf } from 'Utils/util';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        }
    }
};
</script>
