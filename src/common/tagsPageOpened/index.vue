<template>
    <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <Dropdown transfer @on-click="handleTagsOption">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <transition-group name="taglist-moving-animation">
                <Tag
                    type="dot"
                    ref="tagsPageOpened"
                    v-for="(item, index) in pageTagsList"
                    :key="item.name"
                    :name="item.name"
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name===DEFAULTROUTER.name?false:true"
                    :color="item.name===currentPageName?'blue':'default'"
                >{{ item.title }}</Tag>
            </transition-group>
        </div>
    </div>
</template>

<script>
import saver from 'Utils/saver';

const DEFAULTROUTER = {
    name: 'home'
}

export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name,
            tagBodyLeft: 0,
            pageTagsList: [],
            DEFAULTROUTER
        };
    },
    methods: {
        closePage (event, name) {
            var lastIndex = this.pageTagsList.length - 1,
                linkRoute = null,
                removeTagName = name,
                lastRouteInfo = this.pageTagsList[lastIndex];
            if (this.currentPageName === name) {
                while(lastIndex >= 0 && lastRouteInfo.name === name){
                    --lastIndex;
                    lastRouteInfo = this.pageTagsList[lastIndex];
                }
                linkRoute = lastRouteInfo || DEFAULTROUTER;
            } else {
                let tagWidth = event.target.parentNode.offsetWidth;
                this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0);
            }
            this.removeTag(removeTagName);
            linkRoute && this.linkTo(linkRoute);
        },
        linkTo (item) {
            if(this.currentPageName !== item.name){
                this.$router.push({
                    name: item.name,
                    query: item.query,
                    params: item.params
                });
            }
        },
        handlescroll (e) {
            var type = e.type;
            let delta = 0;
            if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            let left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
                    if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100);
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        handleTagsOption (type) {
            if (type === 'clearAll') {
                this.clearAllTags();
                this.$router.push(DEFAULTROUTER);
            } else {
                this.clearOtherTags(this.currentPageName);
            }
            this.tagBodyLeft = 0;
        },
        moveToView (tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 10;
            } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
                // 标签在可视区域
                this.tagBodyLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth - tag.offsetLeft - 20);
            } else {
                // 标签在可视区域右侧
                this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
            }
        },
        addTag(route){
            var isCurrent = this.pageTagsList.some(item => {
                if(item.name === route.name){
                    return true;
                }
            });
            if(!isCurrent){
                this.pageTagsList.push({
                    name: route.name,
                    title: route.meta.title || route.name,
                    params: route.params,
                    query: route.query,
                });
            }
        },
        removeTag(tagName){
            var removeIndex = -1;
            this.pageTagsList.some((item, index) => {
                if(item.name === tagName){
                    removeIndex = index;
                    return true;
                }
            });
            if(removeIndex !== -1){
                this.pageTagsList.splice(removeIndex, 1);
            }
        },
        clearAllTags(){
            this.pageTagsList = [];
        },
        clearOtherTags(name){
            this.pageTagsList = this.pageTagsList.filter(item => {
                if(item.name === name){
                    return true;
                }
            });
        }
    },
    created(){
        this.pageTagsList = saver.get('pageTagsList') || [];
        this.addTag(this.$route);
    },
    mounted () {
        this.$nextTick(() => {
            this.refsTag = this.$refs.tagsPageOpened;
            this.refsTag && this.refsTag.forEach((item, index) => {
                if (this.$route.name === item.name) {
                    let tag = this.refsTag[index].$el;
                    this.moveToView(tag);
                }
            });
        });
    },
    watch: {
        '$route' (to) {
            this.addTag(to);
            this.currentPageName = to.name;
            this.$nextTick(() => {
                this.refsTag.forEach((item, index) => {
                    if (to.name === item.name) {
                        let tag = this.refsTag[index].$el;
                        this.moveToView(tag);
                    }
                });
            });
        },
        pageTagsList(newVal){
            saver.set('pageTagsList', newVal)
        }
    }
};
</script>
