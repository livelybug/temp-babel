<template>
  <q-page padding class="docs-table">

    <p class="caption">{{this.$t('projectList')}}</p>
    <q-table
      :data="projects"
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
          <span style="color: red" class="message" v-if="!$v.changePage.integer">{{$t("positiveInteger")}}</span>
     <q-btn
        round dense size="sm" icon="redo" color="secondary"
        :disable="props.isLastPage"
        @click="props.nextPage"
      />
    
    </div>
      <template slot="top-left" slot-scope="props" :props="props">
        <div class="row" style="width: 100%">
      <!-- 项目id -->
        <q-input id="project_id" class="col-xs-12 col-lg-6" type="number" oninput="if(value>9999)value=9999;if(value<1)value=''" v-model="searches.project_id" @blur="$v.searches.project_id.$touch" :stack-label='$t("projectId")' /><br/>
        <!--<span style="color: red" class="message" v-if="!$v.searches.project_id.integer">{{$t("positiveInteger")}}</span>
        <span style="color: red" class="message" v-if="!$v.searches.project_id.minValue">{{$t("minValue")}}</span>
        <span style="color: red" class="message" v-if="!$v.searches.project_id.maxValue">{{$t("maxValue")}}</span>-->

        <!-- 项目名称 -->
        <q-input id="name" class="col-xs-12 col-lg-6" v-model="searches.name" :stack-label='$t("projectName")' /><br/>
        <!-- 省 -->
         <q-select
            id="province"
            class="col-xs-12 col-lg-6"
            v-model="searches.province"
            :options="searches.optionProvince"
            v-on:input="findCity()"
            :stack-label='$t("province")'
            clearable
          />
        <!-- 市 --> 
         <q-select
            id="city"
            class="col-xs-12 col-lg-6"
            v-model="searches.city"
            :options="searches.optionCity"
             v-on:input="findDistrict()"
            :stack-label='$t("city")'
            clearable
          />
        <!-- 区 -->
         <q-select
            id="district"
            class="col-xs-12 col-lg-6"
            v-model="searches.district"
            :options="searches.optionDistrict"
            :stack-label='$t("district")'
            clearable
        />
        <!-- 详细地址 -->
        <q-input id="details" class="col-xs-12 col-lg-6" v-model="searches.details" :stack-label='$t("details")' /><br/>
        <!-- 邮政编码 -->
        <q-input id="postcode" class="col-xs-12 col-lg-6" type="number" v-model="searches.postcode" :stack-label='$t("postcode")' @blur="$v.searches.postcode.$touch()" /><br/>
                 <!--<span style="color: red" class="message" v-if="!$v.searches.postcode.postcodeLimit">{{$t("postcodeFormatError")}}</span>-->
        </div>
         <p> </p>
        <q-btn id="selectAdminsButton" color="blue" :label='$t("searches")' v-close-overlay  @click="loadTbData(0,serverPagination.rowsPerPage,serverPagination.descending,serverPagination.sortBy,searches,changePage=1,serverPagination.page=1)"/>
        <!--重置按钮-->&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn id="selectAdminsButton" color="blue" @click="Searches()" :label='$t("reset")'></q-btn>

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
      <q-td slot="body-cell-project_id" slot-scope="props" :props="props">
        <q-btn color="secondary" flat round class="on-right" icon="mode_edit" @click="editRow(props)"  v-show="selections.selectable">
          <q-tooltip>{{$t("updata")}}</q-tooltip>
        </q-btn>{{ props.value }}
     </q-td>
      
      <!-- 自定义单元格 查看管理人员信息-->
      <q-td slot="body-cell-supervisor" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn  id="control" color="secondary"   flat round class="on-center"  @click="toViewSupervisor(props)"  >  {{ props.value }}</q-btn> 
     </q-td>

     <!-- 自定义单元格 查看地址-->
      <q-td slot="body-cell-project_address" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn  id="control" color="secondary"   flat round class="on-center"  @click="toViewAddress(props)"  >  {{ props.value.province }}</q-btn> 
     </q-td>

     <!-- 自定义单元格 查看项目说明-->
      <q-td slot="body-cell-comment" slot-scope="props" :props="props">
        <!-- <q-chip color="secondary">{{ props.value }}</q-chip> -->
        <q-btn  id="control" color="secondary"   flat round class="on-center"  @click="toViewComment(props)"  >   {{$t("toViewValue")}}</q-btn> 
     </q-td>
    </q-table>
    
    <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("projectWillBeDeleted")}}</p>

        <q-btn id="sureDeleteProject" color="red" v-close-overlay :label='$t("confirm")' @click="confirmDelete=1"/>
      </div>
    </q-modal>
    <!-- 修改页面 -->
    <q-modal v-model="minimizeEditModal" minimized ref="modalRef">
        <div style="padding: 30px">
  
        <p class="caption">{{$t("updateInformation")}}</p>
        
       <q-input v-model="editProject.updateProject.project_id" :stack-label='$t("projectId")'    :readonly="true"  />
       <q-input v-model="editProject.updateProject.name" :stack-label='$t("projectName")'    />
         <span style="color: red" class="message" v-if="!$v.editProject.updateProject.name.required">{{$t("projectNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.editProject.updateProject.name.maxLength">{{$t("projectNameNothan")}}</span>
        <span style="color: red" class="message" v-if="!$v.editProject.updateProject.name.minLength">{{$t("projectNameNothan")}}</span>
     
       <p>  </p>
       <p class="caption">{{$t("supervisor")}}</p>
        
       <q-select
              v-model="editProject.select"
              :options="editProject.adminList"
        />
        <p>  </p>
        <p class="caption">{{$t("projectAddress")}}</p>
         <!-- 省 -->
         <q-select
            v-model="editProject.project_address.province"
            :options="editProject.updateProvince"
            v-on:input="findCity()"
            :stack-label='$t("province")'
          /><br/>
        <!-- 市 --> 
         <q-select
            v-model="editProject.project_address.city"
            :options="editProject.updateCity"
             v-on:input="findDistrict()"
            :stack-label='$t("city")'
          /><br/>
        <!-- 区 -->
         <q-select
            v-model="editProject.project_address.district"
            :options="editProject.updateDistrict"
             v-on:input="findDetails()"
            :stack-label='$t("district")'
        /><br/>
          <!-- 详细地址 -->
        <q-input id="details" v-model="editProject.project_address.details" :stack-label='$t("details")' /><br/>
        <span style="color: red" class="message" v-if="!$v.editProject.project_address.details.maxLength">{{$t("detailsNothan")}}</span>
        <span style="color: red" class="message" v-if="!$v.editProject.project_address.details.minLength">{{$t("detailsNothan")}}</span>
        <!-- 邮政编码 -->
        <q-input id="postcode" v-model="editProject.project_address.postcode" :stack-label='$t("postcode")'  @blur="$v.editProject.project_address.postcode.$touch()" /><br/>
        <span style="color: red" class="message" v-if="!$v.editProject.project_address.postcode.postcodeLimit">{{$t("postcodeFormatError")}}</span>
        <!-- 项目说明 -->
        <q-input id="postcode" v-model="editProject.updateProject.comment" :stack-label='$t("comment")' /><br/>
          <span style="color: red" class="message" v-if="!$v.editProject.updateProject.comment.maxLength">{{$t("commentNothan")}}</span>
        <p> </p>
       <q-btn id="updateProject"  color="blue" v-close-overlay @click="updateInfo" >{{$t("updata")}}</q-btn> &nbsp;&nbsp;
       <q-btn color="blue" v-close-overlay @click="cancelEdit" >{{$t("cancel")}}</q-btn>
       </div>

    </q-modal>

     <!-- 查看详细地址页面 -->
     <q-modal v-model="minimizetoViewAddress" minimized ref="modalRef">
      <div  style="padding: 20px">
          <p id="detailed"  class="caption">{{$t("projectAddress")}}</p>
            <q-input v-model="this.toview.proAddress.province" :stack-label='$t("province")'    :readonly="true"  />
            <q-input v-model="this.toview.proAddress.city" :stack-label='$t("city")'    :readonly="true"  />
            <q-input v-model="this.toview.proAddress.district" :stack-label='$t("district")'    :readonly="true"  />
            <q-input v-model="this.toview.proAddress.details" :stack-label='$t("details")'    :readonly="true"  />
            <q-input v-model="this.toview.proAddress.postcode" :stack-label='$t("postcode")'    :readonly="true"  />
            <p> </p>
       <div  id="goBack"> <q-btn  color="blue"   v-close-overlay :label='$t("goBack")' @click="cancelEdit"/></div>
      </div>
    </q-modal>

     <!-- 查看管理人员页面 -->
     <q-modal v-model="minimizetoViewSupervisor" minimized ref="modalRef">
      <div  style="padding: 20px">
          <p id="userDetailed"  class="caption">{{$t("supervisorInfo")}}</p>
            <q-input v-model="this.toview.admin.login_name" :stack-label='$t("loginName")'    :readonly="true"  />
            <q-input id="projectDisplayName" v-model="this.toview.admin.display_name" :stack-label='$t("displayName")'    :readonly="true"  />
            <q-input v-model="this.toview.admin.group.name" :stack-label='$t("groupName")'    :readonly="true"  />
            <q-input v-model="this.toview.admin.disabled" :stack-label='$t("disabled")'    :readonly="true"  />
           
            <p> </p>
       <div  id="userGoBack"> <q-btn  color="blue"   v-close-overlay :label='$t("goBack")' @click="cancelEdit"/></div>
      </div>
    </q-modal>

     <!-- 查看项目说明页面 -->
     <q-modal v-model="minimizetoViewComment" minimized ref="modalRef">
      <div  style="padding: 20px">
          <p id="projectDetailed"  class="caption">{{$t("comment")}}</p>
            <!-- &nbsp;&nbsp;&nbsp;&nbsp;{{ toview.comment }} -->
            <p  id="toComment">{{ toview.comment }}<br/>
            <p> </p>
       <div  id="projectGoBack"> <q-btn  color="blue"   v-close-overlay :label='$t("goBack")' @click="cancelEdit"/></div>
      </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
  import {deleteProject, getProjects, getProjectNumber,getAdmins,getAddressValue,getAdminsNumber,updateProject} from '../interface/getData'
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
  name: 'ProjectManage',

  data() {
    return {
      rowKey: "id",
      projects: [],
      columns: [],
      serverPagination:{
        page:1,
        rowsPerPage:5,
        rowsNumber:10,
      },
      loading: false,
      filter: '',
      searches: {
        optionProvince:[],
        optionCity:[],
        optionDistrict:[],
        district:''
      },
      visibleColumns: [],
    
      selections: {
        selectMode: "none",
        selected:[],
      },
      changePage:1,
      editProject:{
        updateProject:{ 
          district:''
         },
        oldProject:{},
        select:'',
        adminList:[],
        updateProvince:[],
        updateCity:[],
        updateDistrict:[],
        project_address:{},
        oldAddress:{}
      },
      toview:{
        admin:{
          group:{}
        },
        proAddress:{},
        
      },
      minimizedModal: false,
      minimizeEditModal:false,
      minimizetoViewAddress:false,
      minimizetoViewSupervisor:false,
      minimizetoViewComment:false,
      according:true,
    };


  },
  validations() {
   return {
    searches:{
       project_id:{
         integer,
         minValue:minValue(1),
         maxValue:maxValue(9999)
    },
    postcode:{
       postcodeLimit: helpers.regex('postcodeLimit',/\d$/)
    }
    },
   
    changePage:{
      integer,
      // [this.valName]: maxValue(this.total),
      minValue:minValue(1),
      // maxValue:maxValue(6),
      // changePageLimit: helpers.regex('changePageLimit',/^[1-9]\d*$/),
      
    },
    editProject:{
      updateProject:{
        name:{
              required,
              minLength: minLength(3),
              maxLength: helpers.regex('maxLength', /^.{3,128}$/)
        },
        comment:{
              maxLength: helpers.regex('maxLength', /^.{1,500}$/)
        }

    },

   project_address:{
     details:{
              minLength: minLength(6),
              maxLength: helpers.regex('maxLength', /^.{1,256}$/)
     },
     postcode:{
          postcodeLimit: helpers.regex('postcodeLimit',/^([0-8][0-7])\d{4}$/)
     }
   }
 }
     }
  },


  async beforeMount() {
    const adminColLabels = {
      project_id: i18n.t('projectId'),
      name: i18n.t('projectName'),
      supervisor: i18n.t('supervisor'),
      comment: i18n.t('comment'),
      project_address: i18n.t('projectAddress'),
    };

    if(await this.loadTbData() === false) return;
    this.deleteRow2 = true;
    const anProject = this.projects[0];
    this.columns = Object.keys(anProject).filter(x => adminColLabels[x]).map(x => ({
          name: x,
          required: false,  // 是否在初始页面显示此字段
          label: adminColLabels[x],
          field: x,
          align: 'center',
          sortable: true,
        }));
   
    this.visibleColumns = Object.keys(adminColLabels);
   
      const adminNumber = await getAdminsNumber();
      const data = {};
      data.size = adminNumber.data;
      const r = await getAdmins({...data});
     
      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.display_name;
          x.value = x.login_name
        });
     
        this.editProject.adminList = r.data;
      }

      if(await this.getAddressValue() === false) return;
      // this.editProject.select = this.groupId;

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
        const data = this.selections.selected.map(x => x.id).toString();
        const r = await deleteProject(data);
       
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
      if (this.$v.searches.project_id.$error){
          this.$q.notify(i18n.t('permissionsIDInputError'))
           return
      }
      const data = {}
      if(page){data.page = page}
      if(rowsNumber){
        this.according=true
        data.size = rowsNumber
      }else if(rowsNumber=="0"){
        this.according=false
        data.size=this.serverPagination.rowsNumber
      }
      if(sort && sortValue){data.sort = "DESC"}else{data.sort = "ASC"}
      if(sortValue){data.sortValue = sortValue}


      if(this.searches.project_id){data.project_id = this.searches.project_id}
      if(this.searches.name){data.name = this.searches.name}
      if(this.searches.province){data.province = this.searches.province}
      if (this.searches.city){data.city =this.searches.city}
      if (this.searches.district){data.district =this.searches.district}
      if (this.searches.details){data.details =this.searches.details}
      if (this.searches.postcode){data.postcode =this.searches.postcode}
    
      //this.changePage=1
      const a = await getProjectNumber({...data})
      this.serverPagination.rowsNumber=a.data

     
      const r  = await getProjects({...data});
   
      if (r.status && checkHttp(r.status)) {
        this.projects = r.data;
        this.projects = this.projects.map(x => ({...x})); //扁平化对象
        return true;
      } else
        return false;
    },

    //获取省
    async getAddressValue() {
      let addValue = await getAddressValue();
    
      for (let values of addValue.data){
        this.searches.optionProvince.push({
          label:values,
          value:values
        })
      }
      for (let values of addValue.data){
        this.editProject.updateProvince.push({
          label:values,
          value:values
        })
      }
     
    },
    //获取市
    async findCity(){
       this.searches.optionCity=[]
       this.searches.optionDistrict=[]
       this.searches.city=''
       this.searches.district=''
      
      if(this.searches.province){
         const data={}
         data.province=this.searches.province
         let addValue = await getAddressValue({...data});
         for (let values of addValue.data){
           this.searches.optionCity.push({
             label:values,
             value:values
         })
        }
      }
     
        this.editProject.updateCity=[]
         this.editProject.updateDistrict=[]
         this.editProject.project_address.city=''
         this.editProject.project_address.district=''
         this.editProject.project_address.details=''
         this.editProject.project_address.postcode=''
        if(this.editProject.project_address.province){
         const data={}
         data.province=this.editProject.project_address.province
         let addValue = await getAddressValue({...data});
         for (let values of addValue.data){
           this.editProject.updateCity.push({
             label:values,
             value:values
         })
        }
     
     } 
    },

    //获取区
    async findDistrict(){
      this.searches.optionDistrict=[]
          this.searches.district=''
          if(this.searches.province && this.searches.city){
          const data={}
          data.province=this.searches.province
          data.city=this.searches.city
          let addValue = await getAddressValue({...data});
          for (let values of addValue.data){
             this.searches.optionDistrict.push({
               label:values,
               value:values
             })
          }
      }
        this.editProject.updateDistrict=[]
          this.editProject.project_address.district=''
          this.editProject.project_address.details=''
          this.editProject.project_address.postcode=''
          if(this.editProject.project_address.province && this.editProject.project_address.city){
          const data={}
          data.province=this.editProject.project_address.province
          data.city=this.editProject.project_address.city
          let addValue = await getAddressValue({...data});
          for (let values of addValue.data){
             this.editProject.updateDistrict.push({
               label:values,
               value:values
             })
          }
      }
      
    },
    //清空详细地址
    findDetails(){
       this.editProject.project_address.details=''
       this.editProject.project_address.postcode=''
    },


    deleteRow () {
        this.minimizedModal = true;
    },
   async  editRow(v){
     
       this.minimizeEditModal = true;
      let d = v.row;
     
      this.editProject.updateProject={...d};
      this.editProject.select=this.editProject.updateProject.supervisor;
      const pro=this.editProject.updateProject.project_address
      this.editProject.project_address={...pro}
      this.editProject.oldAddress={...pro}
      this.editProject.oldProject={...d};
      this.editProject.oldSelect=this.editProject.updateProject.supervisor;
      const data={}
      data.province=this.editProject.project_address.province
      let addValue = await getAddressValue({...data});
      for (let values of addValue.data){
             this.editProject.updateCity.push({
               label:values,
               value:values
             })
      }

      data.city=this.editProject.project_address.city
          let addw = await getAddressValue({...data});
          for (let values of addw.data){
             this.editProject.updateDistrict.push({
               label:values,
               value:values
             })
        }
    },

    toViewAddress(v){
        this.minimizetoViewAddress = true;
     
        this.toview.proAddress=v.value;
      
    },

    toViewComment(v){
        this.minimizetoViewComment=true
     
        this.toview.comment=v.value
    },
    async toViewSupervisor(v){
          if(v.value){
              this.minimizetoViewSupervisor = true;
               const data={}
               data.exactLoginName=v.value
              const r =await getAdmins({...data})
              this.toview.admin=r.data[0]
         
          }
         
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
      const paginationData  = await this.loadTbData(pagination.page-1,pagination.rowsPerPage,pagination.descending,pagination.sortBy,this.searches);
      this.serverPagination = pagination
      this.serverPagination.rowsNumber=pagination.rowsNumber
   
      this.changePage=pagination.page
      this.loading = false
      this.total= Math.ceil(this.serverPagination.rowsNumber/this.serverPagination.rowsPerPage)
    },
    //取消
     async cancelEdit() {
       this.editProject.updateProject.name=''
      this.editProject.select=''
      this.editProject.project_address.province=''
      this.editProject.project_address.city=''
      this.editProject.project_address.district=''
      this.editProject.project_address.details=''
      this.editProject.project_address.postcode=''
      
    },
    //重置
    async Searches() {
      this.searches.project_id = '';
      this.searches.name = '';
      this.searches.province = '';
      this.searches.city = '';
      this.searches.district = '';
      this.searches.details = '';
      this.searches.postcode = '';
    },

    // 修改
    async updateInfo(){
       const data={}
      if(this.editProject.updateProject.name   && this.editProject.updateProject.name != this.editProject.oldProject.name ){

            data.name=this.editProject.updateProject.name
      }
      if(this.editProject.select != this.editProject.oldSelect){
           data.supervisor=this.editProject.select
      }
      if( this.editProject.updateProject.comment != this.editProject.oldProject.comment ){
            data.comment=this.editProject.updateProject.comment
      }

      if(JSON.stringify(this.editProject.project_address)!=JSON.stringify(this.editProject.oldAddress )){
           const  address ={}
           address.province=this.editProject.project_address.province
           address.city=this.editProject.project_address.city
           address.district=this.editProject.project_address.district
           address.details=this.editProject.project_address.details
           address.postcode=this.editProject.project_address.postcode

           data.project_address=address
         
      }
     
    
      if(data.name || data.supervisor || data.comment || data.project_address){
         data.id=this.editProject.updateProject.id
        const a= await updateProject(data)
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
/*#project_id,#name,#details,#postcode{
   width:80%;
}
#province,#city,#district{
  width:80%;
}*/

#turnPage{
  width:200px; height:40px
}
#goBack,#detailed,#projectGoBack,#projectDetailed,#userDetailed,#userGoBack{
  text-align:center
}
#toComment{
  text-indent:2em;
}
#styleAdjustment{
  position: absolute;
  top: 90%;
  right: 2%
}
#columnLabel{
  position: absolute;
  top: 20%;
  right: 100%
}
#selectAdminsButton{
  top: 10px;
  width: 100px;
  height: 40px;
}
</style>
