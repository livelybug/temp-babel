
<template>

  <q-page padding class="docs-table">
  <q-table
    :data="devices"
    :columns="columns"
    :filter="filter"
    :visible-columns="visibleColumns"
    :row-key="rowKey"

    color="secondary"

    :hide-header=HeaderAndEnd
    :hide-bottom=HeaderAndEnd

  >
    <template slot="top" slot-scope="props">
      <div id="addDevicesDate">
        <q-uploader
          color="secondary"
          :url="url"
          :url-factory="readFile"
          :stack-label='$t("addDevices")'
          extensions=".csv"
          :hide-upload-progress=true
          :auto-expand=true
          @remove:cancel="remove"
          method="post"/>

        <q-progress
          :percentage="progress"
          v-show="display"
          :animate="true"
          stripe animate
          color="secondary"/>
      </div>

    </template>

  </q-table>

    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <q-list-header>{{$t("errorInfo")}}</q-list-header>
        <q-item v-for="(item, index) in  AddErrorInfo" :key="`${index}`" v-close-overlay>
          <q-item-main>
            <q-item-tile label>{{item}}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-btn color="red" v-close-overlay :label='$t("confirm")'/>
      </div>
    </q-modal>
  </q-page>

</template>

<script>
import { addDevices } from '#/interface/getData'
import { checkHttp } from '../libs/utils'
import csv from 'csvtojson'
import { i18n } from '../plugins/i18n'
import { httpErrHdl } from '../libs/utils'
import { notifyOk, notifyErr } from '#/libs/notify'

export default {
  data () {
    return {
      url: '',
      rowKey: 'deviceId',
      addDevices: [],
      devices: [],
      columns: [],
      serverPagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      loading: false,
      filter: '',
      visibleColumns: [],
      changePage: 1,

      HeaderAndEnd: '',

      minimizedModal: false,
      AddErrorInfo: [],
      progress: 0,
      display: false,
      file: ''
    }
  },
  async beforeMount () {
    
    const adminColLabels = {
      deviceId: i18n.t('deviceId'),
      deviceName: i18n.t('deviceName'),
      errorInfo: i18n.t('errorInfo')
    }

    this.columns = [

      { name: 'deviceId', label: i18n.t('deviceId'), field: 'deviceId', sortable: true },
      { name: 'deviceName', label: i18n.t('deviceName'), field: 'deviceName', sortable: true },
      { name: 'errorInfo', label: i18n.t('errorInfo'), field: 'errorInfo', sortable: true }

    ]
    
    this.visibleColumns = Object.keys(adminColLabels)
   

    this.HeaderAndEnd = true
  },

  methods: {
    async readFile (file) {
      this.display = true
      this.devices = []
      this.HeaderAndEnd = true
      let reader = new FileReader()
      reader.readAsText(file)
      reader.parent = this
      reader.onload = async function (e) {
        e.loaded
        const data = e.target.result
      
        const jsonArray = await csv().fromString(data)
        
        const dv = await addDevices(jsonArray)
       
        if (dv.status == 400) {
          this.parent.minimizedModal = true
          this.parent.AddErrorInfo = dv.data
          this.parent.progress = 80
          return
        }
       
        const deviceData = dv.data
        if (deviceData.length > 0) {
          this.parent.HeaderAndEnd = false
        }
        this.parent.addDevices = dv.data
        this.parent.serverPagination.rowsNumber = deviceData.length
        
        this.parent.serverPagination.rowsPerPage = deviceData.length
       
        this.parent.devices = deviceData.slice(0, this.parent.serverPagination.rowsPerPage)

    
        if (dv.status && checkHttp(dv.status)) {
          this.parent.progress = 100
          this.parent.display = false
          return true
        } else {
          this.parent.progress = 100
          this.parent.display = false
          return false
          // return notifyErr(i18n.t('saveFailed'))
        }
      }
    },
    async remove () {
      this.devices = []
      this.progress = 0
      this.HeaderAndEnd = true
      this.display = false
    }

  }

}
</script>

<style scoped>
  #addDevicesDate{
    width: 100%;
  }
</style>
