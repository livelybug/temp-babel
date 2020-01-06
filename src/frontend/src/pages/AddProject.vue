<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addProject")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input id="addProjectName" :class="{'error': $v.addDate.name.$error}" v-model="addDate.name" :stack-label='$t("projectName")' @blur="$v.addDate.name.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.name.projectNameLimit">{{$t("projectNameFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.name.$dirty && !$v.addDate.name.required">{{$t("projectNameNotEmpty")}}</span>
         
        <q-select
          id="addSupervisor"
          :stack-label='$t("supervisor")'
          v-model="addDate.select"
          :options="supervisorList"
        />

          <p> </p>
         <p class="caption">{{$t("projectAddress")}}</p>
            <!-- 省 -->
         <q-select
            id="addProvince"
            v-model="addDate.projectAddress.province"
            :options="optionProvince"
            v-on:input="findCity()"
            :stack-label='$t("province")'
          /><br/>
        <!-- 市 --> 
         <q-select
            id="addCity"
            v-model="addDate.projectAddress.city"
            :options="optionCity"
             v-on:input="findDistrict()"
            :stack-label='$t("city")'
          /><br/>
        <!-- 区 -->
         <q-select
            id="addDistrict"
            v-model="addDate.projectAddress.district"
            :options="optionDistrict"
             v-on:input="findDetails()"
            :stack-label='$t("district")'
        /><br/>
        <!-- 详细地址 -->
        <q-input id="details" v-model="addDate.projectAddress.details" :stack-label='$t("details")' @blur="$v.addDate.projectAddress.details.$touch() " v-on:blur="determineArea()"/><br/>
        <span style="color: red" class="message" v-if="$v.addDate.projectAddress.details.$dirty && !$v.addDate.projectAddress.details.required">{{$t("detailsNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.addDate.projectAddress.details.maxLength">{{$t("detailsNothan")}}</span>
        <!--<span style="color: red" class="message" v-if="!$v.addDate.projectAddress.details.minLength">{{$t("detailsNothan")}}</span>-->
        <!-- 邮政编码 -->
        <q-input id="postcode" v-model="addDate.projectAddress.postcode" type="number" :stack-label='$t("postcode")' @blur="$v.addDate.projectAddress.postcode.$touch()"  v-on:blur="determineArea()"/><br/>
         <span style="color: red" class="message" v-if="!$v.addDate.projectAddress.postcode.postcodeLimit">{{$t("postcodeFormatError")}}</span>
        <!-- 项目说明 -->
        <q-input id="postcode" v-model="addDate.comment" :stack-label='$t("comment")'  @blur="$v.addDate.comment.$touch()"/><br/>
          <span style="color: red" class="message" v-if="!$v.addDate.comment.maxLength">{{$t("commentNothan")}}</span>

      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" id="addAdminAddButton" @click='addProjectData(addDate)'>{{$t("append")}}</q-btn>
        <q-btn color="blue" id="addAdminCancelButton" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addProject,getAdmins, getAdminsNumber,getAddressValue} from '#/interface/getData'
  import {httpStatus} from '#/util/env'
  import {maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import { helpers } from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'
  import {notifyErr, notifyOk} from '#/libs/notify'

  export default {
    data() {
      return {
        form: {},
        supervisorList: [],
        addDate: {
          projectAddress:{
            details:'',
            postcode:'',
            province:'',
            city:'',
            district:''
          }
        },
        optionProvince:[],
        optionCity:[],
        optionDistrict:[]
      }

    },
    validations:{
      addDate: {
        name: {
          required: required,
          projectNameLimit: helpers.regex('projectNameLimit',/^.{3,128}$/)
        },
        comment:{
         maxLength: helpers.regex('maxLength', /^.{1,500}$/)
        },
        projectAddress: {
         details:{
           required: required,
           minLength: minLength(6),
           maxLength: helpers.regex('maxLength', /^.{6,256}$/)
          },
          postcode:{
            postcodeLimit: helpers.regex('postcodeLimit',/^([0-8][0-7])\d{4}$/)
          },
          province:{
              required: required,
          },
          city:{
              required: required,
          },
          district:{
              required: required,
          },
        }
      }

    },
    async beforeMount() {

       const adminNumber = await getAdminsNumber();
      const data = {};
      data.size = adminNumber.data;
      const r = await getAdmins({...data});
    
      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.display_name;
          x.value = x.login_name
        });
      
        this.supervisorList = r.data;
      }

       if(await this.getAddressValue() === false) return;
     
    },

    methods: {

      async addProjectData(data) {

        if (this.$v.addDate.name.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }
        const projectData = {};
        const address={};
        projectData.name = data.name;
        projectData.supervisor = data.select;
        if(data.projectAddress.province ){
          projectData.project_address=data.projectAddress;
        }else{
           notifyErr(i18n.t('determineArea'));
           return
        }
        projectData.comment=data.comment;
        
     
        const rv = await addProject(projectData)
       
        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      async clearEmpty(){
        this.addDate.name="";
        this.addDate.select="";
        this.optionCity=[]
         this.optionDistrict=[]
         this.addDate.projectAddress.province=''
         this.addDate.projectAddress.city=''
         this.addDate.projectAddress.district=''
         this.addDate.projectAddress.details=''
         this.addDate.projectAddress.postcode=''
    
      },


      async getGroupValue() {
        const groupValue = await getPermissions();
      },
      
      //获取省
      async getAddressValue() {
      let addValue = await getAddressValue();
      
      for (let values of addValue.data){
        this.optionProvince.push({
          label:values,
          value:values
        })
      }
    
    },
       //获取市
    async findCity(){
         this.optionCity=[]
         this.optionDistrict=[]
         this.addDate.projectAddress.city=''
         this.addDate.projectAddress.district=''
         this.addDate.projectAddress.details=''
         this.addDate.projectAddress.postcode=''
         if(this.addDate.projectAddress.province){
         const data={}
         data.province=this.addDate.projectAddress.province
         let addValue = await getAddressValue({...data});
         for (let values of addValue.data){
           this.optionCity.push({
             label:values,
             value:values
         })
         }
        }
     
      
    },

    //获取区
    async findDistrict(){
          this.optionDistrict=[]
          this.addDate.projectAddress.district=''
           this.addDate.projectAddress.details=''
           this.addDate.projectAddress.postcode=''
           if(this.addDate.projectAddress.province && this.addDate.projectAddress.city){

          
          const data={}
          data.province=this.addDate.projectAddress.province
          data.city=this.addDate.projectAddress.city
          let addValue = await getAddressValue({...data});
          for (let values of addValue.data){
             this.optionDistrict.push({
               label:values,
               value:values
             })
            }
         }
    
      
    },
    //清空详细地址
    findDetails(){
       this.addDate.projectAddress.details=''
       this.addDate.projectAddress.postcode=''
    },
    //确认地区
    determineArea(){
   
     
       if(!(this.addDate.projectAddress.province && this.addDate.projectAddress.city && this.addDate.projectAddress.district)){
         notifyErr(i18n.t('determineArea'));
       }
     }
    }
  }
</script>

<style lang="stylus">
  .card-examples
    .q-card
      width 300px
    .bigger
      width 450px
      max-width 90vw
    @media (max-width $breakpoint-xs-max)
      .q-card
        width 100%


</style>
