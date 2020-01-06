<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('DeviceList')}}</p>
    <q-table
      :data="devices"
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
      :rows-per-page-options="$rowsPerPage"
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
          <!-- 设备ID -->
          <q-input id="deviceId" class="col-xs-12 col-lg-6" v-model="device.deviceId" :stack-label='$t("deviceId")'/>
          <p></p>
          <!-- 设备名称 -->
          <q-input id="deviceName" class="col-xs-12 col-lg-6" v-model="device.deviceName"
                   :stack-label='$t("deviceName")'/>
          <br/>

          <!-- 产品名称 -->
          <!--<q-input id="deviceType" class="col-xs-12 col-lg-6" v-model="device.deviceType" :stack-label='$t("deviceType")' /><br/>-->
          <q-select
            id="deviceType"
            class="col-xs-12 col-lg-6"
            :stack-label='$t("deviceType")'
            v-model="device.deviceType"
            :options="productList"
          />

          <!-- 项目名称 -->
          <q-input id="deviceProject" class="col-xs-12 col-lg-6" v-model="device.deviceProject"
                   :stack-label='$t("deviceProject")'/>
          <br/>
          <!-- 设备IMEI -->
          <q-input id="deviceImei" class="col-xs-12 col-lg-6" v-model="device.deviceImei"
                   :stack-label='$t("deviceImei")'/>
          <br/>
        </div>
        <p></p>
        <q-btn id="selectDeviceButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,device,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectDeviceButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>

      </template>

      <template slot="top-right" slot-scope="props">
        <span id="styleDeviceMent">
        <q-table-columns
          id="deviceColumnLabel"
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :columns="columns"
          :label="$t('displayColumn')"
        />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip>{{$t("toggleFullScreen")}}</q-tooltip>
        </q-btn>
        <q-btn flat class="on-right" icon="check_box" @click="modeSwitch=1">
          <q-tooltip>{{$t("multipleSelection")}}</q-tooltip>
        </q-btn>
          <q-btn color="negative" flat round class="on-right" icon="delete" @click="deleteRow"
                 v-show="selections.selected.length">
            <q-tooltip>{{$t("batchDelete")}}</q-tooltip>
          </q-btn>
          <!-- <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow"  v-show="selected.length==1"/> -->
        </span>
      </template>

      <!-- 自定义单元格 修改按键 -->
      <q-td slot="body-cell-deviceId" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"
               v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        {{ props.value }}
      </q-td>

      <!-- 自定义单元格  查看历史数据 -->
      <q-td slot="body-cell-historicalData" slot-scope="props" :props="props">
        <q-chip color="secondary">
          <q-btn id="control" flat class="on-center" @click="toViewHistorical(props)">{{$t("toViewValue")}}</q-btn>
        </q-chip>
      </q-td>
    </q-table>

    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("accountWillBeDeleted")}}</p>

        <q-btn id="sureDeleteDevice" color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal>
    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>

        <q-input v-model="editDevice.updateDevice.deviceName" @blur="$v.editDevice.updateDevice.deviceName.$touch"
                 :stack-label='$t("deviceName")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceName.required">{{$t("deviceNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceName.maxLength">{{$t("deviceNameNothan")}}</span>

        <q-select
          chips
          color="amber"
          v-model="editDevice.updateDevice.deviceType"
          :options="searches.options"
          :stack-label='$t("deviceType")'
        />

        <q-select
          chips
          color="amber"
          v-model="editDevice.updateDevice.deviceProject"
          :options="project.options"
          :stack-label='$t("deviceProject")'
        />
        <q-input v-model="editDevice.updateDevice.gpsAddress" @blur="$v.editDevice.updateDevice.gpsAddress.$touch"
                 :stack-label='$t("gpsAddress")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.gpsAddress.required">{{$t("gpsAddressNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.gpsAddress.gpsAddressLimit">{{$t("gpsAddressLimit")}}</span>

        <q-input v-model="editDevice.updateDevice.powerStatus" @blur="$v.editDevice.updateDevice.powerStatus.$touch"
                 :stack-label='$t("powerStatus")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.powerStatus.required">{{$t("powerStatusNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.powerStatus.powerStatusLimit">{{$t("powerStatusLimit")}}</span>

        <q-input type="number" v-model="editDevice.updateDevice.errorStatus"
                 @blur="$v.editDevice.updateDevice.errorStatus.$touch" :stack-label='$t("errorStatus")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.errorStatus.required">{{$t("errorStatusNotEmpty")}}</span>

        <q-input v-model="editDevice.updateDevice.errorInfo" @blur="$v.editDevice.updateDevice.errorInfo.$touch"
                 :stack-label='$t("errorInfo")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.errorInfo.required">{{$t("errorInfoNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.errorInfo.maxLength">{{$t("errorInfoNothan")}}</span>

        <q-select
          chips
          multiple
          color="amber"
          v-model="postSale.postSaleValue"
          :options="postSale.options"
          :stack-label='$t("postSale")'
        />
        <!--<q-input v-model="editDevice.updateDevice.deviceAdmin" :stack-label='$t("deviceAdmin")'   />-->
        <q-select
          chips
          multiple
          color="amber"
          v-model="postSale.deviceAdminValue"
          :options="postSale.options"
          :stack-label='$t("deviceAdmin")'
        />
        <q-input v-model="editDevice.updateDevice.deviceImei" @blur="$v.editDevice.updateDevice.deviceImei.$touch"
                 :stack-label='$t("deviceImei")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceImei.required">{{$t("deviceImeiNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceImei.maxLength">{{$t("deviceImeiNothan")}}</span>

        <q-input v-model="editDevice.updateDevice.deviceVersion" @blur="$v.editDevice.updateDevice.deviceVersion.$touch"
                 :stack-label='$t("deviceVersion")'/>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceVersion.required">{{$t("deviceVersionNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editDevice.updateDevice.deviceVersion.maxLength">{{$t("deviceVersionNothan")}}</span>
        <p></p>
        <q-btn id="updateDevice" color="blue" v-close-overlay @click="updateDeviceValue()">{{$t("updata")}}</q-btn>
        &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit">{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>

    <!-- 查看历史数据 -->
    <q-modal v-model="maximizedHistorical" maximized no-backdrop-dismiss>
      <div style="padding:5px">

        <p class="caption">{{$t("historicalData")}}</p>
        <q-table
          :data="deviceData"
          :columns="historicalColumns"
          :filter="filter"
          :visible-columns="historicalVisible"
          :row-key="rowKey"
          color="secondary"
          :pagination.sync="hisPagination"
          @request="requestHis"
          :rows-per-page-options="$rowsPerPage"
        >

          <div id="turnPage2" slot="pagination" slot-scope="props" :props="props" class="row flex-center q-py-sm"
               v-show="according">
            <q-btn
              round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
              :disable="props.isFirstPage"
              @click="props.prevPage"

            />
            Page <input id="changeInput" v-model="hisChangePage" type='number'
                        v-on:blur="getValueHistroy(props.pagesNumber)" v-limitNum/>/ {{ props.pagesNumber }}&nbsp;&nbsp;
            <span style="color: red" class="message" v-if="!$v.hisChangePage.integer">{{$t("positiveInteger")}}</span>
            <q-btn
              round dense size="sm" icon="redo" color="secondary"
              :disable="props.isLastPage"
              @click="props.nextPage"
            />

          </div>
          <template slot="top-left" slot-scope="props" :props="props">
            <div class="row" style="width: 100%">
              <q-input id="hisDeviceId" class="col-xs-12 col-lg-6" v-model="deviceHistroy.deviceId"
                       :stack-label='$t("deviceId")' :readonly="true"/>
              <q-input id="hisDeviceImei" class="col-xs-12 col-lg-6" v-model="deviceHistroy.deviceImei"
                       :stack-label='$t("deviceImei")' :readonly="true"/>
              <q-input id="hisDeviceVersion" class="col-xs-12 col-lg-6" v-model="deviceHistroy.deviceVersion"
                       :stack-label='$t("deviceVersion")' :readonly="true"/>
              <q-input id="hisPowerFalse" class="col-xs-12 col-lg-6" v-show="deviceHistroy.powerStatus == false"
                       :stack-label='$t("powerStatus")' :readonly="true" value='离线'/>
              <q-input id="hisPowerTrue" class="col-xs-12 col-lg-6" v-show="deviceHistroy.powerStatus == true"
                       :stack-label='$t("powerStatus")' :readonly="true" value='在线'/>
              <q-datetime
                id="hisStartTime"
                class="col-xs-12 col-lg-6"
                type="datetime"
                v-model="histroySearches.startTime"
                color="brown"
                clearable
                :stack-label='$t("startTime")'
              />
              <q-datetime
                id="hisEndTime"
                class="col-xs-12 col-lg-6"
                type="datetime"
                v-model="histroySearches.endTime"
                color="brown"
                clearable
                :min="histroySearches.startTime"
                :stack-label='$t("endTime")'
              />
            </div>
            <p></p>
            <q-btn id="selectHistroyButton" color="blue" :label='$t("searches")'
                   @click="loadHistoryDevice(0,hisPagination.rowsPerPage,hisPagination.descending,hisPagination.sortBy,histroySearches,changePage=1,hisPagination.page=1)"/>

          </template>

          <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
            <q-td>
              <div id='dataTime' style="width:28%;height:40px;float:left;text-align:center;">
                <p></p>
                <p>{{props.row.historicalTime}}</p>
              </div>
              <div id='collapsible' style="width:71%;float:right">
                <q-collapsible>
                  <div>
                    <p>{{$t("bat_V")}} : {{props.row.bat_V}}</P>
                    <p>{{$t("capacity_Charge_All")}} : {{props.row.capacity_Charge_All}}</P>
                    <p>{{$t("capacity_Charge_Day")}} : {{props.row.capacity_Charge_Day}}</P>
                    <p>{{$t("capacity_Discharge_All")}} : {{props.row.capacity_Discharge_All}}</P>
                    <p>{{$t("capacity_Discharge_Day")}} : {{props.row.capacity_Discharge_Day}}</P>
                    <p>{{$t("current_Discharge")}} : {{props.row.current_Discharge}}</P>
                    <p>{{$t("current_charge")}} : {{props.row.current_charge}}</P>
                    <p>{{$t("led_MOD")}} : {{props.row.led_MOD}}</P>
                    <p>{{$t("led_SW")}} : {{props.row.led_SW}}</P>
                    <p>{{$t("LED_PWM")}} : {{props.row.LED_PWM}}</P>
                    <p>{{$t("on_LINE")}} : {{props.row.on_LINE}}</P>
                    <p>{{$t("pv_V")}} : {{props.row.pv_V}}</P>
                    <p>{{$t("rssi")}} : {{props.row.rssi}}</P>
                    <p>{{$t("soc")}} : {{props.row.soc}}</P>
                  </div>
                </q-collapsible>
              </div>
            </q-td>
          </q-tr>
        </q-table>


        <p></P>
        <div id="historyGoBack">
          <q-btn color="blue" v-close-overlay :label='$t("goBack")' @click="hisGoBack"/>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
  import {
    getPermissions,
    getPermissionsNumber,
    deleteDevice,
    getDevices,
    getDevicesNumber,
    getProjectNumber,
    getProjects,
    updateDevice,
    getProductNumber,
    getProduct,
    getCommonNumber,
    getCommons,
    deviceDataInfo
  } from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import {i18n} from '../plugins/i18n'
  import {integer, maxValue, minValue, maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import {pageUrls, requestUrls} from "../util/env";
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import {helpers, numeric, or} from 'vuelidate/lib/validators'
  import limitNum from '../libs/onlyNum';

  export default {
    name: 'DeviceManage',

    data() {
      return {
        rowKey: "id",
        productList: [],
        devices: [],
        device: {},
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10,
        },
        loading: false,
        filter: '',
        searches: {
          permissions: [],
          options: [],
        },
        project: {
          permissions: [],
          options: [],
        },
        postSale: {
          postSaleValue: [],
          deviceAdminValue: [],
          options: [],
        },
        visibleColumns: [],

        selections: {
          selectMode: "none",
          selected: [],
        },
        changePage: 1,
        hisChangePage: 1,

        editDevice: {
          updateDevice: {
            postSales: [],
            newPostSales: [],
            commonAdmins: []
          },
          oldDevice: {},
          select: '',
          groupPermissions: [],
        },

        minimizedModal: false,
        minimizeEditModal: false,
        according: true,
        maximizedHistorical: false,
        historicalColumns: [],
        historicalVisible: [],
        deviceData: [],
        open: true,
        hisPagination: {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10,
        },
        deviceHistroy: {},
        histroySearches: {
          endTime: '',
          startTime: ''
        }
      };


    },
    validations() {

      return {
        /*searches:{
          group:{
            integer,
            minValue:minValue(1),
            maxValue:maxValue(9999)
          },
        },*/
        changePage: {
          integer,
          minValue: minValue(1),
          // maxValue:maxValue(6),
        },
        hisChangePage: {
          integer,
          minValue: minValue(1),
          // maxValue:maxValue(6),
        },
        editDevice: {
          updateDevice: {
            deviceName: {
              required,
              maxLength: helpers.regex('maxLength', /^[^ ]{1,128}$/)
            },
            gpsAddress: {
              required,
              gpsAddressLimit: helpers.regex('gpsAddressLimit', /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)
            },
            powerStatus: {
              required,
              powerStatusLimit: helpers.regex('powerStatusLimit', /^(true)|(false)$/)
            },
            errorStatus: {
              required
            },
            errorInfo: {
              required,
              maxLength: helpers.regex('maxLength', /^[^ ]{1,128}$/)
            },
            deviceImei: {
              required,
              maxLength: helpers.regex('maxLength', /^[^ ]{1,64}$/)
            },
            deviceVersion: {
              required,
              maxLength: helpers.regex('maxLength', /^[^ ]{1,32}$/)
            }


          }
        }


      }
    },


    async beforeMount() {
      const adminColLabels = {
        deviceId: i18n.t('deviceId'),
        deviceName: i18n.t('deviceName'),
        deviceType: i18n.t('deviceType'),
        deviceProject: i18n.t('deviceProject'),
        deviceImei: i18n.t('deviceImei'),
        errorInfo: i18n.t('errorInfo'),
        deviceVersion: i18n.t('deviceVersion'),
        historicalData: i18n.t('historicalData'),
        createDeviceDate: i18n.t('createDate'),
        updateDeviceDate: i18n.t('updateDate'),
      };
      const historicalColLabels = {
        historicalTime: i18n.t('historicalTime'),
        //dataPoint:i18n.t('dataPoint'),
      }


      if (await this.loadTbData() === false) return;
      this.deleteRow2 = true;
      const anAdmin = {...this.devices[0]};
      anAdmin.historicalData = "查看"
      this.columns = Object.keys(anAdmin).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false,  // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true,
      }));


      const displayInfor = ['deviceId', 'deviceName', 'deviceProject', 'deviceType', 'deviceVersion', 'historicalData'];

      //this.visibleColumns = Object.keys(adminColLabels);
      this.visibleColumns = displayInfor;
      const data1 = {}
      const productNum = await getProductNumber({...data1});
      const productNumber = {};
      productNumber.size = productNum.data;
      const product = await getProduct({...productNumber});

      if (product.status && checkHttp(product.status)) {
        product.data.map(x => {
          x.label = x.memoName;
          x.value = x.name
        });

        this.productList = product.data;
        // console.log(this.productList)
      }


      if (await this.getProductValue(product) === false) return;
      //获取项目名称
      if (await this.getProjectValue() === false) return;
      //获取售后名称
      if (await this.getPostSaleValue() === false) return;
      const groupNumber = await getPermissionsNumber();
      const data = {};
      data.size = groupNumber.data;
      const r = await getPermissions({...data});

      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.name;
          x.value = x.groupId
        });

        // this.editAdmin.groupPermissions = r.data;
      }

      this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage),

        this.historicalColumns = [

          {
            name: 'historicalTime',
            label: i18n.t('historicalTime'),
            align: 'left',
            field: 'historicalTime',
            sortable: true
          },
          {name: 'dataPoint', label: i18n.t('dataPoint'), align: 'left', field: 'dataPoint', sortable: true}

        ];
      this.historicalVisible = Object.keys(historicalColLabels);

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

      confirmDelete: {
        get: function () {

        },
        set: async function (v) {
          const data = this.selections.selected.map(x => x.id).toString();
          //const data = this.device.id;
          const r = await deleteDevice(data);

          if (r.status && checkHttp(r.status)) {
            this.selections.selected = [];
            //this.changePage=1;
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            })
          }
        }

      },

    },

    directives: {
      limitNum
    },
    methods: {
      getValue(a) {
        //进行验证

        if (eval(this.changePage) <= eval(a) && this.changePage != 0) {
          this.serverPagination.page = parseInt(this.changePage)

          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        } else {
          notifyErr(i18n.t('pageIndexOut'));
        }
      },
      async loadTbData(page, rowsNumber, sort, sortValue) {
        /*if (this.$v.searches.group.$error){
          this.$q.notify(i18n.t('permissionsIDInputError'))
          return
        }*/
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
        if (this.device.deviceId) {
          data.deviceId = this.device.deviceId
        }
        if (this.device.deviceName) {
          data.deviceName = this.device.deviceName
        }

        if (this.device.deviceType) {
          data.deviceType = this.device.deviceType;
        }
        if (this.device.deviceProject) {
          data.deviceProject = this.device.deviceProject
        }
        if (this.device.deviceImei) {
          data.deviceImei = this.device.deviceImei
        }


        //this.changePage=1
        const a = await getDevicesNumber({...data})
        this.serverPagination.rowsNumber = a.data


        const r = await getDevices({...data});

        if (r.status && checkHttp(r.status)) {
          this.devices = r.data;

          this.devices = this.devices.map(x => ({...x, deviceType: x.product.name, deviceProject: x.project.name})); //扁平化对象

          return true;
        } else
          return false;
      },


      //获取产品名称
      async getProductValue(product) {

        for (let values of product.data) {
          let productName = values.name;
          this.searches.options.push({
            label: productName,
            value: productName
          })
        }
      },

      //获取项目名称
      async getProjectValue() {

        const projectNum = await getProjectNumber();
        const projectNumber = {};
        projectNumber.size = projectNum.data;
        const project = await getProjects({...projectNumber});


        for (let values of project.data) {
          let projectName = values.name;
          this.project.options.push({
            label: projectName,
            value: projectName
          })
        }

      },

      //获取售后名称
      async getPostSaleValue() {

        const PostSaleNum = await getCommonNumber();
        const PostSaleNumber = {};
        PostSaleNumber.size = PostSaleNum.data;
        const postSale = await getCommons({...PostSaleNumber});

        for (let values of postSale.data) {
          const postSaleName = values.commonUserName;
          const postSaleLoginName = values.commonUserLoginName;
          this.postSale.options.push({
            label: postSaleName,
            value: postSaleLoginName
          })
        }
      },


      deleteRow() {
        this.minimizedModal = true;
      },
      editRow(v) {

        this.minimizeEditModal = true;
        let data = v.row;


        this.editDevice.updateDevice = {...data};

        this.postSale.postSaleValue = [];
        for (const value of this.editDevice.updateDevice.postSales) {
          this.postSale.postSaleValue.push(value.commonUserLoginName)
        }

        this.postSale.deviceAdminValue = [];
        for (const value of this.editDevice.updateDevice.commonAdmins) {
          this.postSale.deviceAdminValue.push(value.commonUserLoginName)
        }

      },
      toggleFullscreen() {
        this.$q.fullscreen.toggle()
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
      //取消
      async cancelEdit() {

      },
      //重置
      async Searches() {
        this.device.deviceId = '';
        this.device.deviceName = '';
        this.device.deviceType = '';
        this.device.deviceProject = '';
        this.device.deviceImei = '';
      },
      // 修改
      async updateDeviceValue() {

        if (this.$v.editDevice.updateDevice.deviceName.$error || this.$v.editDevice.updateDevice.gpsAddress.$error || this.$v.editDevice.updateDevice.powerStatus.$error || this.$v.editDevice.updateDevice.errorStatus.$error || this.$v.editDevice.updateDevice.errorInfo.$error || this.$v.editDevice.updateDevice.deviceImei.$error || this.$v.editDevice.updateDevice.deviceVersion.$error) {
          this.$q.notify(i18n.t('pleaseEnterTheCorrectValue'));
          return
        }


        const data = {}
        data.id = this.editDevice.updateDevice.id;

        if (this.editDevice.updateDevice.deviceName) {
          data.deviceName = this.editDevice.updateDevice.deviceName
        }
        if (this.editDevice.updateDevice.deviceType) {
          data.deviceType = this.editDevice.updateDevice.deviceType
        }
        if (this.editDevice.updateDevice.deviceProject) {
          data.projectName = this.editDevice.updateDevice.deviceProject
        }
        if (this.editDevice.updateDevice.gpsAddress) {
          data.gpsAddress = this.editDevice.updateDevice.gpsAddress
        }
        if (this.editDevice.updateDevice.powerStatus) {
          data.powerStatus = this.editDevice.updateDevice.powerStatus
        }
        if (this.editDevice.updateDevice.errorStatus) {
          data.errorStatus = this.editDevice.updateDevice.errorStatus
        }
        if (this.editDevice.updateDevice.errorInfo) {
          data.errorInfo = this.editDevice.updateDevice.errorInfo
        }
        if (this.postSale.postSaleValue) {
          data.postSale = this.postSale.postSaleValue;

        }
        if (this.postSale.deviceAdminValue) {
          data.deviceAdmin = this.postSale.deviceAdminValue
        }
        console.log(data.deviceAdmin)
        if (this.editDevice.updateDevice.deviceImei) {
          data.deviceImei = this.editDevice.updateDevice.deviceImei
        }
        if (this.editDevice.updateDevice.deviceVersion) {
          data.deviceVersion = this.editDevice.updateDevice.deviceVersion
        }
        console.log(data)
        const r1 = await updateDevice({...data});

        this.request({
          pagination: this.serverPagination,
          filter: this.filter
        })
        this.postSale.postSaleValue = [];
        this.postSale.deviceAdminValue = [];

      },
      mounted() {
        // 一旦挂载，我们需要触发初始服务器数据获取
        this.request({
          pagination: this.serverPagination,
          filter: this.filter
        })
      },
      //查看历史数据
      async toViewHistorical(v) {
        this.maximizedHistorical = true;

        let data = {}
        data.deviceId = v.row.deviceId
        data.deviceType = v.row.deviceType
        this.deviceHistroy = data
        this.deviceHistroy.deviceImei = v.row.deviceImei
        this.deviceHistroy.deviceVersion = v.row.deviceVersion
        this.deviceHistroy.powerStatus = v.row.powerStatus
        data.size = 5

        const r1 = await deviceDataInfo({...data});
        this.hisPagination.rowsNumber = r1.data.totalElements

        this.deviceData = r1.data.content
        this.deviceData = this.deviceData.map(x => ({...x, historicalTime: x.datetime})); //扁平化对象

        console.log(data)
        console.log(v.row)
        console.log(this.deviceHistroy)
        console.log(r1)
        console.log(this.deviceData)


      },
      async requestHis({pagination}) {
        // 我们将QTable设置为“加载”状态

        this.loading = true

        // 我们根据收到的分页和过滤器来执行服务器数据提取

        const data = {}

        const paginationData = await this.loadHistoryDevice(pagination.page - 1, pagination.rowsPerPage, pagination.descending, pagination.sortBy);
        this.hisPagination = pagination
        this.hisPagination.rowsNumber = pagination.rowsNumber

        this.hisChangePage = pagination.page
        this.loading = false
        this.total = Math.ceil(this.hisPagination.rowsNumber / this.hisPagination.rowsPerPage)
      },
      getValueHistroy(a) {
        //进行验证

        if (eval(this.hisChangePage) <= eval(a) && this.hisChangePage != 0) {
          this.hisPagination.page = parseInt(this.hisChangePage)

          this.requestHis({
            pagination: this.hisPagination,
            filter: this.filter
          })
        } else {
          notifyErr(i18n.t('pageIndexOut'));
        }
      },
      async loadHistoryDevice(page, rowsNumber, sort, sortValue) {
        const data = {}
        if (page) {
          data.page = page
        }
        if (rowsNumber) {
          this.according = true
          data.size = rowsNumber
        } else if (rowsNumber == "0") {
          this.according = false
          data.size = this.hisPagination.rowsNumber
        }
        if ((!sort) && sortValue) {
          data.sort = "ASC"
        } else {
          data.sort = "DESC"
        }
        if (sortValue) {
          data.sortValue = sortValue
        }
        if (this.histroySearches.startTime && this.histroySearches.endTime) {
          data.startTime = this.histroySearches.startTime
          data.endTime = this.histroySearches.endTime
        }

        data.deviceId = this.deviceHistroy.deviceId
        data.deviceType = this.deviceHistroy.deviceType
        const r1 = await deviceDataInfo({...data});
        this.hisPagination.rowsNumber = r1.data.totalElements

        if (r1.status && checkHttp(r1.status)) {
          this.deviceData = r1.data.content
          this.deviceData = this.deviceData.map(x => ({...x, historicalTime: x.datetime})); //扁平化对象

          return true;
        } else
          return false;


      },
      hisGoBack() {
        this.hisChangePage = 1
        this.histroySearches.startTime = ''
        this.histroySearches.endTime = ''
        this.deviceData = []
        this.hisPagination = {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10,
        }
      }


    },

  }
</script>
<style>
  #changeInput {
    text-align: center;
    width: 20%;
  }

  #turnPage {
    width: 200px;
    height: 40px
  }

  #turnPage2 {
    width: 180px;
    height: 40px
  }

  #historyGoBack {
    text-align: center;
  }

  #selectDeviceButton {
    top: 10px;
    width: 100px;
    height: 40px;
  }

  #styleDeviceMent {
    position: absolute;
    top: 90%;
    right: 2%
  }

  #deviceColumnLabel {
    position: absolute;
    top: 20%;
    right: 100%
  }

  #selectHistroyButton {
    top: 10px;
    width: 100px;
    height: 40px;
  }
</style>
