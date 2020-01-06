<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addDevice")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input v-model="updateDevice.deviceId" @blur="$v.updateDevice.deviceId.$touch" :stack-label='$t("deviceId")' />
        <span style="color: red" class="message" v-if="$v.updateDevice.deviceId.$dirty && !$v.updateDevice.deviceId.required">{{$t("deviceIdNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.deviceId.maxLength">{{$t("deviceIdNothan")}}</span>

        <q-input v-model="updateDevice.deviceName" @blur="$v.updateDevice.deviceName.$touch" :stack-label='$t("deviceName")' />
        <span style="color: red" class="message" v-if="$v.updateDevice.deviceName.$dirty && !$v.updateDevice.deviceName.required">{{$t("deviceNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.deviceName.maxLength">{{$t("deviceNameNothan")}}</span>

        <q-select
          chips
          color="amber"
          v-model="updateDevice.deviceType"
          :options="searches.options"
          :stack-label='$t("deviceType")'
          @blur="$v.updateDevice.deviceType.$touch"
        />
        <span style="color: red" class="message" v-if="$v.updateDevice.deviceType.$dirty && !$v.updateDevice.deviceType.required">{{$t("deviceNameNotEmpty")}}</span>

        <q-select
          chips
          color="amber"
          v-model="updateDevice.deviceProject"
          :options="project.options"
          :stack-label='$t("deviceProject")'
          @blur="$v.updateDevice.deviceProject.$touch"
        />
        <span style="color: red" class="message" v-if="$v.updateDevice.deviceProject.$dirty && !$v.updateDevice.deviceProject.required">{{$t("deviceNameNotEmpty")}}</span>

        <q-input v-model="updateDevice.gpsAddress" @blur="$v.updateDevice.gpsAddress.$touch" :stack-label='$t("gpsAddress")'  />
        <span style="color: red" class="message" v-if="$v.updateDevice.gpsAddress.$dirty && !$v.updateDevice.gpsAddress.required">{{$t("gpsAddressNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.gpsAddress.gpsAddressLimit">{{$t("gpsAddressLimit")}}</span>

        <!--<p class="caption">{{$t("powerStatus")}}</p>
        <q-radio v-model="updateDevice.powerStatus" val="true" :label='$t("online")'/>&nbsp;&nbsp;&nbsp;
        <q-radio v-model="updateDevice.powerStatus" val="false" :label='$t("offline")' />-->

        <q-select
          v-model="updateDevice.powerStatus"
          :options="selectOptions"
          :stack-label="$t('powerStatus')"
        />

        <!--<q-input v-model="updateDevice.powerStatus" @blur="$v.updateDevice.powerStatus.$touch" :stack-label='$t("powerStatus")'   />
        <span style="color: red" class="message" v-if="$v.updateDevice.powerStatus.$dirty && !$v.updateDevice.powerStatus.required">{{$t("powerStatusNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.powerStatus.powerStatusLimit">{{$t("powerStatusLimit")}}</span>-->

        <q-input type="number" v-model="updateDevice.errorStatus" @blur="$v.updateDevice.errorStatus.$touch" :stack-label='$t("errorStatus")'  />
        <span style="color: red" class="message" v-if="$v.updateDevice.errorStatus.$dirty && !$v.updateDevice.errorStatus.required">{{$t("errorStatusNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.errorStatus.maxLength">{{$t("errorStatusNothan")}}</span>

        <q-input v-model="updateDevice.errorInfo" @blur="$v.updateDevice.errorInfo.$touch" :stack-label='$t("errorInfo")' />
        <span style="color: red" class="message" v-if="$v.updateDevice.errorInfo.$dirty && !$v.updateDevice.errorInfo.required">{{$t("errorInfoNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.updateDevice.errorInfo.maxLength">{{$t("errorInfoNothan")}}</span>

        <q-select
          chips
          multiple
          color="amber"
          v-model="postSale.postSaleValue"
          :options="postSale.options"
          :stack-label='$t("postSale")'
        />
        <!--<q-input v-model="updateDevice.deviceAdmin" :stack-label='$t("deviceAdmin")'   />-->
        <q-select
          chips
          multiple
          color="amber"
          v-model="postSale.deviceAdminValue"
          :options="postSale.options"
          :stack-label='$t("deviceAdmin")'
        />
        <q-input v-model="updateDevice.deviceImei" @blur="$v.updateDevice.deviceImei.$touch" :stack-label='$t("deviceImei")' v-on:blur="determineArea()" />
        <span style="color: red" class="message" v-if=" $v.updateDevice.deviceImei.$dirty && !$v.updateDevice.deviceImei.required && !loraCheck ">{{$t("deviceImeiNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!loraCheck && !$v.updateDevice.deviceImei.maxLength">{{$t("deviceImeiNothan")}}</span>
        <span style="color: red" class="message" v-if="loraCheck && $v.updateDevice.deviceImei.$dirty && !$v.updateDevice.deviceImei.required">{{$t("lorImeiNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="loraCheck && !$v.updateDevice.deviceImei.lorCheck">{{$t("lorNothan")}}</span>

        <q-input v-model="updateDevice.deviceVersion" @blur="$v.updateDevice.deviceVersion.$touch" :stack-label='$t("deviceVersion")'  />
        <span style="color: red" class="message" v-if="!$v.updateDevice.deviceVersion.maxLength">{{$t("deviceVersionNothan")}}</span>
        <span style="color: red" class="error" v-if="$v.updateDevice.deviceVersion.$dirty && !$v.updateDevice.deviceVersion.required">{{$t("deviceVersionNotEmpty")}}</span>

        <q-input type="password" v-model="updateDevice.password" @blur="$v.updateDevice.password.$touch" :stack-label='$t("password")'  />
        <span style="color: red" class="massage" v-if="!$v.updateDevice.password.maxLength">{{$t("passwordError")}}</span>
        <span style="color: red" class="error" v-if="$v.updateDevice.password.$dirty && !$v.updateDevice.password.required">{{$t("passwordNotEmpty")}}</span>


      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" v-close-overlay @click="addDevice(updateDevice,postSale)" >{{$t("append")}}</q-btn> &nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay @click="clearEmpty" >{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {getProductNumber,getProduct, getProjectNumber,getProjects,getCommonNumber,getCommons,addDevice} from '#/interface/getData'
  import {httpStatus} from '#/util/env'
  import {maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import { helpers } from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'
  import {notifyOk, notifyErr} from '#/libs/notify';

  export default {
    data() {
      return {
        selectOptions: [
          {
            label: i18n.t('online'),
            value: 'true'
          },
          {
            label: i18n.t('offline'),
            value: 'false'
          }
        ],
        updateDevice: {
          postSales: [],
          newPostSales: [],
          commonAdmins: []
        },
        postSale: {
          postSaleValue:[],
          deviceAdminValue:[],
          options:[],
        },
        project: {
          permissions:[],
          options:[],
        },
        searches: {
          permissions:[],
          options:[],
        },
        loraCheck:false
      }

    },
    validations:{
      updateDevice:{
        deviceId:{
          required,
          maxLength: helpers.regex('maxLength', /^[^ ]{1,128}$/)
        },
        deviceName:{
          required,
          maxLength: helpers.regex('maxLength', /^[^ ]{1,128}$/)
        },
        deviceType:{
          required
        },
        deviceProject:{
          required
        },
        gpsAddress:{
          required,
          gpsAddressLimit: helpers.regex('gpsAddressLimit', /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)
        },
        powerStatus:{
          required,
          powerStatusLimit:helpers.regex('powerStatusLimit',/^(true)|(false)$/)
        },
        errorStatus:{
          required,
          maxLength: maxLength(9)
        },
        errorInfo:{
          required,
          maxLength: helpers.regex('maxLength', /^[^ ]{1,128}$/)
        },
        deviceImei:{
          lorCheck: helpers.regex('loraCheck', /^[0-9]{15}$|^[0-9]{17}$/),
          required,
          maxLength: helpers.regex('maxLength', /^[a-zA-Z0-9]{1,64}$/)
        },
        deviceVersion:{
          required,
          maxLength: helpers.regex('maxLength', /^[v]\.[\d]{1,32}$/)
        },
        password:{
          required,
          maxLength:helpers.regex('maxLength',/^[a-zA-Z0-9]{16}$/)
        }
      }

    },
    async beforeMount() {

      const data1 = {}
      const productNum = await getProductNumber({...data1});
      const productNumber ={};
      productNumber.size=productNum.data;
      const product = await getProduct({...productNumber});
      
      if(await this.getProductValue(product) === false) return;
      //获取项目名称
      if(await this.getProjectValue() === false) return;
      //获取售后名称
      if(await this.getPostSaleValue() === false) return;


    },

    methods: {

      async addDevice(updateDevice,postSale){

        if (this.$v.updateDevice.deviceId.$error || this.$v.updateDevice.deviceName.$error || this.$v.updateDevice.deviceType.$error || this.$v.updateDevice.deviceProject.$error
          || this.$v.updateDevice.gpsAddress.$error || this.$v.updateDevice.powerStatus.$error || this.$v.updateDevice.errorStatus.$error || this.$v.updateDevice.errorInfo.$error
          || this.$v.updateDevice.deviceImei.lorCheck.$error|| this.$v.updateDevice.deviceImei.maxLength.$error|| this.$v.updateDevice.deviceImei.required.$error
          || this.$v.updateDevice.deviceVersion.$error || this.$v.updateDevice.password.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'));
          return
        }

        const deviceData={
          postSale:[],
          deviceAdmin:[]

        };
        let postSale1 =[];
        let deviceAdmin =[];

       
        deviceData.deviceId = updateDevice.deviceId;
        deviceData.deviceName = updateDevice.deviceName;
        deviceData.deviceType = updateDevice.deviceType;
        deviceData.projectName = updateDevice.deviceProject;
        deviceData.gpsAddress = updateDevice.gpsAddress;
        deviceData.powerStatus = updateDevice.powerStatus;
        deviceData.errorStatus = updateDevice.errorStatus;
        deviceData.errorInfo = updateDevice.errorInfo;
      
        if (postSale.postSaleValue) {
          deviceData.postSale = postSale.postSaleValue;
        }
        if (postSale.deviceAdminValue) {
          deviceData.deviceAdmin = postSale.deviceAdminValue;
        }

        deviceData.deviceImei = updateDevice.deviceImei;
        deviceData.deviceVersion = updateDevice.deviceVersion;
        deviceData.password = updateDevice.password;
     

        const dv = await addDevice(deviceData);
       
        if (dv.status && checkHttp(dv.status)) {
          return true
        }else{
          return false
        }


      },

      //获取产品名称
      async getProductValue(product) {
       
        for (let values of product.data){
          let productName = values.name;
          this.searches.options.push({
            label:productName,
            value:productName
          })
        }

      },

      //获取项目名称
      async getProjectValue() {

        const projectNum = await getProjectNumber();
        const projectNumber ={};
        projectNumber.size=projectNum.data;
        const project = await getProjects({...projectNumber});

      
        for (let values of project.data){
          let projectName = values.name;
          this.project.options.push({
            label:projectName,
            value:projectName
          })
        }

      },

      //获取售后名称
      async getPostSaleValue() {

        const PostSaleNum = await getCommonNumber();
        const PostSaleNumber ={};
        PostSaleNumber.size=PostSaleNum.data;
        const postSale = await getCommons({...PostSaleNumber});
      
        for (let values of postSale.data){
          const postSaleName = values.commonUserName;
          const postSaleLoginName = values.commonUserLoginName;
          this.postSale.options.push({
            label:postSaleName,
            value:postSaleLoginName
          })
        }
      },

      async clearEmpty(){
        this.updateDevice.deviceId="";
        this.updateDevice.deviceName="";
        this.updateDevice.deviceType="";
        this.updateDevice.deviceProject="";
        this.updateDevice.gpsAddress="";
        this.updateDevice.powerStatus="";
        this.updateDevice.errorStatus="";
        this.updateDevice.errorInfo="";
        //this.select="";
        this.postSale.postSaleValue=[];
        this.postSale.deviceAdminValue=[];
        this.updateDevice.deviceImei="";
        this.updateDevice.deviceVersion="";
        this.updateDevice.password="";

      },
      determineArea(){
     

        if(!this.updateDevice.deviceType){
          notifyErr(i18n.t('selectProductName'));
        }
        if (this.updateDevice.deviceType=="Lor"){
          this.loraCheck=true;
         
        }else{this.loraCheck=false;}
      }

      /*async getGroupValue() {
        const groupValue = await getPermissions();
      },*/

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
