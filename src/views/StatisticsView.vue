
<script setup>
import { onMounted, ref, computed } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import axios from '@/util/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const chartContainer = ref(null);
const wordList = ref([
  { name: 'test1', value: 200 },
  { name: 'test2', value: 150 },
  { name: 'test3', value: 100 },
  { name: 'test4', value: 80 },
  { name: 'test5', value: 60 }
]);

const maxValue = computed(() => {
  let values = wordList.value.map(v => v.value);
  return Math.max(...values);
});

const drawChart = () => {
  var chart = echarts.init(chartContainer.value);
  let option = {
    tooltip: {
      show: true,
      position: 'top',
      textStyle: {
        fontSize: 18
      }
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '85%',
        height: '85%',
        sizeRange: [14, 40],
        rotationRange: [0, 0],
        rotationStep: 45,
        gridSize: 16,
        drawOutOfBound: true,
        layoutAnimation: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: itemData => {
            let opacity = itemData.value / maxValue.value;
            return (
              'rgba(' +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                opacity
              ].join(',') +
              ')'
            );
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 6,
            textShadowColor: '#666'
          }
        },
        data: wordList.value
      }
    ]
  };
  chart.setOption(option);
};

const lineChartDiv = ref(null);

const drawLineChart = (date, loginsValue) => {
  var chart = echarts.init(lineChartDiv.value);
  let option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: 'Graph of the number of logins'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 10
      }
    ],
    series: [
      {
        name: 'Login Number',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        data: loginsValue
      }
    ]
  };
  chart.setOption(option);
};

const lineChartData = ref(null);

async function getLineChartData() {
    try {
        const response = await axios.get(`/api/admin/dailyPostsCount`);
        lineChartData.value = response;
        const categories = Object.keys(lineChartData.value);
        const data = Object.values(lineChartData.value);
        console.log(categories);
        console.log(data);
        drawLineChart(categories, data)
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

const wordCloudChartData = ref(null);
async function getWordCloudChartData() {
    try {
        const response = await axios.get(`/api/admin/allPostsWords`);
        wordCloudChartData.value = response;
        wordList.value = Object.keys(wordCloudChartData.value).map(key => ({
          name: key,
          value: wordCloudChartData.value[key]
        }));
        drawChart();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

function goToIndex() {
  router.push({ name: 'index' });
}

onMounted(() => {
  getLineChartData()
  if (chartContainer.value) {
    getWordCloudChartData();
  }
});
</script>


<template>
  <div class="statistics-div">
    <el-card>
        <template #header>
        <div class="card-header">
            <span>Website Statistics</span>
        </div>
        </template>
        <div ref="lineChartDiv" style="width: 100%; height: 300px;"></div>
        <div ref="chartContainer" style="width: 100%; height: 300px;"></div>
        <template #footer>
          <el-button type="primary" @click="goToIndex">Back</el-button>
        </template>
    </el-card>
  </div>
  
</template>

<style scoped>
.new-post-button-group{
    display: flex;
    justify-content: space-between;
}

</style>