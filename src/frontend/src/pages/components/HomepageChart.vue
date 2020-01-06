<template>
  <q-page style="min-height: 550px">

    <apexchart type=line height=400 :options="chartOptions" :series="series" />

    <q-page style="min-height: 10px; float: right">
      <div>

        <q-datetime
          id="productStartTime"
          style="min-width: 150px"
          type="date"
          v-model="productStartTime"
          color="brown"
          :max="productEndTime"
          clearable
          :stack-label='$t("startTime")'
        />
        <q-datetime
          id="productEndTime"
          style="min-width: 150px"
          type="date"
          v-model="productEndTime"
          color="brown"
          clearable
          :min="productStartTime"
          :stack-label='$t("endTime")'
        />
        <q-btn id="selectProductData" color="blue" icon='search' @click="deviceData()"/>
      </div>
    </q-page>

  </q-page>
</template>

<script>
import {i18n} from '../../plugins/i18n'
import {getDeviceInfoNumber} from '../../interface/getData'


  export default {
    name: 'HomepageChart',
    props: {
      productTime:{
          type: Object
        }
      },
    data () {
      return {
        productStartTime: '',
        productEndTime: '',
        series: [],
        chartOptions: {
          chart: {
            width: 50,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          title: {
            text: i18n.t('productData'),
            align: 'center',
            style: {
              fontSize: '18px'
            }
          },
          stroke: {
            curve: 'smooth'
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          },
          xaxis: {
            type: 'datetime'
          },
        }
      }
    },

    watch: {
      productTime(){
        this.deviceData()
      }
    },

    methods: {
      async deviceData(v){

        const data={}
        data.createStartTime=this.productStartTime
        data.createEndTime=this.productEndTime
        const r = await getDeviceInfoNumber({...data})
        const deviceArray=r.data

        const _series = [];
        _series[0] = {name:i18n.t('deviceNumber'), data:[]};
        _series[1] = {name:i18n.t('errorStatusNumber'), data:[]};
        _series[2] = {name:i18n.t('addNewDeviceNumber'), data:[]};
        for(var i=0;i<deviceArray.length;i++){
          _series[0].data.push({
            x: deviceArray[i].createDeviceDate,
            y: deviceArray[i].deviceSum
          });

          _series[1].data.push({
            x: deviceArray[i].createDeviceDate,
            y: deviceArray[i].deviceFaultNumber
          });

          _series[2].data.push({
            x: deviceArray[i].createDeviceDate,
            y: deviceArray[i].deviceAddNumber
          });
        }
        this.series = _series;
      }

    }
  }
</script>
<style>
  #productStartTime, #productEndTime {
    float: left;
  }

  #selectProductData{
    top: 20px;
    float: left;
  }
</style>
