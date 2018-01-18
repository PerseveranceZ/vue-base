<template>
    <div>
        <template v-for="item in _orderBy(menuTreeGetter, ['order'], 'desc')">
            <div style="text-align: center;" :key="item.id">
                <Dropdown transfer v-if="item.show && item.children.length > 0" placement="right-start" :key="item.id" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :type="item.icon" color="white"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="child in item.children">
                            <DropdownItem :name="child.route" :key="child.id">
                                <Icon :type="child.icon"></Icon>
                                <span style="padding-left:10px;">{{ child.label }}</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-if="item.show && item.children.length === 0" placement="right-start" :key="item.id" @on-click="changeMenu">
                    <Button @click="changeMenu(item.route)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :type="item.icon" color="white"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem :name="item.toute" :key="item.id">
                            <Icon :type="item.icon"></Icon>
                            <span style="padding-left:10px;">{{ item.label }}</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
import {
    mapActions,
    mapGetters
} from 'vuex';
import _orderBy from 'lodash/orderBy'

export default {
    name: 'sidebarMenuShrink',
    computed:{
        ...mapGetters(['menuTreeGetter']),
        defaultActive() {
            let route = this.$route.path,
                position = route.indexOf('/detail') + route.indexOf('/add') + 1
            this.$nextTick(() => {
                this.$refs.menu && this.$refs.menu.updateActiveName()
            })
            return position > -1 ? route.slice(0, position) : route
        }
    },
    methods: {
        _orderBy,
        changeMenu (active) {
            this.$router.push(active)
        }
    }
};
</script>
