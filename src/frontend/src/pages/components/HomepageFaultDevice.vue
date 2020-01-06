<template>
  <q-page style="min-height: 550px; padding-top: 1rem">
    <apexchart type=line height=400 :options="chartOptions" :series="series" style="top: 10px;"/>

    <q-page style="min-height: 10px; float: right; ">
      <div>
        <q-datetime
          id="errorStartTime"
          style="min-width: 150px"
          type="date"
          v-model="errorStartTime"
          color="brown"
          :max="errorEndTime"
          clearable
          :stack-label='$t("startTime")'
        />
        <q-datetime
          id="errorEndTime"
          style="min-width: 150px"
          type="date"
          v-model="errorEndTime"
          color="brown"
          clearable
          :min="errorStartTime"
          :stack-label='$t("endTime")'
        />
        <q-btn id="selectErrorData" color="blue" icon='search' @click="deviceData()"/>
      </div>
    </q-page>
  </q-page>
</template>

<script>
  import {i18n} from '../../plugins/i18n'
  import {getDeviceFaultNumber} from '../../interface/getData'

  export default {
    name: "HomepageFaultDevice",
    props: {
      faultDeviceTime: {
        type: Object
      }
    },
    data() {
      return {
        errorStartTime: '',
        errorEndTime: '',
        series: [],
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
            text: i18n.t('faultTrend'),
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
      faultDeviceTime() {
        this.deviceData()
      }
    },

    methods: {
      async deviceData() {

        const data = {}
        data.createStartTime = this.errorStartTime
        data.createEndTime = this.errorEndTime
        const r = await getDeviceFaultNumber({...data})
        const deviceArray = r.data

        const _series = [];
        _series[0] = {name: i18n.t('errorStatusNumber'), data: []};
        for (var i = 0; i < deviceArray.length; i++) {
          _series[0].data.push({
            x: deviceArray[i].createDeviceDate,
            y: deviceArray[i].deviceFaultNumber
          });

        }
        this.series = _series;
      }

    }
  }
</script>

<style scoped>
  #errorStartTime, #errorEndTime {
    float: left;
  }

  #selectErrorData {
    top: 20px;
    float: left;
  }
</style>
