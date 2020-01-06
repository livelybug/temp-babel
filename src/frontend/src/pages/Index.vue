<template>
  <q-page padding class="container">
    <q-page style="min-height: 70px;">
      <div>
        <q-input id="deviceNumber" v-model="deviceNumber" :float-label='$t("deviceNumber")' :readonly="true"/>
        <q-input id="onlineDeviceNumber" v-model="onlineDeviceNumber" :float-label='$t("onlineDeviceNumber")'
                 :readonly="true"/>
        <q-input id="productNumber" v-model="productNumber" :float-label='$t("productNumber")' :readonly="true"/>
        <q-input id="projectNumber" v-model="projectNumber" :float-label='$t("projectNumber")' :readonly="true"/>
      </div>

    </q-page>
    <div>
    <homepage-chart :productTime="productTime"></homepage-chart>
    <homepage-sale-data :saleDateTime = "saleDateTime"></homepage-sale-data>
    <homepage-fault-device :faultDeviceTime="faultDeviceTime"></homepage-fault-device>
    </div>
  </q-page>
</template>


<script>
  import {
    getDevicesNumber,
    getProjectNumber,
    getProductNumber,
    getWorkOrderNumber,
    getDeviceInfoNumber,
    getDeviceFaultNumber,
    getWorkOrderListNumber
  } from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import HomepageChart from './components/HomepageChart'
  import HomepageFaultDevice from './components/HomepageFaultDevice'
  import HomepageSaleData from "./components/HomepageSaleData";

  export default {
    name: 'PageIndex',
    components: {
      HomepageSaleData,
      HomepageChart,
      HomepageFaultDevice
    },
    data() {
      return {
        deviceNumber: 0,
        onlineDeviceNumber: 0,
        productNumber: 0,
        projectNumber: 0,
        errorChart: null,
        workOrderChart: null,
        productStartTime: '',
        productEndTime: '',
        errorStartTime: '',
        errorEndTime: '',
        workOrderStartTime: '',
        workOrderEndTime: '',
        productTime: {},
        faultDeviceTime: {},
        saleDateTime:{},
      }
    },
    mounted() {
      this.deviceData();
      this.faultDevice();
      this.saleDate();
    },

    async beforeMount() {
      const devNumber = await getDevicesNumber()
      this.deviceNumber = devNumber.data
      const data = {}
      data.powerStatus = true
      const onlineNumber = await getDevicesNumber({...data})
      this.onlineDeviceNumber = onlineNumber.data
      const projNumber = await getProjectNumber()
      this.projectNumber = projNumber.data
      const prodNumber = await getProductNumber()
      this.productNumber = prodNumber.data

    },

    methods: {
      deviceData() {
        this.productTime = {start: this.productStartTime, end: this.productEndTime};
      },
      faultDevice() {
        this.faultDeviceTime = {start: this.errorStartTime, end: this.errorEndTime};
      },
      saleDate(){
        this.saleDateTime = {start: this.workOrderStartTime, end: this.workOrderEndTime};
      },

    }
  }
</script>

<style>
  #deviceNumber, #onlineDeviceNumber, #productNumber, #projectNumber {
    width: 25%;
    float: left;
  }

  #deviceNumber {
    color: blue;
  }

  #onlineDeviceNumber {
    color: green;
  }

  #productNumber {
    color: orange
  }

  #projectNumber {
    color: red
  }




</style>
