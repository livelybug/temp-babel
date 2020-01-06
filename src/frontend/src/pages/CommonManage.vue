<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('commonList')}}</p>
    <q-table
      :data="commons"
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
        <div class="row">
          <!-- 登录名 -->
          <q-input id="commonUserLoginName" class="col-xs-12 col-lg-6" v-model="searches.commonUserLoginName"
                   :stack-label='$t("loginName")'/>
          <p></p>
          <!-- 姓名 -->
          <q-input id="commonUserName" class="col-xs-12 col-lg-6" v-model="searches.commonUserName"
                   :stack-label='$t("displayName")'/>
          <br/>
          <!-- 权限id -->
          <q-input id="commonUserGroupId" class="col-xs-12 col-lg-6" type="number" v-model="searches.commonUserGroupId"
                   :stack-label='$t("permissionsID")'/>
          <br/>
          <!-- @blur="$v.searches.commonUserGroupId.$touch()"
          <span style="color: red" class="message" v-if="!$v.searches.commonUserGroupId.integer">{{$t("positiveInteger")}}</span>
          <span style="color: red" class="message" v-if="!$v.searches.commonUserGroupId.minValue">{{$t("minValue")}}</span>
          <span style="color: red" class="message" v-if="!$v.searches.commonUserGroupId.maxValue">{{$t("maxValue")}}</span>-->
          <!-- 权限名称 -->
          <q-input id="name" class="col-xs-12 col-lg-6" v-model="searches.name" :stack-label='$t("permissionName")'/>
          <br/>
          <!-- 权限值 -->
          <q-select
            id="permissions"
            class="col-xs-12 col-lg-6"
            chips
            color="amber"
            multiple
            v-model="searches.permissions"
            :options="searches.options"
            :stack-label='$t("permissionValues")'
          />

          <!-- 外部用户项目 -->
          <q-select
            id="project"
            class="col-xs-12 col-lg-6"
            chips
            color="amber"
            v-model="searches.project"
            :options="searches.projects"
            :stack-label='$t("adminProject")'
          />


          <br/>
          <!--</q-field>-->
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
          <!--<span>更新时间:</span>-->
          <q-datetime
            id="updateStartTime"
            class="col-xs-12 col-lg-6"
            type="datetime"
            v-model="searches.updateStartTime"
            color="brown"
            clearable
            :stack-label='$t("updateStartTime")'
          />
          <q-datetime
            id="updateEndTime"
            class="col-xs-12 col-lg-6"
            type="datetime"
            v-model="searches.updateEndTime"
            color="brown"
            clearable
            :min="searches.updateStartTime"
            :stack-label='$t("updateEndTime")'
          />

          <!--<span>密码更新时间:</span>-->
          <q-datetime
            id="passwordUpdateStartTime"
            class="col-xs-12 col-lg-6"
            type="datetime"
            v-model="searches.passwordUpdateStartTime"
            color="brown"
            clearable
            :stack-label='$t("passwordUpdateStartTime")'
          />
          <q-datetime
            id="passwordUpdateEndTime"
            class="col-xs-12 col-lg-6"
            type="datetime"
            v-model="searches.passwordUpdateEndTime"
            color="brown"
            clearable
            :min="searches.passwordUpdateStartTime"
            :stack-label='$t("passwordUpdateEndTime")'
          />&nbsp;&nbsp;
        </div>
        <p></p>
        <q-btn id="selectCommonUserButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectCommonUserButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>

      </template>

      <template slot="top-right" slot-scope="props">
        <q-table-columns
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
      </template>

      <!-- 自定义单元格 -->
      <q-td slot="body-cell-commonUserLoginName" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"
               v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        {{ props.value }}
      </q-td>

      <!-- 自定义单元格 查看项目-->
      <q-td slot="body-cell-projectNames" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn id="control" color="secondary" flat round class="on-center" @click="toViewSale(props)">
          {{$t("toViewValue")}}
        </q-btn>
      </q-td>

    </q-table>

    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("accountWillBeDeleted")}}</p>

        <q-btn color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal>
    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>

        <q-input v-model="editCommon.updateCommon.commonUserLoginName" :stack-label='$t("loginName")' :readonly="true"/>
        <q-input v-model="editCommon.updateCommon.commonUserName" :stack-label='$t("displayName")'/>
        <span style="color: red" class="message" v-if="!$v.editCommon.updateCommon.commonUserName.required">{{$t("displayNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editCommon.updateCommon.commonUserName.maxLength">{{$t("displayNameCannotGreaterThaN64")}}</span>

        <q-input v-model="editCommon.password" type="password" :stack-label='$t("password")'
                 @blur="$v.editCommon.password.$touch() "/>
        <span style="color: red" class="message" v-if="!$v.editCommon.password.passwordLimit">{{$t("passwordFarmatError")}}</span>
        <p></p>
        <!-- <q-input v-model="updateCommon.disabled" :stack-label='$t("disabled")'    /> -->
        <!--<p class="caption">{{$t("disabled")}}</p>
        <q-radio v-model="editCommon.updateCommon.disabled" val="true" color="secondary" :label='$t("yes")'/>
        <q-radio v-model="editCommon.updateCommon.disabled" val="false" color="secondary" :label='$t("no")'
                 style="margin-left: 10px"/>-->
        <q-select
          v-model="editCommon.updateCommon.disabled"
          :options="selectOptions"
          :stack-label="$t('disabled')"
        />
        <p></p>
        <!-- <q-input v-model="updateCommon.groupName" :stack-label='$t("groupName")'    /> -->
        <p class="caption">{{$t("groupName")}}</p>
        <q-select
          v-model="editCommon.select"
          :options="editCommon.groupPermissions"
        />

        <!-- 外部用户项目 -->
        <q-select
          chips
          multiple
          color="amber"
          v-model="editCommon.project"
          :options="searches.projects"
          :stack-label='$t("adminProject")'
        />

        <p></p>
        <q-btn color="blue" v-close-overlay @click="updateUser">{{$t("updata")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit">{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>

    <!-- 查看项目页面 -->
    <q-modal v-model="minimizetoViewSale" minimized ref="modalRef">
      <div style="padding: 40px">
        <q-list-header>{{$t("deviceProject")}}</q-list-header>
        <q-item v-for="(item, index) in  projectName" :key="`${index}`" v-close-overlay>
          <q-item-main>
            <q-item-tile label :id="`${index}project`">{{item}}</q-item-tile>
          </q-item-main>
        </q-item>
        <p></p>
        <div id="projectNames">
          <q-btn color="red" v-close-overlay :label='$t("goBack")' @click="cancelEdit"/>
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
    deleteCommons,
    getCommonNumber,
    getGroupValue,
    updateCommonById,
    getCommons,
    getProjects,
    getProjectNumber
  } from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import {i18n} from '../plugins/i18n'
  import {integer, maxValue, minValue, maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import {pageUrls, requestUrls} from '../util/env'
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import {helpers, numeric} from 'vuelidate/lib/validators'
  import limitNum from '../libs/onlyNum'

  export default {
    name: 'CommonManage',

    data() {
      return {
        selectOptions: [
          {
            label: i18n.t('yes'),
            value: 'true'
          },
          {
            label: i18n.t('no'),
            value: 'false'
          }
        ],
        rowKey: 'id',
        commons: [],
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10
        },
        loading: false,
        filter: '',
        searches: {
          permissions: [],
          project: [],
          projects: [],
          options: []
        },
        projectName:[],
        visibleColumns: [],

        selections: {
          selectMode: 'none',
          selected: []
        },
        changePage: 1,
        editCommon: {
          updateCommon: {},
          oldAdmin: {},
          select: '',
          groupPermissions: [],
          project: []
        },

        minimizedModal: false,
        minimizeEditModal: false,
        according: true,
        minimizetoViewSale: false
        // total:0,
        // valName: 'validatorName'
      }
    },
    validations() {
      return {
        searches: {
          commonUserGroupId: {
            integer,
            minValue: minValue(1),
            maxValue: maxValue(9999)
          }
        },

        changePage: {
          integer,
          // [this.valName]: maxValue(this.total),
          minValue: minValue(1)
          // maxValue:maxValue(6),
          // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),

        },
        editCommon: {
          updateCommon: {
            commonUserName: {
              required,
              minLength: minLength(1),
              maxLength: helpers.regex('maxLength', /^[^ ]{1,64}$/)
            }

          },
          password: {
            passwordLimit: helpers.regex('passwordLimit', /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-])[^]{8,20}$/)
          }
        }
      }
    },

    async beforeMount() {
      const adminColLabels = {
        commonUserLoginName: i18n.t('loginName'),
        commonUserName: i18n.t('displayName'),
        projectNames: i18n.t('adminProject'),
        groupName: i18n.t('groupName'),
        createDate: i18n.t('createDate'),
        updateDate: i18n.t('updateDate'),
        passwordUpdateDate: i18n.t('passwordUpdateDate')
      }

      if (await this.loadTbData() === false) return
      this.deleteRow2 = true
      const anAdmin = this.commons[0]
      this.columns = Object.keys(anAdmin).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false, // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true
      }))

      this.visibleColumns = Object.keys(adminColLabels)

      const groupNumber = await getPermissionsNumber()
      const data = {}
      data.size = groupNumber.data
      const r = await getPermissions({...data})

      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.name
          x.value = x.groupId
        })

        this.editCommon.groupPermissions = r.data
      }
      if (await this.getGroupValue() === false) return
      this.editCommon.select = this.groupId

      this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage);

      await this.getProjectValue()

    },

    computed: {
      modeSwitch: {
        get: function () {

        },
        set: function (v) {
          this.selections.selectable = !this.selections.selectable
          this.selections.selected = []
          if (this.selections.selectable) this.selections.selectMode = 'multiple'
          else this.selections.selectMode = 'none'
        }
      },

      confirmDelete: {
        get: function () {

        },
        set: async function (v) {
          const data = this.selections.selected.map(x => x.id).toString()
          const r = await deleteCommons(data)

          if (r.status && checkHttp(r.status)) {
            this.selections.selected = []
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            })
          }
        }

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
      async loadTbData(page, rowsNumber, sort, sortValue, searches) {
        if (this.$v.searches.commonUserGroupId.$error) {
          this.$q.notify(i18n.t('permissionsIDInputError'))
          return
        }
        const data = {}
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
        if (this.searches.commonUserLoginName) {
          data.commonUserLoginName = this.searches.commonUserLoginName
        }
        if (this.searches.commonUserName) {
          data.commonUserName = this.searches.commonUserName
        }

        if (this.searches.commonUserGroupId) {
          data.commonUserGroupId = this.searches.commonUserGroupId
        }
        if (this.searches.name) {
          data.name = this.searches.name
        }
        if (this.searches.permissions.length > 0) {
          var permission = this.searches.permissions.join()
          data.permissions = permission
        }

        if (this.searches.project != null) {
          data.project = this.searches.project
        }

        if (this.searches.createStartTime && this.searches.createEndTime) {
          data.createStartTime = this.searches.createStartTime
          data.createEndTime = this.searches.createEndTime
        }
        if (this.searches.updateStartTime && this.searches.updateEndTime) {
          data.updateStartTime = this.searches.updateStartTime
          data.updateEndTime = this.searches.updateEndTime
        }
        if (this.searches.passwordUpdateStartTime && this.searches.passwordUpdateEndTime) {
          data.passwordUpdateStartTime = this.searches.passwordUpdateStartTime
          data.passwordUpdateEndTime = this.searches.passwordUpdateEndTime
        }


        const a = await getCommonNumber({...data})
        this.serverPagination.rowsNumber = a.data


        const r = await getCommons({...data})

        if (r.status && checkHttp(r.status)) {
          this.commons = r.data
          this.commons = this.commons.map(x => ({...x, groupName: x.group.name,projectNames: x.project})) // 扁平化对象
          return true
        } else {
          return false
        }
      },

      //查看管理的项目
      async toViewSale(v) {
        if (v.row) {
          this.minimizetoViewSale = true;
          this.projectName = v.row.project
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
          this.searches.projects.push({
            label: projectName,
            value: projectName
          })
        }

      },

      async getGroupValue() {
        let groupValue = await getGroupValue()

        for (let values of groupValue.data) {
          let groupValues = values.slice(5)
          this.searches.options.push({
            label: groupValues,
            value: groupValues
          })
        }
      },

      deleteRow() {
        this.minimizedModal = true
      },
      editRow(v) {
        this.minimizeEditModal = true
        let data = v.row

        data.disabled = String(data.disabled)
        this.editCommon.updateCommon = {...data}
        this.editCommon.select = this.editCommon.updateCommon.group.groupId
        this.editCommon.oldAdmin = {...data};
        this.editCommon.oldSelect = this.editCommon.updateCommon.group.groupId;
        if (data.project != null){
          this.editCommon.project = data.project;
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
        // let paginationData = await this.loadTbData(pagination.page-1,pagination.rowsPerPage)
        const paginationData = await this.loadTbData(pagination.page - 1, pagination.rowsPerPage, pagination.descending, pagination.sortBy, this.searches)
        this.serverPagination = pagination
        this.serverPagination.rowsNumber = pagination.rowsNumber

        this.changePage = pagination.page
        this.loading = false
        this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
      },
      // 取消
      async cancelEdit() {
        // this.selections.selected=[]
        this.editCommon.password = ''
        //  await this.loadTbData(this.changePage-1);
      },
      //重置
      async Searches() {
        this.searches.commonUserLoginName = '';
        this.searches.commonUserName = '';
        this.searches.commonUserGroupId = '';
        this.searches.name = '';
        this.searches.permissions = [];
        this.searches.project = [];
        this.searches.createStartTime = '';
        this.searches.createEndTime = '';
        this.searches.updateStartTime = '';
        this.searches.updateEndTime = '';
        this.searches.passwordUpdateStartTime = '';
        this.searches.passwordUpdateEndTime = '';
      },
      // 修改
      async updateUser() {
        const data = {};
        if (this.editCommon.updateCommon.commonUserName && this.editCommon.updateCommon.commonUserName != this.editCommon.oldAdmin.commonUserName) {
          data.commonUserName = this.editCommon.updateCommon.commonUserName
        }
        if (this.editCommon.password) {
          data.password = this.editCommon.password
        }
        if (this.editCommon.updateCommon.disabled != this.editCommon.oldAdmin.disabled) {
          data.disabled = this.editCommon.updateCommon.disabled
        }
        if (this.editCommon.select != this.editCommon.oldSelect) {
          data.commonUserGroupId = this.editCommon.select
        }
         if (this.editCommon.project != null){
          data.project = this.editCommon.project;
         }else {
           data.project = [];
         }

        if (data.commonUserName || data.password || data.disabled || data.commonUserGroupId || data.project) {
          data.id = this.editCommon.updateCommon.id
          const a = await updateCommonById({...data})
        }
        if (JSON.stringify(this.editCommon.updateCommon) != JSON.stringify(this.editCommon.oldAdmin) || this.editCommon.select != this.editCommon.oldSelect) {

          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        }
        this.editCommon.password = '';
        this.loadTbData()
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

  #selectCommonUserButton {
    top: 10px;
    width: 100px;
    height: 40px;
  }

  /*#commonUserLoginName,#commonUserName,#commonUserGroupId,#permissions,#name{
     width:80%;
  }
  #createStartTime,#createEndTime,#updateStartTime,#updateEndTime,#passwordUpdateStartTime,#passwordUpdateEndTime{
    width:40%;
  }*/
  #turnPage {
    width: 200px;
    height: 40px
  }

</style>
