<template>
   <Modal width="700" v-model="show" title="指标曲线">
        <div ref="targetChart" style="width:650px;height:500px;"></div>
         <Row v-if="show && detail" class="text-center mg-tp-10">
            <Form inline>
                <Form-item label="当前最新值">
                    <Tag>{{detail.lastValue}}</Tag>
                </Form-item>
                    <Form-item label="昨日均值">
                    <Tag color="green">{{detail.yesterdayValue}}</Tag>
                </Form-item>
                    <Form-item label="七日均值">
                    <Tag color="green">{{detail.lastSevenDayValue}}</Tag>
                </Form-item>
                    <Form-item label="增长周同比">
                    <Tag color="blue">{{detail.weekRingRate}}</Tag>
                </Form-item>
                    <Form-item label="增长周环比">
                    <Tag color="blue">{{detail.weekBassRate}}</Tag>
                </Form-item>
            </Form>
        </Row>
        <div slot="footer">
            <Button size="large" long @click="show = false">隐藏</Button>
        </div>
        <Spin v-if="showSpin" fix></Spin>
    </Modal>
</template>

<script>
import echarts from 'echarts'
import echartsOptions from "./option";
export default {
    props: ['indexName'],
    mounted() {
        this.bindEvent()
    },
    watch: {
        show(isShow) {
            if(isShow && !this.targetChart){
                this.$nextTick(() => {
                    this.targetChart = echarts.init(this.$refs.targetChart)
                })
            }
        }
    },
    methods: {
        bindEvent() {
            GLOBAL.vbus.$on('globalIndexDetail', (indexName) => {
                this.show = true
                this.showSpin = true
                this.getData(indexName)
            })
        },
        getData(indexName) {
            this.$apis['target/cmnIndexData']({indexName}).then((resData) => {
                this.detail = resData.indexDetail
                this.targetChart.setOption(this._setChartsOptions(indexName, resData.indexDataList), true)
                this.showSpin = false
            })
        },
        _setChartsOptions(indexName, resData) {
            let chartNeed = {
                xData: [],
                values: []
            };
            echartsOptions.title.text = indexName + '变化曲线';
            resData.map(item => {
                chartNeed.xData.push(item.indexTime);
                chartNeed.values.push(item.indexValue);
            });
            echartsOptions.xAxis.data = chartNeed.xData;
            echartsOptions.series[0].data = chartNeed.values;
            echartsOptions.series[0].name = indexName;
            return echartsOptions;
        }
    },
    beforeDestroy() {
        this.targetChart && this.targetChart.dispose()
        GLOBAL.vbus.$off('globalIndexDetail')
    },
    data() {
        return {
            showSpin: true,
            detail: null,
            show: false
        }
    }
}
</script>

<style>

</style>
