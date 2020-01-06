<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('errorStatusList')}}</p>
    <q-table
      :data="errorStatuss"
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

      <div  id="turnPage"  slot="pagination"  slot-scope="props"   :props="props"  class="row flex-center q-py-sm" v-show="according" >
        <q-btn
          round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
          :disable="props.isFirstPage"
          @click="props.prevPage"

        />
        Page  <input  id="changeInput"  v-model="changePage"  type='number'  v-on:blur="getValue(props.pagesNumber)"   v-limitNum   />/   {{ props.pagesNumber }}&nbsp;&nbsp;
        <!--<span style="color: red" class="message" v-if="!$v.changePage.integer">{{$t("positiveInteger")}}</span>-->
        <q-btn
          round dense size="sm" icon="redo" color="secondary"
          :disable="props.isLastPage"
          @click="props.nextPage"
        />

      </div>
      <template slot="top" slot-scope="props" :props="props">
        <div class="row" style="width: 100%">
        <!--填写查询的状态码-->
        <q-input  id="deleteErrorStatus" class="col-xs-12 col-lg-6" type="number" oninput="if(value>255)value=255;if(value<0)value=''" v-model="searches.errorStatus"  :stack-label='$t("errorStatus")' />
        <!--<span style="color: red" class="message" v-if="!$v.searches.errorStatus.maxLength">{{$t("errorStatusMustBeNumber")}}</span>-->
        </div>
        <q-btn id="selectErrorStatusButton" color="blue" :label='$t("searches")' v-close-overlay  @click="obtainHolidays(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <p style="width: 100%; height: 30px;"></p>

     <!-- </template>

      <template slot="top-right" slot-scope="props">-->
        <div id="styleAdjustment">
        <q-table-columns
          id="columnLabel"
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
        <q-btn flat class="on-right" icon="check_box" @click="modeSwitch=1" >
          <q-tooltip>{{$t("multipleSelection")}}</q-tooltip>
        </q-btn>

        <q-btn color="negative" flat round class="on-right" icon="delete" @click="deleteRow"  v-show="selections.selected.length">
          <q-tooltip>{{$t("batchDelete")}}</q-tooltip>
        </q-btn>
        </div>
      </template>

      <q-td slot="body-cell-errorStatus" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"  v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>{{ props.value }}
      </q-td>

    </q-table>

    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>
        <q-input v-model="editErrorStatus.updateErrorStatus.errorStatus" :stack-label='$t("errorState")'    :readonly="true"  />
        <q-input v-model="editErrorStatus.updateErrorStatus.errorInfo" @blur="$v.editErrorStatus.updateErrorStatus.errorInfo.$touch" :stack-label='$t("errorInfo")' />
        <span style="color: red" class="message" v-if="!$v.editErrorStatus.updateErrorStatus.errorInfo.required">{{$t("patternNotEmpty")}}</span>
        <p> </p>
        <q-btn  color="blue" v-close-overlay @click="upErrorCode" >{{$t("updata")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit" >{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>
    <!-- 调用删除组件 -->
    <confirm-modal :minimizedModal="minimizedModal" @listenToChildEvent="confirmDeleteModel"></confirm-modal>

  </q-page>
</template>

<style>
</style>

<script>
  import {deleteErrorCode, getErrorStatusList, updateErrorCode} from '../interface/getData'
  import { i18n } from '../plugins/i18n'
  import { checkHttp } from '../libs/utils'
  import { notifyErr, notifyOk } from '#/libs/notify'
  import limitNum from '../libs/onlyNum';
  import { date } from 'quasar';
  import {required} from 'vuelidate/lib/validators';
  import {helpers} from 'vuelidate/lib/validators';
  import confirmation from '../pages/components/Confirmation.vue'
  export default {
    name: 'ErrorStatusManage',

    data() {
      return {
        rowKey: 'id',
        errorStatuss:[],
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10
        },
        changePage:1,
        loading: false,
        filter: '',
        visibleColumns: [],
        selections: {
          selectMode: 'none',
          selected: []
        },
        searches: {

        },
        editErrorStatus: {
          updateErrorStatus: {
            errorInfo:''
          },
          oldHoliday: {},
        },
        minimizedModal: false,
        minimizeEditModal: false,
        according: true

      }
    },
    components: {
      'confirm-modal': confirmation
    },

    validations () {
      return {
        editErrorStatus:{
          updateErrorStatus:{
            errorInfo:{
              required
            }
          }
        },
        searches:{
          errorStatus:{
            maxLength: helpers.regex('maxLength', /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[0-9])$/)
          }
        }
      }
    },

    async beforeMount () {
      const adminColLabels = {
        errorStatus: i18n.t('errorStatus'),
        errorInfo: i18n.t('errorInfo')
      };

      if (await this.obtainHolidays()=== false){return};
      this.deleteRow2 = true
      const anAdmin = this.errorStatuss[0]
      this.columns = Object.keys(anAdmin).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false, // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true
      }))
      this.visibleColumns = Object.keys(adminColLabels)

      this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
    },


    computed: {
      modeSwitch: {
        get: function() {

        },
        set: function (v) {
          this.selections.selectable = !this.selections.selectable;
          this.selections.selected=[];
          if(this.selections.selectable) this.selections.selectMode = "multiple";
          else this.selections.selectMode = "none";
        }
      },

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

      async request ({ pagination }) {
        // 我们将QTable设置为“加载”状态

        this.loading = true

        // 我们根据收到的分页和过滤器来执行服务器数据提取
        if(pagination.rowsPerPage == 0 && this.serverPagination.rowsNumber>1000){
          notifyErr(i18n.t('dataNumberMoreThanOneThousand'))
          this.loading = false
          return
        }
        //let paginationData = await this.loadTbData(pagination.page-1,pagination.rowsPerPage)
        const paginationData  = await this.obtainHolidays(pagination.page-1,pagination.rowsPerPage,pagination.descending,pagination.sortBy,this.searches);
        this.serverPagination = pagination
        this.serverPagination.rowsNumber=pagination.rowsNumber

        this.changePage=pagination.page
        this.loading = false
        this.total= Math.ceil(this.serverPagination.rowsNumber/this.serverPagination.rowsPerPage)
      },

      async obtainHolidays(page, rowsNumber, sort, sortValue, searches){

        const data = {};

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
        if (this.searches.errorStatus) { data.errorStatus = this.searches.errorStatus }
        const r = await getErrorStatusList({ ...data });

        if (r.status && checkHttp(r.status)) {
          this.errorStatuss = r.data.content;

          this.errorStatuss = this.errorStatuss.map(x => ({...x})) // 扁平化对象
          this.serverPagination.rowsNumber = r.data.totalElements
          return true
        } else { return false }

      },

      deleteRow () {
        this.minimizedModal = true
      },
      async confirmDeleteModel (data) {
        this.minimizedModal = data[0]
        if (data[1] === 1) {
          const data = this.selections.selected.map(x => x.errorStatus).toString();
          const r = await deleteErrorCode(data);

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


      editRow (v) {
        this.minimizeEditModal = true;
        const data = v.row;
        this.editErrorStatus.updateErrorStatus.errorStatus = data.errorStatus;
        this.editErrorStatus.updateErrorStatus.errorInfo = data.errorInfo;

      },

      //取消
      async cancelEdit () {

      },

      //修改
      async upErrorCode () {
        const data = {};
        if (this.editErrorStatus.updateErrorStatus.errorInfo){
          data.errorStatus = this.editErrorStatus.updateErrorStatus.errorStatus;
          data.errorInfo = this.editErrorStatus.updateErrorStatus.errorInfo;
          await updateErrorCode(data);
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })

        }

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
  #selectErrorStatusButton {
    top: 8px;
    width: 100px;
    height: 40px;
  }
  #styleAdjustment {
    position: absolute;
    top: 86%;
    right: 2%
  }

  #columnLabel {
    position: absolute;
    top: 20%;
    right: 100%
  }
</style>
