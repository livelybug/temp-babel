<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('deviceActivations')}}</p>
    <div class='inputDiv row' style="width: 100%">
      <q-input id="activationNum" class="col-xs-12 col-lg-6" type="number" oninput="if(value>10000)value=10000;if(value<1)value=''" v-model="aData.activationNum"
               :stack-label='$t("activationNum")' @blur="$v.aData.activationNum.$touch"/>
      <!--<span style="color: red" class="message"
            v-if="!$v.aData.activationNum.minValue">{{$t("activationNumValue")}}</span>
      <span style="color: red" class="message"
            v-if="!$v.aData.activationNum.integer">{{$t("activationNumotNull")}}</span>
      <span style="color: red" class="message"
            v-if="!$v.aData.activationNum.required">{{$t("activationNumotNull")}}</span>
      <span style="color: red" class="message"
            v-if="!$v.aData.activationNum.maxValue">{{$t("activationNumValue")}}</span>-->
      <q-select
        chips
        color="amber"
        class="col-xs-12 col-lg-6"
        v-model="aData.activationType"
        :options="addActivA.options"
        :stack-label='$t("activationType")'
        @blur="$v.aData.activationType.$touch"
      />
      <!--<span style="color: red" class="message" v-if="$v.aData.activationType.$dirty && !$v.aData.activationType.required">{{$t("deviceNameNotEmpty")}}</span>-->
    </div>
    <p></p>
    <q-btn color="blue" style="width: 100px" @click="addActivationData(aData)">{{$t("append")}}</q-btn> &nbsp;
    <div class='btnDiv'>
      <q-btn color="blue" style="width: 100px" @click="loadTbData()">{{$t("toViewActivationList")}}</q-btn>
      <p></p>
    </div>
    <q-table
      :data="activtions"
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

      <div id="turnPage" slot="pagination" slot-scope="props" :props="props" class="row flex-center q-py-sm"
           v-show="according">
        <q-btn
          round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
          :disable="props.isFirstPage"
          @click="props.prevPage"

        />
        Page <input id="changeInput" v-model="changePage" type='number' v-on:blur="getValue(props.pagesNumber)"
                    v-limitNum/>/ {{ props.pagesNumber }}&nbsp;&nbsp;
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
        <q-input id="deviceId" class="col-xs-12 col-lg-6" v-model="searches.deviceId" :stack-label='$t("deviceId")'/>
        <!-- 设备类型 -->
        <!-- <q-input id="deviceType"  v-model="searches.deviceType" :stack-label='$t("activationType")' /><br/> -->
        <q-select
          chips
          class="col-xs-12 col-lg-6"
          color="amber"
          v-model="searches.deviceType"
          :options="searches.productOp"
          :stack-label='$t("activationType")'
          clearable
          @blur="$v.aData.activationType.$touch"
        />

        <!--<span>创建时间:</span>-->
        <q-datetime
          id="createStartTime"
          class="col-xs-12 col-lg-6"
          type="datetime"
          v-model="searches.createStartTime"
          color="brown"
          clearable
          :stack-label='$t("createStartTime")'
        />
        <q-datetime
          id="createEndTime"
          class="col-xs-12 col-lg-6"
          type="datetime"
          v-model="searches.createEndTime"
          color="brown"
          clearable
          :min="searches.createStartTime"
          :stack-label='$t("createEndTime")'
        />
        </div>
        <p></p>
        <q-btn id="selectProductButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,changePage=1,serverPagination.page=1)"/>&nbsp;
        <q-btn id="selectProductButton" color="blue"  @click="download()">{{$t("chooseUpload")}}</q-btn>&nbsp;
        <q-btn id="selectProductButton" color="blue"  @click="allDownload()">{{$t("allUpload")}}</q-btn>
      </template>

      <template slot="top-right" slot-scope="props">
        <span id="styleDeviceActivationMent">
        <q-table-columns
          id="deviceActivationColumnLabel"
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :columns="columns"
        />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
        <q-btn flat class="on-right" icon="check_box" @click="modeSwitch=1"/>
        </span>
      </template>
    </q-table>
    <!-- <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("activationWillBeDeleted")}}</p>

        <q-btn color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal> -->
  </q-page>
</template>

<style>
</style>

<script>
  import {
    getActivationNumber,
    getActivation,
    addDeviceActivation,
    getProduct,
    getProductNumber,
    getAllDownLoadFile
  } from '../interface/getData'
  import {i18n} from '../plugins/i18n'
  import {checkHttp} from '../libs/utils'
  import {integer, maxValue, minValue, maxLength, minLength, required} from 'vuelidate/lib/validators'
  import limitNum from '../libs/onlyNum';
  import {notifyOk, notifyErr} from '#/libs/notify';
  import Papa from 'papaparse';

  export default {
    name: 'DeviceActivation',

    data() {
      return {
        rowKey: "deviceId",

        activtions: [],
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10,
        },
        loading: false,
        filter: '',
        searches: {
          productOp: [],
        },
        addActivA: {
          options: [],
        },
        visibleColumns: [],

        selections: {
          selectMode: "none",
          selected: [],
        },
        changePage: 1,
        minimizedModal: false,
        aData: {
          activationNum: '1',
          activationType: '',
        },
        according: true,
      };


    },
    validations() {

      return {
        changePage: {
          integer,
          minValue: minValue(1),
        },
        aData: {
          activationType: {
            required
          },
          activationNum: {
            required,
            integer,
            minValue: minValue(1),
            maxValue: maxValue(10000)
          }
        },
        searches: {
          deviceType: {
            required
          }
        }

      }
    },


    async beforeMount() {
      const adminColLabels = {
        deviceId: i18n.t('deviceId'),
        devicePassword: i18n.t('devicePassword'),
        deviceType: i18n.t('activationType'),
        createDate: i18n.t('createDate'),
      };
      const data1 = {}
      const productNum = await getProductNumber({...data1});
      const productNumber = {};
      productNumber.size = productNum.data;
      const product = await getProduct({...productNumber});
      if (await this.loadTbData() === false) return;
      if (await this.getProductValue(product) === false) return;
      this.deleteRow2 = true;
      const anDevices = {deviceId: '1', devicePassword: '1', deviceType: '1', createDate: '1'}
      this.columns = Object.keys(anDevices).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false,  // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true,
      }));

      this.visibleColumns = Object.keys(adminColLabels);


    },
    computed: {
      modeSwitch: {
        get: function () {

        },
        set: function (v) {
          this.selections.selectable = !this.selections.selectable;
          this.selections.selected = [];
          if (this.selections.selectable) this.selections.selectMode = "multiple";
          else this.selections.selectMode = "none";
        }
      },


    },

    directives: {
      limitNum
    },

    methods: {
      getValue(a) {
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
      async loadTbData(page, rowsNumber, sort, sortValue, searches) {

        const data = {}
        if (page) {
          data.page = page
        }
        if (rowsNumber) {
          this.according = true
          data.size = rowsNumber
        } else if (rowsNumber == "0") {
          this.according = false
          data.size = this.serverPagination.rowsNumber
        }
        if (sort && sortValue) {
          data.sort = "DESC"
        } else {
          data.sort = "ASC"
        }
        if (sortValue) {
          data.sortValue = sortValue
        }

        if (this.searches.deviceId) {
          data.deviceId = this.searches.deviceId
        }
        if (this.searches.deviceType) {
          data.deviceType = this.searches.deviceType
        }
        if (this.searches.createStartTime && this.searches.createEndTime) {
          data.createStartTime = this.searches.createStartTime
          data.createEndTime = this.searches.createEndTime
        }


        //this.changePage=1
        const a = await getActivationNumber({...data})
        this.serverPagination.rowsNumber = a.data

        const r = await getActivation({...data});
        if (r.status && checkHttp(r.status)) {
          this.activtions = r.data;
          this.activtions = this.activtions.map(x => ({...x})); //扁平化对象
          return true;
        } else
          return false;
      },

      async request({pagination}) {
        // 我们将QTable设置为“加载”状态

        this.loading = true

        // 我们根据收到的分页和过滤器来执行服务器数据提取
        if (pagination.rowsPerPage == 0 && this.serverPagination.rowsNumber > 1000) {
          notifyErr(i18n.t('dataNumberMoreThanOneThousand'))
          this.loading = false
          return
        }
        //let paginationData = await this.loadTbData(pagination.page-1,pagination.rowsPerPage)
        const paginationData = await this.loadTbData(pagination.page - 1, pagination.rowsPerPage, pagination.descending, pagination.sortBy, this.searches);
        this.serverPagination = pagination
        this.serverPagination.rowsNumber = pagination.rowsNumber
        this.changePage = pagination.page
        this.loading = false
        this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
      },
      deleteRow() {
        this.minimizedModal = true;
      },
      //获取产品名称
      async getProductValue(product) {
        for (let values of product.data) {
          let productName = values.name;
          this.addActivA.options.push({
            label: productName,
            value: productName
          }),
            this.searches.productOp.push({
              label: productName,
              value: productName
            })
        }

      },

      async addActivationData(data) {

        if (this.$v.aData.activationType.$error || this.$v.aData.activationNum.$error) {
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }

        const activationData = {};
        activationData.deviceType = data.activationType;
        activationData.number = parseInt(data.activationNum);


        const rv = await addDeviceActivation(activationData)

        if (rv.status && checkHttp(rv.status)) {
          return true
        } else {
          return false
        }

      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      download() {

        if (this.selections.selected.length < 1) {
          notifyErr(i18n.t('pleaseSelectData'))
          return
        }
        const filterVal = ['deviceId', 'password', 'deviceType'];
        const data = this.formatJson(filterVal, this.selections.selected);
        data.unshift(filterVal)

        var csv = Papa.unparse(data);

        //定义文件内容，类型必须为Blob 否则createObjectURL会报错
        let content = new Blob([csv]);
        //生成url对象
        let urlObject = window.URL || window.webkitURL || window;
        let url = urlObject.createObjectURL(content);
        //生成<a></a>DOM元素
        let el = document.createElement("a");
        //链接赋值
        el.href = url;
        el.download = i18n.t('activationDataFile') + '.csv';
        //必须点击否则不会下载
        el.click();
        //移除链接释放资源
        urlObject.revokeObjectURL(url);
      },
      async allDownload() {
        const a = await getAllDownLoadFile();

        //  var csv = Papa.unparse(a.data);

        //定义文件内容，类型必须为Blob 否则createObjectURL会报错
        let content = new Blob([a.data]);
        //生成url对象
        let urlObject = window.URL || window.webkitURL || window;
        let url = urlObject.createObjectURL(content);
        //生成<a></a>DOM元素
        let el = document.createElement("a");
        //链接赋值
        el.href = url;
        el.download = i18n.t('activationDataFile') + '.csv';
        //必须点击否则不会下载
        el.click();
        //移除链接释放资源
        urlObject.revokeObjectURL(url);
      }

    },

  }
</script>
<style>
  .btnDiv {
    display: inline;
  }

  #changeInput {
    text-align: center;
    width: 20%;
  }

  #turnPage {
    width: 200px;
    height: 40px
  }
  #selectProductButton{
    top: 10px;
    width: 100px;
    height: 40px;
  }
  #styleDeviceActivationMent{
    position: absolute;
    top: 90%;
    right: 2%
  }
  #deviceActivationColumnLabel{
    position: absolute;
    top: 20%;
    right: 100%
  }
  /*#deviceId {
    width: 100%;
  }*/
</style>
