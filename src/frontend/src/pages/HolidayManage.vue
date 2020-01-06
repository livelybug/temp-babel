<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('holidayList')}}</p>
    <q-table
      :data="holidays"
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
        <!--<span style="color: red" class="message" v-if="!$v.changePage.integer">{{$t("positiveInteger")}}</span>-->
        <q-btn
          round dense size="sm" icon="redo" color="secondary"
          :disable="props.isLastPage"
          @click="props.nextPage"
        />

      </div>
      <template slot="top" slot-scope="props" :props="props">
        <div class="row" style="width: 100%">
          <!--<span>创建时间:</span>-->
          <q-datetime
            id="startDate"
            class="col-xs-12 col-lg-6"
            type="date"
            v-model="searches.startDate"
            color="brown"
            clearable
            :stack-label='$t("startDate")'
          />
          <q-datetime
            id="endDate"
            class="col-xs-12 col-lg-6"
            type="date"
            v-model="searches.endDate"
            color="brown"
            clearable
            :min="searches.startDate"
            :stack-label='$t("endDate")'
          />
        </div>
        <q-btn id="selectHolidayButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="obtainHolidays(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectHolidayButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>
        <div class="row" style="width: 100%">
          <p style="width: 100%; height: 10px"></p>
          <!--选择删除的年份-->
          <q-input id="deleteDate" class="col-xs-12 col-lg-6" v-model="searches.particularYear"
                   :stack-label='$t("particularYear")'/>
          <!--<span style="color: red" class="message" v-if="!$v.searches.particularYear.maxLength">{{$t("yearMustBeNumber")}}</span>-->
        </div>
        <q-btn id="selectHolidayButton" color="red" v-close-overlay @click="deHoliday">{{$t("delete")}}</q-btn>
        <p style="width: 100%; height: 30px;"></p>
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
        <q-btn flat class="on-right" icon="mode_edit" @click="modeSwitch=1">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        </div>
      </template>
<p></p>
      <q-td slot="body-cell-date" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"
               v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        {{ props.value }}
      </q-td>

    </q-table>

    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>
        <q-input v-model="editHoliday.updateHoliday.date" :stack-label='$t("date")' :readonly="true"/>
        <q-input v-model="editHoliday.updateHoliday.pattern" @blur="$v.editHoliday.updateHoliday.pattern.$touch"
                 :stack-label='$t("pattern")'/>
        <span style="color: red" class="message" v-if="!$v.editHoliday.updateHoliday.pattern.required">{{$t("patternNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editHoliday.updateHoliday.pattern.maxLength">{{$t("patternMustBeNumber")}}</span>
        <p></p>
        <q-btn color="blue" v-close-overlay @click="upHoliday">{{$t("updata")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit">{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>

  </q-page>
</template>

<style>
</style>

<script>
  import {getHolidays, updateHoliday, deleteHolidays} from '../interface/getData'
  import {i18n} from '../plugins/i18n'
  import {checkHttp} from '../libs/utils'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import limitNum from '../libs/onlyNum';
  import {date} from 'quasar';
  import {required} from 'vuelidate/lib/validators';
  import {helpers} from 'vuelidate/lib/validators';

  export default {
    name: 'CommonManage',

    data() {
      return {
        rowKey: 'id',
        holidays: [],
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10
        },
        changePage: 1,
        loading: false,
        filter: '',
        visibleColumns: [],
        selections: {
          selectMode: 'none',
          selected: []
        },
        searches: {},
        editHoliday: {
          updateHoliday: {
            pattern: ''
          },
          oldHoliday: {},
        },
        minimizeEditModal: false,
        according: true

      }
    },

    validations() {
      return {
        editHoliday: {
          updateHoliday: {
            pattern: {
              required,
              maxLength: helpers.regex('maxLength', /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/)
            }
          }
        },
        searches: {
          particularYear: {
            maxLength: helpers.regex('maxLength', /^\d{4}$/)
          }
        }
      }
    },

    async beforeMount() {
      const adminColLabels = {
        date: i18n.t('date'),
        pattern: i18n.t('pattern')
      };

      if (await this.obtainHolidays() === false) {
        return
      }
      ;
      this.deleteRow2 = true
      const anAdmin = this.holidays[0]
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
        get: function () {

        },
        set: function (v) {
          this.selections.selectable = !this.selections.selectable;
          this.selections.selected = [];
          if (this.selections.selectable) this.selections.selectMode = "none";
          else this.selections.selectMode = "none";
        }
      },

      confirmDelete: {
        get: function () {

        },
        set: async function (v) {
          const data = this.selections.selected.map(x => x).toString();
          const r = await deleteGroups(data);

          if (r.status && checkHttp(r.status)) {
            this.selections.selected = [];
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            })
          }
        }

      },

    },


    confirmDelete: {
      get: function () {

      },
      set: async function (v) {
        /*const data = this.selections.selected.map(x => x.id).toString()
        const r = await deleteCommons(data)

        if (r.status && checkHttp(r.status)) {
          this.selections.selected = []
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        }*/
      }

    },


    directives: {
      limitNum
    },


    methods: {
      getValue(a) {
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
        const paginationData = await this.obtainHolidays(pagination.page - 1, pagination.rowsPerPage, pagination.descending, pagination.sortBy, this.searches);
        this.serverPagination = pagination
        this.serverPagination.rowsNumber = pagination.rowsNumber

        this.changePage = pagination.page
        this.loading = false
        this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
      },

      async obtainHolidays(page, rowsNumber, sort, sortValue, searches) {

        const data = {};

        if (page) {
          data.page = page
        }
        if (rowsNumber) {
          this.according = true
          data.size = rowsNumber
        } else if (rowsNumber == '0') {
          this.according = false
          data.size = this.serverPagination.rowsNumber
        }
        if (sort && sortValue) {
          data.sort = 'DESC'
        } else {
          data.sort = 'ASC'
        }
        if (sortValue) {
          data.sortValue = sortValue
        }
        if (this.searches.startDate) {
          data.startDate = this.searches.startDate
        }
        if (this.searches.endDate) {
          data.endDate = this.searches.endDate
        }
        const r = await getHolidays({...data});
        if (r.status && checkHttp(r.status)) {
          this.holidays = r.data.content;

          for (let values of this.holidays) {
            values.date = date.formatDate(values.date, 'YYYY-MM-DD')
          }

          this.holidays = this.holidays.map(x => ({...x})) // 扁平化对象
          this.serverPagination.rowsNumber = r.data.totalElements
          return true
        } else {
          return false
        }

      },

      deleteRow() {
        this.minimizedModal = true
      },


      editRow(v) {
        this.minimizeEditModal = true;
        const data = v.row;
        this.editHoliday.updateHoliday.date = data.date;
        this.editHoliday.updateHoliday.pattern = data.pattern;

      },

      //取消
      async cancelEdit() {

      },
//重置
      async Searches() {
        this.searches.startDate = '';
        this.searches.endDate = '';
      },
      //修改
      async upHoliday() {
        const data = {};
        if (this.editHoliday.updateHoliday.pattern) {
          data.date = this.editHoliday.updateHoliday.date;
          data.pattern = this.editHoliday.updateHoliday.pattern;
          await updateHoliday(data);
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })

        }

      },
      async deHoliday() {
        const data = {};
        if (this.searches.particularYear) {
          data.particularYear = date.formatDate(this.searches.particularYear, 'YYYY-12-31')
          await deleteHolidays(data)
          this.searches.particularYear = null;
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        }
      },


      mounted() {
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
  #changeInput {
    text-align: center;
    width: 20%;
  }

  /*  #startDate,#endDate{
      width:40%;
    }*/
  #turnPage {
    width: 200px;
    height: 40px
  }

  #styleAdjustment {
    position: absolute;
    top: 90%;
    right: 2%
  }

  #columnLabel {
    position: absolute;
    top: 20%;
    right: 100%
  }

  #selectHolidayButton {
    top: 8px;
    width: 100px;
    height: 40px;
  }

</style>
