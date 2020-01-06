<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('groupistratorList')}}</p>
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

      <div  id="turnPage"  slot="pagination"  slot-scope="props"   :props="props"  class="row flex-center q-py-sm"  v-show="according">
      <q-btn
        round dense size="sm" icon="undo" color="secondary" class="q-mr-sm"
        :disable="props.isFirstPage"
        @click="props.prevPage"
       
      />
        Page
        <input  id="changeInput"  v-model="changePage"  type='number'  v-on:blur="getValue(props.pagesNumber)" v-limitNum   />/   {{ props.pagesNumber }}
          <span style="color: red" class="message" v-if="!$v.changePage.integer">{{$t("positiveInteger")}}</span>
     <q-btn
        round dense size="sm" icon="redo" color="secondary"
        :disable="props.isLastPage"
        @click="props.nextPage"
      />
    
    </div>

      <template slot="top-left" slot-scope="props"  :props="props">
        <div class="row">
      <!-- 权限id -->
        <q-input id="groupId" class="col-xs-12 col-lg-6" v-model="searches.groupId" @blur="$v.searches.groupId.$touch" :stack-label='$t("permissionsID")' />
        <!--<span style="color: red" class="message" v-if="!$v.searches.groupId.integer">{{$t("positiveInteger")}}</span>
        <span style="color: red" class="message" v-if="!$v.searches.groupId.minValue">{{$t("minValue")}}</span>
        <span style="color: red" class="message" v-if="!$v.searches.groupId.maxValue">{{$t("maxValue")}}</span>-->
      <!-- 权限名称 -->
        <q-input id="name" class="col-xs-12 col-lg-6"  v-model="searches.name" :stack-label='$t("permissionName")' />

         <p> </p>
        <q-btn id="selectGroupButton" color="blue" :label='$t("searches")' v-close-overlay  @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectGroupButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>
        </div>
      </template>

      <template slot="top-right" slot-scope="props">
        <span id="styleGroupMent">
        <q-table-columns
          id="groupIdColumnLabel"
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
        <!-- <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow"  v-show="selected.length==1"/> -->
        </span>
      </template>

      <!-- 自定义单元格 -->
      <q-td slot="body-cell-groupId" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"  v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn> {{ props.value }}
     </q-td>

     <!-- 自定义单元格 -->
      <q-td slot="body-cell-permission" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
       <q-chip  color="secondary"> <q-btn  id="control"   flat  class="on-center"  @click="toView(props)"  > {{$t("toViewValue")}}</q-btn></q-chip> 
     </q-td>
    </q-table>
    
    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("accountWillBeDeleted")}}</p>

       <div  id="confirmDelete"> <q-btn color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/></div>
      </div>
    </q-modal>
     <!-- 查看权限值页面 -->
     <q-modal v-model="minimizeToViewModal" minimized ref="modalRef">
      <div style="padding: 50px">
           <q-list-header>{{$t("toViewPermissions")}}</q-list-header>
              <q-item v-for="(item, index) in permissionList" :key="`${index}`" v-close-overlay>
                <q-item-main>
                  <q-item-tile label :id="`${index}permission`">{{item}}</q-item-tile>
                </q-item-main>
              </q-item>
            <p> </p>
       <div  id="goBack"> <q-btn  color="blue"   v-close-overlay :label='$t("goBack")' @click="cancelEdit"/></div>
      </div>
    </q-modal>
    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
        <div style="padding: 30px">
  
        <p class="caption">{{$t("updateInformation")}}</p>
        
       <q-input v-model="editGroup.updateGroup.groupId" :stack-label='$t("groupId")'    :readonly="true"  />
       <q-input v-model="editGroup.updateGroup.name" :stack-label='$t("permissionName")'    />
         <span style="color: red" class="message" v-if="!$v.editGroup.updateGroup.name.required">{{$t("permissionNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editGroup.updateGroup.name.maxLength">{{$t("permissionNameCannotGreaterThaN64")}}</span>
        <!--<span style="color: red" class="message" v-if="!$v.editGroup.updateGroup.name.minLength">{{$t("permissionNameCannotGreaterThaN64")}}</span>-->
    
      <p>  </p>
       <!-- <q-input v-model="updateAdmin.groupName" :stack-label='$t("groupName")'    /> -->
       <p class="caption">{{$t("permissionValues")}}</p>
 
         <q-select
            
            chips
            color="amber"
            multiple
            v-model="editGroup.select"
            :options="editGroup.groupPermissions"
          /><br/>
          <p> </p>
       <q-btn id="updateGroup"  color="blue" v-close-overlay @click="updateUser" >{{$t("updata")}}</q-btn> &nbsp;&nbsp;
       <q-btn color="blue" v-close-overlay @click="cancelEdit" >{{$t("cancel")}}</q-btn>
       </div>

    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
  import {getPermissions, getPermissionsNumber, updateGroup,  getGroupValue,deleteGroups} from '../interface/getData'
  import {notifyErr, notifyOk} from '#/libs/notify'
  import {i18n} from '../plugins/i18n'
  import {integer, maxValue, minValue,maxLength, minLength,required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import {pageUrls, requestUrls} from "../util/env";
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import { helpers, numeric } from 'vuelidate/lib/validators' 
  import limitNum from '../libs/onlyNum';

  export default {
  name: 'GroupManage',

  data() {
    return {
      rowKey: "id",
      admins: [],
      columns: [],
      serverPagination:{
        page:1,
        rowsPerPage:5,
        rowsNumber:10,
      },
      loading: false,
      filter: '',
      searches: {
       permissions:[],
       options:[],
      },
      visibleColumns: [],
    
      selections: {
        selectMode: "none",
        selected:[],
      },
      changePage:1,
      editGroup:{
        updateGroup:{ },
        oldGroup:{},
        select:[],
        groupPermissions:[],
      },
      permissionList:[],
      minimizedModal: false,
      minimizeEditModal:false,
      minimizeToViewModal:false,
      according:true
      // total:0,
      // valName: 'validatorName'
    };


  },
  validations() {
   return {
    searches:{
       groupId:{
         integer,
         minValue:minValue(1),
         maxValue:maxValue(9999)
    },
    },
   
    changePage:{
      integer,
      // [this.valName]: maxValue(this.total),
      minValue:minValue(1),
      // maxValue:maxValue(6),
      // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),
      
    },
    editGroup:{
      updateGroup:{
        name:{
              required,
              minLength: minLength(4),
              maxLength: helpers.regex('maxLength', /^[^ ]{4,64}$/)
        },

    },
 
 }
     }
  },


  async beforeMount() {
    const adminColLabels = {
      groupId: i18n.t('groupId'),
      name: i18n.t('permissionName'),
      permission: i18n.t('permissionValues'),
     
    };

    if(await this.loadTbData() === false) return;
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
   
     
      if(await this.getGroupValue() === false) return;
      //this.editGroup.select = this.permission;
      
     this.total= Math.ceil(this.serverPagination.rowsNumber/this.serverPagination.rowsPerPage)
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

    confirmDelete: {
      get: function () {

      },
      set: async function (v) {
        const data = this.selections.selected.map(x => x.groupId).toString();
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

directives: {
      limitNum
    },
  methods: {
    getValue(a){
      //进行验证
     
       if(eval(this.changePage) <= eval(a) && this.changePage !=0 && eval(this.changePage) >= eval(1)){
           this.serverPagination.page=parseInt(this.changePage)
         
           this.request({
           pagination: this.serverPagination,
           filter: this.filter
           })
        }else{
        notifyErr(i18n.t('pageIndexOut'));
        }
    },
    async loadTbData(page,rowsNumber,sort,sortValue,searches) {
      if (this.$v.searches.groupId.$error){
          this.$q.notify(i18n.t('permissionsIDInputError'))
           return
      }
      const data = {}
      if(page){data.page = page}
      // if(rowsNumber){data.size = rowsNumber}
      if(rowsNumber){
        this.according=true
        data.size = rowsNumber
      }else if(rowsNumber=="0"){
        this.according=false
        data.size=this.serverPagination.rowsNumber
      }else{data.size = this.serverPagination.rowsPerPage}
      if(sort && sortValue){data.sort = "DESC"}else{data.sort = "ASC"}
      if(sortValue){data.sortValue = sortValue}

      if(this.searches.groupId){data.groupId = this.searches.groupId}
      if (this.searches.name){data.name =this.searches.name}
       
      //this.changePage=1
      const a = await getPermissionsNumber({...data})
      this.serverPagination.rowsNumber=a.data

   
      const r  = await getPermissions({...data});
     
      if (r.status && checkHttp(r.status)) {
        this.admins = r.data;
        this.admins = this.admins.map(x => ({...x})); //扁平化对象
        return true;
      } else
        return false;
    },

    async getGroupValue() {
      let groupValue = await getGroupValue();
    
      for (let values of groupValue.data){
        let groupValues = values.slice(5)
      
         this.editGroup.groupPermissions.push({
          label:groupValues,
          value:groupValues
        })
      }

    },


    deleteRow () {
        this.minimizedModal = true;
    },
    editRow(v){
     
       this.minimizeEditModal = true;
      let data = v.row;
     
     this.editGroup.updateGroup={...data};
     this.editGroup.select=this.editGroup.updateGroup.permission;
  
     this.editGroup.oldGroup={...data};
     this.editGroup.oldPermission=this.editGroup.updateGroup.permission;

    },
   toView(v){
      this.minimizeToViewModal = true;
     
      this.permissionList=v.value
   },

    toggleFullscreen () {
      this.$q.fullscreen.toggle()
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
      const paginationData  = await this.loadTbData(pagination.page-1,pagination.rowsPerPage,pagination.descending,pagination.sortBy,this.searches);
      this.serverPagination = pagination
      this.serverPagination.rowsNumber=pagination.rowsNumber
   
      this.changePage=pagination.page
      this.loading = false
      this.total= Math.ceil(this.serverPagination.rowsNumber/this.serverPagination.rowsPerPage)
    },
    //取消
     async cancelEdit() {
       // this.selections.selected=[]
      // this.editGroup.password=''
      //  await this.loadTbData(this.changePage-1);
      
    },
    //重置
    async Searches() {
      this.searches.groupId = '';
      this.searches.name = '';
    },
    // 修改
    async updateUser(){
      const data={}
      if(this.editGroup.updateGroup.name   && this.editGroup.updateGroup.name != this.editGroup.oldGroup.name ){

            data.name=this.editGroup.updateGroup.name
      }
      
      if(this.editGroup.select != this.editGroup.oldPermission){
           data.permission=this.editGroup.select
      }
      if(data.name  || data.permission){
         data.id=this.editGroup.updateGroup.id
         const a= await updateGroup(data)
      }
      if(JSON.stringify(this.editGroup.updateGroup)!=JSON.stringify(this.editGroup.oldGroup ) || this.editGroup.select!=this.editGroup.oldPermission ){
       
        //await this.loadTbData(this.changePage-1);
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

  },

}

</script>
<style>
#changeInput{
  text-align:center;
  width:20%;
}
/*#groupId,#name{
   width:80%;
}*/

#turnPage{
  width:200px; height:40px
}
#goBack{
  text-align:center
}
#styleGroupMent{
  position: absolute;
  top: 85%;
  right: 2%
}
#groupIdColumnLabel{
  position: absolute;
  top: 20%;
  right: 100%
  }
#selectGroupButton {
  top: 10px;
  width: 100px;
  height: 40px;
}
</style>
