<template>
  <q-page class="bg-grey-1" style="min-height: 550px; padding-top: 1rem">
    <apexchart type=line height=400 :options="chartOptions" :series="series" style="min-height: 10px;"/>

    <q-page style="min-height: 90px; float: right">
      <div>
        <q-datetime
          id="workOrderStartTime"
          style="min-width: 150px"
          type="date"
          v-model="workOrderStartTime"
          color="brown"
          :max="workOrderEndTime"
          clearable
          :stack-label='$t("startTime")'
        />
        <q-datetime
          id="workOrderEndTime"
          style="min-width: 150px"
          type="date"
          v-model="workOrderEndTime"
          color="brown"
          clearable
          :min="workOrderStartTime"
          :stack-label='$t("endTime")'
        />
        <q-btn id="selectWorkOrderData" color="blue" icon='search' @click="deviceData()"/>
      </div>
    </q-page>
  </q-page>
</template>

<script>
  import {i18n} from '../../plugins/i18n'
  import {getWorkOrderListNumber} from '../../interface/getData'

  export default {
    name: "HomepageSaleData",

    props: {
      saleDateTime: {
        type: Object
      }
    },
    data() {
      return {
        workOrderStartTime: '',
        workOrderEndTime: '',
        series: [],
        deviceSum:'',
        deviceFaultNumber:'',
        deviceAddNumber:'',
        chartOptions: {
          chart: {
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          title: {
            text: i18n.t('saleData'),
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
      saleDateTime() {
        this.deviceData()
      }
    },

    methods: {
      async deviceData() {

        const data = {}
        data.createStartTime = this.workOrderStartTime
        data.createEndTime = this.workOrderEndTime
        const r = await getWorkOrderListNumber({...data})
        const deviceArray = r.data

console.log(deviceArray)
        const _series = [];
        _series[0] = {name:i18n.t('workOrderTotalNumber'), data:[]};
        _series[1] = {name:i18n.t('workOrderSolved'), data:[]};
        _series[2] = {name:i18n.t('workOrderNotSolved'), data:[]};
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

<style scoped>
  #workOrderStartTime, #workOrderEndTime {
    float: left;
  }

  #selectWorkOrderData {
    top: 20px;
    float: left;
  }
</style>
