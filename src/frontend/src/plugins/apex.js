import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.component('apexchart', VueApexCharts)
}
