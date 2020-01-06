<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('productList')}}</p>
    <q-table
      :data="products"
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
          <!-- 产品名称 -->
          <q-input id="productName" class="col-xs-12 col-lg-6" v-model="searches.name"
                   :stack-label='$t("productName")'/>
          <br/>

          <!-- 售后权限 -->
          <q-input id="salePermission" class="col-xs-12 col-lg-6" v-model="searches.salePermission"
                   :stack-label='$t("salePermission")'/>
          <br/>
          <!-- 物业权限 -->
          <q-input id="adminPermission" class="col-xs-12 col-lg-6" v-model="searches.adminPermission"
                   :stack-label='$t("adminPermission")'/>
          <br/>
        </div>
        <p></p>
        <q-btn id="selectProductButton" color="blue" :label='$t("searches")' v-close-overlay
               @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectProductButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>
      </template>

      <template slot="top-right" slot-scope="props">
        <span id="styleAdjustment">
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

      <!-- 自定义单元格  修改键-->
      <q-td slot="body-cell-name" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"
               v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>
        {{ props.value }}
      </q-td>

      <!-- 自定义单元格 查看售后权限-->
      <q-td slot="body-cell-salePermission" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn id="control" color="secondary" flat round class="on-center" @click="toViewSale(props)">
          {{$t("toViewValue")}}
        </q-btn>
      </q-td>

      <!-- 自定义单元格 查看物业权限-->
      <q-td slot="body-cell-adminPermission" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn id="control" color="secondary" flat round class="on-center" @click="toViewAdmin(props)">
          {{$t("toViewValue")}}
        </q-btn>
      </q-td>
    </q-table>

    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("projectWillBeDeleted")}}</p>

        <q-btn color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal>
    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
      <div style="padding: 30px">

        <p class="caption">{{$t("updateInformation")}}</p>

        <q-input id="updateProductName" v-model="editProduct.name" :stack-label='$t("productName")'
                 @blur="$v.editProduct.name.$touch()"/>
        <span style="color: red" class="message"
              v-if="!$v.editProduct.name.required">{{$t("productNameNotEmpty")}}</span>
        <span style="color: red" class="message"
              v-if="!$v.editProduct.name.nameLimit">{{$t("productNameNothan")}}</span>

        <q-input id="updateProductMemoName" v-model="editProduct.memoName" :stack-label='$t("productMemoName")'
                 @blur="$v.editProduct.memoName.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.editProduct.memoName.required">{{$t("productMemoNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editProduct.memoName.nameLimit">{{$t("productMemoNameNothan")}}</span>

        <p></p>
        <p class="caption">{{$t("salePermission")}}</p>
        <q-select
          id="updateSale"
          chips
          color="amber"
          multiple
          v-model="editProduct.salePerSelect"
          :options="editProduct.salePermissionList"
        />
        <p></p>
        <p class="caption">{{$t("adminPermission")}}</p>
        <q-select
          id="updateAdmin"
          chips
          color="amber"
          multiple
          v-model="editProduct.adminPerSelect"
          :options="editProduct.adminPermissionList"
        />
        <p></p>


        <p></p>
        <q-btn id="updateProductDate" color="blue" v-close-overlay @click="updateInfo">{{$t("updata")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="cancelEdit">{{$t("cancel")}}</q-btn>
      </div>

    </q-modal>

    <!-- 查看物业权限页面 -->
    <q-modal v-model="minimizetoViewAdmin" minimized ref="modalRef">
      <div style="padding: 40px">
        <q-list-header>{{$t("toViewPermissions")}}</q-list-header>
        <q-item v-for="(item, index) in toview.adminPerList" :key="`${index}`" v-close-overlay>
          <q-item-main>
            <q-item-tile label :id="`${index}AdminPer`">{{item}}</q-item-tile>
          </q-item-main>
        </q-item>
        <p></p>
        <div id="propertyPermission">
          <q-btn color="red" v-close-overlay :label='$t("goBack")' @click="cancelEdit"/>
        </div>
      </div>
    </q-modal>

    <!-- 查看售后权限页面 -->
    <q-modal v-model="minimizetoViewSale" minimized ref="modalRef">
      <div style="padding: 40px">
        <q-list-header>{{$t("toViewPermissions")}}</q-list-header>
        <q-item v-for="(item, index) in  toview.salePerList" :key="`${index}`" v-close-overlay>
          <q-item-main>
            <q-item-tile label :id="`${index}salePre`">{{item}}</q-item-tile>
          </q-item-main>
        </q-item>
        <p></p>
        <div id="salePermission">
          <q-btn color="red" v-close-overlay :label='$t("goBack")' @click="cancelEdit"/>
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
  import {deleteProduct, getProduct, getProductNumber, updateProduct, getGroupValue} from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import {i18n} from '../plugins/i18n'
  import {integer, maxValue, minValue, maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import {pageUrls, requestUrls} from "../util/env";
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import {helpers, numeric} from 'vuelidate/lib/validators'
  import limitNum from '../libs/onlyNum';

  export default {
    name: 'ProductManage',

    data() {
      return {
        rowKey: "id",
        products: [],
        columns: [],
        serverPagination: {
          page: 1,
          rowsPerPage: 5,
          rowsNumber: 10,
        },
        loading: false,
        filter: '',
        searches: {},
        visibleColumns: [],

        selections: {
          selectMode: "none",
          selected: [],
        },
        changePage: 1,
        editProduct: {
          name: '',
          memoName: '',
          adminPermissionList: [],
          salePermissionList: [],
          salePerSelect: [],
          adminPerSelect: [],
          adminOldSelect: [],
          saleOldSelect: []

        },
        toview: {
          salePerList: [],
          adminPerList: []
        },
        minimizedModal: false,
        minimizeEditModal: false,
        minimizetoViewAdmin: false,
        minimizetoViewSale: false,
        according: true,
      };


    },
    validations() {
      return {
        changePage: {
          integer,
          // [this.valName]: maxValue(this.total),
          minValue: minValue(1),
          // maxValue:maxValue(6),
          // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),

        },
        editProduct: {
          name: {
            required,
            nameLimit: helpers.regex('maxLength', /^[^ ]{1,64}$/),
          },
          memoName: {
            required,
            nameLimit: helpers.regex('maxLength', /^[^ ]{1,64}$/),
          }

        }
      }
    },


    async beforeMount() {
      const adminColLabels = {
        name: i18n.t('productName'),
        memoName: i18n.t('productMemoName'),
        salePermission: i18n.t('salePermission'),
        adminPermission: i18n.t('adminPermission')
      };

      if (await this.loadTbData() === false) return;
      this.deleteRow2 = true;
      const anProduct = this.products[0];
      this.columns = Object.keys(anProduct).filter(x => adminColLabels[x]).map(x => ({
        name: x,
        required: false,  // 是否在初始页面显示此字段
        label: adminColLabels[x],
        field: x,
        align: 'center',
        sortable: true,
      }));

      this.visibleColumns = Object.keys(adminColLabels);

      if (await this.getGroupValue() === false) return;


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
          const r = await deleteProduct(data);

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

        if (this.searches.name) {
          data.name = this.searches.name
        }
        if (this.searches.salePermission) {
          data.salePermission = this.searches.salePermission
        }
        if (this.searches.adminPermission) {
          data.propertyPermission = this.searches.adminPermission
        }


        //this.changePage=1
        const a = await getProductNumber({...data})
        this.serverPagination.rowsNumber = a.data


        const r = await getProduct({...data});

        if (r.status && checkHttp(r.status)) {
          this.products = r.data;
          this.products = this.products.map(x => ({...x})); //扁平化对象
          return true;
        } else
          return false;
      },


      async getGroupValue() {
        let addValue = await getGroupValue();

        for (let values of addValue.data) {
          let groupValues = values.slice(5)
          this.editProduct.adminPermissionList.push({
            label: groupValues,
            value: groupValues
          })
        }
        for (let values of addValue.data) {
          let groupValues = values.slice(5)
          this.editProduct.salePermissionList.push({
            label: groupValues,
            value: groupValues
          })
        }

      },


      deleteRow() {
        this.minimizedModal = true;
      },
      async editRow(v) {
        this.editProduct.salePerSelect = []
        this.editProduct.adminPerSelect = []
        this.editProduct.saleOldSelect = []
        this.editProduct.adminOldSelect = []
        this.minimizeEditModal = true;
        let d = v.row;
        this.editProduct.id = d.id
        this.editProduct.name = d.name;
        this.editProduct.oldName = d.name;
        this.editProduct.memoName = d.memoName;
        for (let i = 0; i < d.salePermission.length; i++) {
          this.editProduct.saleOldSelect[i] = d.salePermission[i];
          this.editProduct.salePerSelect[i] = d.salePermission[i];

        }
        for (let i = 0; i < d.adminPermission.length; i++) {
          this.editProduct.adminOldSelect[i] = d.adminPermission[i];
          this.editProduct.adminPerSelect[i] = d.adminPermission[i];

        }

      },

      toViewAdmin(v) {
        this.minimizetoViewAdmin = true;

        this.toview.adminPerList = v.value;
      },
      async toViewSale(v) {

        if (v.value) {
          this.minimizetoViewSale = true;
          this.toview.salePerList = v.value
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
        this.searches.name = '';
        this.searches.salePermission = '';
        this.searches.adminPermission = '';
      },
      // 修改
      async updateInfo() {

        const data = {}
        if (this.editProduct.name && this.editProduct.name != this.editProduct.oldName) {

          data.name = this.editProduct.name
        }
        if (this.editProduct.memoName) {

          data.memoName = this.editProduct.memoName
        }
        if (JSON.stringify(this.editProduct.salePerSelect) != JSON.stringify(this.editProduct.saleOldSelect)) {
          data.salePermission = this.editProduct.salePerSelect
        }
        if (JSON.stringify(this.editProduct.adminPerSelect) != JSON.stringify(this.editProduct.adminOldSelect)) {
          data.adminPermission = this.editProduct.adminPerSelect
        }


        if (data.name || data.salePermission || data.adminPermission || data.memoName) {
          data.id = this.editProduct.id
          const a = await updateProduct(data)
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

  #selectProductButton {
    top: 10px;
    width: 100px;
    height: 40px;
  }

  #styleAdjustment {
    position: absolute;
    top: 88%;
    right: 2%
  }

  #columnLabel {
    position: absolute;
    top: 20%;
    right: 100%
  }
</style>
