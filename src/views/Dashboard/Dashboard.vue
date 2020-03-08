<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <i class="fa fa-users fa-5x"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              报名总人数
            </div>
            <span class="card-panel-num">{{ totalPeople }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <i class="fa fa-jpy fa-5x"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              已支付人数
            </div>
            <span class="card-panel-num">{{ pay1 }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <i class="fa fa-user-times fa-5x"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              未支付人数
            </div>
            <span class="card-panel-num">{{ pay0 }}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <i class="fa fa-percent fa-5x"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              报名支付比例
            </div>
            <span class="card-panel-num">{{ proportion }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <br>
    <br>
    <br>
    <div id="main" style="height: 350px;width: 100%"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  export default {
    name: 'Dashboard',
    mixins: [resize],
    data() {
      return {
        totalPeople: '0', // 报名总人数
        pay0: '0', // 未支付人数
        pay1: '0', // 已支付人数
        proportion: '0%', // 报名支付比例
        xData: '',
        yData: ''
      }
    },
    mounted() {
    },
    created() {
      this.getSevenDayApplyTotal()
      this.getHeadcount()
    },
    methods: {
      getHeadcount() {
        this.$api.dashboard.headcount().then((response) => {
          this.totalPeople = response.data.totalPeople
          this.pay0 = response.data.pay0
          this.pay1 = response.data.pay1
          this.proportion = response.data.proportion
        })
      },
      getSevenDayApplyTotal() {
        this.$api.dashboard.getSevenDayApplyTotal().then((response) => {
          this.xData = response.data.xData
          this.yData = response.data.yData
          this.initChart()
        })
      },
      initChart() {
        this.chart = echarts.init(document.getElementById('main'), 'macarons')
        // 指定图表的配置项和数据
        const option = {
          xAxis: {
            data: this.xData,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 50,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['近7日报名人数']
          },
          series: [{
            name: '近7日报名人数', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: this.yData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }]
        }
        this.chart.setOption(option)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
  }
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }
    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;
      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
