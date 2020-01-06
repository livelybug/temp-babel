<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('AdministratorList')}}</p>
    <q-table
      :data="admins"
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
          <q-input id="login_name" class="col-xs-12 col-lg-6" v-model="searches.login_name"
                   :stack-label='$t("loginName")'/>

          <!-- 姓名 -->
          <q-input id="display_name" class="col-xs-12 col-lg-6" v-model="searches.display_name"
                   :stack-label='$t("displayName")'/>
          <br/>
          <!-- 权限id -->
          <q-input id="group" class="col-xs-12 col-lg-6" type="number" v-model="searches.group"
                   :stack-label='$t("permissionsID")'/>
          <!--@blur="$v.searches.group.$touch"
          <span style="color: red; position: absolute; top: 29%;" class="message" v-if="!$v.searches.group.integer">{{$t("positiveInteger")}}</span>
          <span style="color: red; position: absolute; top: 29%;" class="message" v-if="!$v.searches.group.minValue">{{$t("minValue")}}</span>
          <span style="color: red; position: absolute; top: 29%;" class="message" v-if="!$v.searches.group.maxValue">{{$t("maxValue")}}</span>-->
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
        <q-btn id="selectAdminsButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectAdminsButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>

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
      <q-td slot="body-cell-login_name" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"
               v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        {{ props.value }}
      </q-td>
    </q-table>

    <!-- <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("accountWillBeDeleted")}}</p>

        <q-btn  id="sureDeleteAdminUser" color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal> -->

    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>

        <q-input v-model="editAdmin.updateAdmin.login_name" :stack-label='$t("loginName")' :readonly="true"/>
        <q-input v-model="editAdmin.updateAdmin.display_name" :stack-label='$t("displayName")'/>
        <span style="color: red" class="message" v-if="!$v.editAdmin.updateAdmin.display_name.required">{{$t("displayNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editAdmin.updateAdmin.display_name.maxLength">{{$t("displayNameCannotGreaterThaN64")}}</span>

        <q-input v-model="editAdmin.password" type="password" :stack-label='$t("password")'
                 @blur="$v.editAdmin.password.$touch() "/>
        <span style="color: red" class="message" v-if="!$v.editAdmin.password.passwordLimit">{{$t("passwordFarmatError")}}</span>
        <p></p>
        <!-- <q-input v-model="updateAdmin.disabled" :stack-label='$t("disabled")'    /> -->
        <!--<p class="caption">{{$t("disabled")}}</p>
        <q-radio v-model="editAdmin.updateAdmin.disabled" val="true" color="secondary" :label='$t("yes")'/>
        <q-radio v-model="editAdmin.updateAdmin.disabled" val="false" color="secondary" :label='$t("no")'
                 style="margin-left: 10px"/>-->

        <q-select
          v-model="editAdmin.updateAdmin.disabled"
          :options="selectOptions"
          :stack-label="$t('disabled')"
        />

        <p></p>
        <!-- <q-input v-model="updateAdmin.groupName" :stack-label='$t("groupName")'    /> -->
        <q-select
          v-model="editAdmin.select"
          :options="editAdmin.groupPermissions"
          :stack-label="$t('groupName')"
        />
        <p></p>
        <q-btn color="blue" v-close-overlay @click="updateUser">{{$t("updata")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit">{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>

    <!-- 调用删除组件 -->
    <confirm-modal :minimizedModal="minimizedModal" @listenToChildEvent="confirmDeleteModel"></confirm-modal>
  </q-page>
</template>

<style>
</style>

<script>
  import {
    getPermissions,
    getPermissionsNumber,
    deleteAdmins,
    getAdmins,
    getAdminsNumber,
    getGroupValue,
    updateAdminDisabled,
    updateAdminDisplayName,
    updateAdminGroupId,
    updateAdminPassword
  } from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import {i18n} from '../plugins/i18n'
  import {integer, maxValue, minValue, maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import {pageUrls, requestUrls} from "../util/env";
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import {helpers, numeric} from 'vuelidate/lib/validators'
  import limitNum from '../libs/onlyNum';
  import confirmation from '../pages/components/Confirmation.vue'

  export default {
    name: 'AdminManage',

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
        rowKey: "id",
        admins: [],
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
        visibleColumns: [],

        selections: {
          selectMode: "none",
          selected: [],
        },
        changePage: 1,
        editAdmin: {
          updateAdmin: {},
          oldAdmin: {},
          select: '',
          groupPermissions: [],
        },

        minimizedModal: false,
        minimizeEditModal: false,
        according: true,
        // total:0,
        // valName: 'validatorName'

      };

    },
    components: {
      'confirm-modal': confirmation
    },
    validations() {
      return {
        searches: {
          group: {
            integer,


            maxValue: maxValue(9999)
          },
        },

        changePage: {
          integer,
          // [this.valName]: maxValue(this.total),
          minValue: minValue(1),
          // maxValue:maxValue(6),
          // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),

        },
        editAdmin: {
          updateAdmin: {
            display_name: {
              required,
              minLength: minLength(1),
              maxLength: helpers.regex('maxLength', /^[^ ]{1,64}$/)
            },

          },
          password: {
            passwordLimit: helpers.regex('passwordLimit', /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-])[^]{8,20}$/)
          }
        }
      }
    },


    async beforeMount() {
      const adminColLabels = {
        login_name: i18n.t('loginName'),
        display_name: i18n.t('displayName'),
        groupName: i18n.t('groupName'),
        create_date: i18n.t('createDate'),
        update_date: i18n.t('updateDate'),
        password_update_date: i18n.t('passwordUpdateDate'),
      };

      if (await this.loadTbData() === false) return;
      this.deleteRow2 = true;
      const anAdmin = this.admins[0];
      this.columns = Object.keys(anAdmin).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false,  // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true,
      }));

      this.visibleColumns = Object.keys(adminColLabels);

      const groupNumber = await getPermissionsNumber();
      const data = {};
      data.size = groupNumber.data;
      const r = await getPermissions({...data});

      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.name;
          x.value = x.groupId
        });

        this.editAdmin.groupPermissions = r.data;
      }
      if (await this.getGroupValue() === false) return;
      this.editAdmin.select = this.groupId;

      this.total = Math.ceil(this.serverPagination.rowsNumber / this.serverPagination.rowsPerPage)
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
          const r = await deleteAdmins(data);

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

        if (eval(this.changePage) <= eval(a) && this.changePage != 0 && eval(this.changePage) >= eval(1)) {
          this.serverPagination.page = parseInt(this.changePage)

          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })
        } else {
          notifyErr(i18n.t('pageIndexOut'));
        }
      },
      async loadTbData(page, rowsNumber, sort, sortValue, searches) {
        if (this.$v.searches.group.$error) {
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
        if (this.searches.login_name) {
          data.login_name = this.searches.login_name
        }
        if (this.searches.display_name) {
          data.display_name = this.searches.display_name
        }

        if (this.searches.group) {
          data.group = this.searches.group
        }
        if (this.searches.name) {
          data.name = this.searches.name
        }
        if (this.searches.permissions.length > 0) {
          var permission = this.searches.permissions.join()
          data.permissions = permission
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

        //this.changePage=1
        const a = await getAdminsNumber({...data})
        this.serverPagination.rowsNumber = a.data

        const r = await getAdmins({...data});

        if (r.status && checkHttp(r.status)) {
          this.admins = r.data;
          this.admins = this.admins.map(x => ({...x, groupName: x.group.name})); //扁平化对象
          return true;
        } else
          return false;
      },

      async getGroupValue() {
        let groupValue = await getGroupValue();

        for (let values of groupValue.data) {
          let groupValues = values.slice(5)
          this.searches.options.push({
            label: groupValues,
            value: groupValues
          })
        }

      },


      deleteRow() {
        this.minimizedModal = true;
      },
      editRow(v) {

        this.minimizeEditModal = true;
        let data = v.row;

        data.disabled = String(data.disabled)
        this.editAdmin.updateAdmin = {...data};
        this.editAdmin.select = this.editAdmin.updateAdmin.group.groupId;
        this.editAdmin.oldAdmin = {...data};
        this.editAdmin.oldSelect = this.editAdmin.updateAdmin.group.groupId;
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
        // this.selections.selected=[]
        this.editAdmin.password = ''
        //  await this.loadTbData(this.changePage-1);

      },
      //重置
      async Searches() {
        this.searches.login_name = '';
        this.searches.display_name = '';
        this.searches.group = '';
        this.searches.name = '';
        this.searches.permissions = [];
        this.searches.createStartTime = '';
        this.searches.createEndTime = '';
        this.searches.updateStartTime = '';
        this.searches.updateEndTime = '';
        this.searches.passwordUpdateStartTime = '';
        this.searches.passwordUpdateEndTime = '';
      },
      // 修改
      async updateUser() {
        if (this.editAdmin.updateAdmin.display_name && this.editAdmin.updateAdmin.display_name != this.editAdmin.oldAdmin.display_name) {
          const data = {}
          data.id = this.editAdmin.updateAdmin.id
          data.display_name = this.editAdmin.updateAdmin.display_name
          const a = await updateAdminDisplayName(data)
        }
        if (this.editAdmin.password) {
          const data = {}
          data.id = this.editAdmin.updateAdmin.id
          data.password = this.editAdmin.password

          const a = await updateAdminPassword(data)

        }
        if (this.editAdmin.updateAdmin.disabled != this.editAdmin.oldAdmin.disabled) {
          const data = {}
          data.id = this.editAdmin.updateAdmin.id
          data.disabled = this.editAdmin.updateAdmin.disabled
          const a = await updateAdminDisabled(data)
        }
        if (this.editAdmin.select != this.editAdmin.oldSelect) {
          const data = {}
          data.id = this.editAdmin.updateAdmin.id
          data.groupId = this.editAdmin.select
          const a = await updateAdminGroupId(data)
        }
        if (JSON.stringify(this.editAdmin.updateAdmin) != JSON.stringify(this.editAdmin.oldAdmin) || this.editAdmin.select != this.editAdmin.oldSelect) {

          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          })

        }
        this.editAdmin.password = ''
      },
      async confirmDeleteModel(data) {
        this.minimizedModal = data[0]
        if (data[1] === 1) {

          const data = this.selections.selected.map(x => x.id).toString();
          const r = await deleteAdmins(data);

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
      mounted() {
        // 一旦挂载，我们需要触发初始服务器数据获取
        this.request({
          pagination: this.serverPagination,
          filter: this.filter
        })
      }

    },

  }
</script>
<style>
  #changeInput {
    text-align: center;
    width: 20%;
  }

  /*#login_name,#display_name,#group,#permissions,#name{
     width:80%;
  }
  #createStartTime,#createEndTime,#updateStartTime,#updateEndTime,#passwordUpdateStartTime,#passwordUpdateEndTime{
    width:40%;
  }*/
  #selectAdminsButton {
    top: 10px;
    width: 100px;
    height: 40px;
  }

  #turnPage {
    width: 200px;
    height: 40px
  }


</style>
