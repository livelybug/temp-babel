<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('uploadReport')}}</p>
    <q-table
      :data="report"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      :row-key="rowKey"

      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
      color="secondary"
      :selection="selections.selectMode"
      :selected.sync="selections.selected"
    >

      <div  id="turnPage"  slot="pagination"  slot-scope="props"   :props="props"  class="row flex-center q-py-sm" v-show="according" >
      <q-btn
        round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
        :disable="props.isFirstPage"
        @click="props.prevPage"

      />
          Page  <input  id="changeInput"  v-model="changePage"  type='number'  v-on:blur="getValue(props.pagesNumber)"   v-limitNum   />/   {{ props.pagesNumber }}&nbsp;&nbsp;
          <span style="color: red" class="message" v-if="!$v.changePage.integer">{{$t("positiveInteger")}}</span>
     <q-btn
        round dense size="sm" icon="redo" color="secondary"
        :disable="props.isLastPage"
        @click="props.nextPage"
      />

    </div>
     <template slot="top-left" slot-scope="props" :props="props">
       <div class="row" style="width: 100%">
       <!-- 设备Id -->
        <q-input id="deviceId" class="col-xs-12 col-lg-6" v-model="searches.deviceId" :stack-label='$t("deviceId")' /><br/>
        <p>  </p>
      <!-- 设备类型 -->
        <q-select
          chips
          class="col-xs-12 col-lg-6"
          color="amber"
          v-model="searches.deviceType"
          :options="searches.activationType"
          :stack-label='$t("activationType")'
          clearable
        />
        <!-- 上传模式-->
        <q-input id="uploadProcess" class="col-xs-12 col-lg-6" v-model="searches.uploadProcess" :stack-label='$t("uploadProcess")' /><br/>
        <!-- 上传结果-->
         <q-select
          chips
          class="col-xs-12 col-lg-6"
          color="amber"
          v-model="searches.results"
          :options="searches.uploadResults"
          :stack-label='$t("uploadResults")'
          clearable
        />
         <!-- 操作员-->
        <!-- <q-input id="operator"  v-model="searches.operator" :stack-label='$t("operator")' /><br/> -->
         <q-select
          chips
          class="col-xs-12 col-lg-6"
          color="amber"
          v-model="searches.operator"
          :options="searches.commons"
          :stack-label='$t("operator")'
          clearable
        />
        <!--<span>上传时间</span>-->
        <q-datetime
          id="uploadStartTime"
          class="col-xs-12 col-lg-6"
          type="datetime"
          v-model="searches.uploadStartTime"
          color="brown"
          clearable
          :stack-label='$t("uploadStartTime")'
        />
        <q-datetime
          id="uploadEndTime"
          class="col-xs-12 col-lg-6"
          type="datetime"
          v-model="searches.uploadEndTime"
          color="brown"
          clearable
          :min="searches.uploadEndTime"
          :stack-label='$t("uploadEndTime")'
        />&nbsp;&nbsp;

       </div>
         <p> </p>
        <q-btn color="blue" id="selectUploadReportButton" :label='$t("searches")' v-close-overlay  @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
       <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
       <q-btn id="selectUploadReportButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>
      </template>
   
    </q-table>

   
  </q-page>
</template>

<style>
</style>

<script>
import { getUploadReportNumber,getUploadReport,getProductNumber,getProduct ,getCommonNumber,getCommons} from '../interface/getData'
import { notifyErr, notifyOk } from '#/libs/notify'
import { i18n } from '../plugins/i18n'
import { integer, maxValue, minValue, maxLength, minLength, required } from 'vuelidate/lib/validators'
import { checkHttp } from '../libs/utils'
import { pageUrls, requestUrls } from '../util/env'
import { UrlTest } from '../util/constants'
import { getAuth } from '../libs/utils'
import { helpers, numeric } from 'vuelidate/lib/validators'
import limitNum from '../libs/onlyNum'

export default {
  name: 'uploadReport',

  data () {
    return {
      rowKey: 'id',
      report: [],
      columns: [],
      serverPagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10
      },
      loading: false,
      filter: '',
      searches: {
        activationType: [],
        uploadResults:[],
        commons: []
      },
      visibleColumns: [],

      selections: {
        selectMode: 'none',
        selected: []
      },
      changePage: 1,
     
      according: true
    }
  },
  validations () {
    return {
     

      changePage: {
        integer,
        // [this.valName]: maxValue(this.total),
        minValue: minValue(1)
        // maxValue:maxValue(6),
        // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),

      },
    }
  },

  async beforeMount () {
    const adminColLabels = {
      deviceId: i18n.t('deviceId'),
      deviceType: i18n.t('activationType'),
      address: i18n.t('gpsAddress'),
      uploadProcess: i18n.t('uploadProcess'),
      uploadTime: i18n.t('uploadTime'),
      uploadResults: i18n.t('uploadResults'),
      operator: i18n.t('operator'),
      resultsDescription: i18n.t('resultsDescription')
    }
    //查询所有设备类型
    const data1 = {}
    const productNum = await getProductNumber({...data1});
    const productNumber ={};
    productNumber.size=productNum.data;
    const product = await getProduct({...productNumber});

    //获取外部人员账号
    const commonNum = await getCommonNumber({...data1});
    const commonNumber ={};
    commonNumber.size=commonNum.data;
    const common = await getCommons({...commonNumber});

    if(await this.loadTbData() === false) return;
    if(await this.getProductValue(product) === false) return;
    if(await this.getCommonValue(common) === false) return;
    this.deleteRow2 = true
    const anAdmin = this.report[0]
    this.columns = Object.keys(anAdmin).filter(x => adminColLabels[x]).map(x => ({
      name: x,
      required: false, // 是否在初始页面显示此字段
      label: adminColLabels[x],
      field: x,
      align: 'center',
      sortable: true
    }))

    this.visibleColumns = Object.keys(adminColLabels)
  },



  directives: {
    limitNum
  },
  methods: {
    getValue (a) {
      // 进行验证
      if (eval(this.changePage) <= eval(a) && this.changePage != 0 && eval(this.changePage) >= eval(1)) {
        this.serverPagination.page = parseInt(this.changePage)
        this.request({
          pagination: this.serverPagination,
          filter: this.filter
        })
      } else {
        notifyErr(i18n.t('pageIndexOut'))
      }
    },
    async loadTbData (page, rowsNumber, sort, sortValue, searches) {
      
      const data = {}
      if (page) { data.page = page }
      if (rowsNumber) {
        this.according = true
        data.size = rowsNumber
      } else if (rowsNumber == '0') {
        this.according = false
        data.size = this.serverPagination.rowsNumber
      }
      if (sort && sortValue) { data.sort = 'DESC' } else { data.sort = 'ASC' }
      if (sortValue) { data.sortValue = sortValue }
      if(this.searches.deviceId){data.deviceId = this.searches.deviceId}
      if(this.searches.deviceType){data.deviceType = this.searches.deviceType}
      if(this.searches.uploadProcess){data.uploadProcess = this.searches.uploadProcess}
      if(this.searches.results){data.uploadResults = this.searches.results}
      if(this.searches.operator){data.operator = this.searches.operator}

      if (this.searches.uploadStartTime && this.searches.uploadEndTime) {
        data.uploadStartTime = this.searches.uploadStartTime
        data.uploadEndTime = this.searches.uploadEndTime
      }
     
      const a = await getUploadReportNumber({ ...data })
      this.serverPagination.rowsNumber = a.data

  
      const r = await getUploadReport({ ...data })
   
      if (r.status && checkHttp(r.status)) {
        this.report = r.data
        this.report = this.report.map(x => ({ ...x })) // 扁平化对象
        return true
      } else { return false }
    },
 //获取产品名称
      async getProductValue(product) {
      
        for (let values of product.data){
          let productName = values.name;
          this.searches.activationType.push({
            label:productName,
            value:productName
          })
        }
        let resData=[{isSuccType: i18n.t('successful'),isSuccValue:true},{isSuccType: i18n.t('failure'),isSuccValue:false}]

        for (let v of resData){
          let keyData = v.isSuccType;
          let valueData = v.isSuccValue;
          this.searches.uploadResults.push({
            label:keyData,
            value:valueData
          })
        }

      },
      getCommonValue(common){
     
        for (let values of common.data){
          let commonName = values.commonUserLoginName;
          this.searches.commons.push({
            label:commonName,
            value:commonName
          })
        }
      },

    async request ({ pagination }) {
      // 我们将QTable设置为“加载”状态

      this.loading = true

      // 我们根据收到的分页和过滤器来执行服务器数据提取
      if(pagination.rowsPerPage == 0 && this.serverPagination.rowsNumber>1000){
        notifyErr(i18n.t('dataNumberMoreThanOneThousand'))
        this.loading = false
        return
      }
      const paginationData = await this.loadTbData(pagination.page - 1, pagination.rowsPerPage, pagination.descending, pagination.sortBy, this.searches)
      this.serverPagination = pagination
      this.serverPagination.rowsNumber = pagination.rowsNumber
     
      this.changePage = pagination.page
      this.loading = false
      this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
    },
    //重置
    async Searches() {
      this.searches.deviceId = '';
      this.searches.deviceType = '';
      this.searches.uploadProcess = '';
      this.searches.results = '';
      this.searches.operator = '';
      this.searches.uploadStartTime = '';
      this.searches.uploadEndTime = '';
    },
    mounted () {
      // 一旦挂载，我们需要触发初始服务器数据获取
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    }

  }

}
</script>
<style>
#changeInput{
  text-align:center;
  width:20%;
}

#turnPage{
  width:200px; height:40px
}
#selectUploadReportButton{
  top: 10px;
  width: 100px;
  height: 40px;
}

</style>
