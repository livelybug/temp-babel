<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addProduct")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input id="AddDateProductName"  :class="{'error': $v.addDate.name.$error}" v-model="addDate.name" :stack-label='$t("productName")' @blur="$v.addDate.name.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.name.productNameLimit">{{$t("productNameNothan")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.name.$dirty && !$v.addDate.name.required">{{$t("productNameNotEmpty")}}</span>

        <q-input id="AddDateProductMemoName"  :class="{'error': $v.addDate.memoName.$error}" v-model="addDate.memoName" :stack-label='$t("productMemoName")' @blur="$v.addDate.memoName.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.memoName.productMemoNameLimit">{{$t("productMemoNameNothan")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.memoName.$dirty && !$v.addDate.memoName.required">{{$t("productMemoNameNotEmpty")}}</span>

       <q-select
              id="selectSalePermission"
              chips
              color="amber"
              multiple
              :stack-label='$t("salePermission")'
              v-model="addDate.salePerSelect"
              :options="salePermissionList"
        />
        <p>  </p>
        <q-select
              id="selectAdminPermission"
              chips
              color="amber"
              multiple
              :stack-label='$t("adminPermission")'
              v-model="addDate.adminPerSelect"
              :options="adminPermissionList"
        />

      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn  color="blue" @click='addProductData(addDate)'>{{$t("append")}}</q-btn>
        <q-btn  color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addProduct,getGroupValue} from '#/interface/getData'
  import {httpStatus} from '#/util/env'
  import {maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import { helpers } from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'
  import {notifyOk, notifyErr} from '#/libs/notify';

  export default {
    data() {
      return {
        form: {},
        addDate: {
          salePerSelect:[],
          adminPerSelect:[]

        },
        salePermissionList:[],
        adminPermissionList:[]
      }

    },
    validations:{
      addDate: {
        name: {
          required: required,
          productNameLimit: helpers.regex('productNameLimit',/^[^ ]{1,64}$/)
        },
        memoName:{
          required: required,
          productMemoNameLimit: helpers.regex('productNameLimit',/^[^ ]{1,64}$/)
        }
      }
    },
    async beforeMount() {

       let addValue = await getGroupValue();
     
      for (let values of addValue.data){
         let groupValues = values.slice(5)
        this.adminPermissionList.push({
          label:groupValues,
          value:groupValues
        })
      }
      for (let values of addValue.data){
        let groupValues = values.slice(5)
        this.salePermissionList.push({
          label:groupValues,
          value:groupValues
        })
      }


    },

    methods: {

      async addProductData(data) {

        if (this.$v.addDate.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }
      
        const productData = {};
        productData.name = data.name;
        productData.memoName = data.memoName;
        productData.salePermission=data.salePerSelect;
        productData.adminPermission=data.adminPerSelect;

        
        const rv = await addProduct(productData)
       
        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      async clearEmpty(){
        this.addDate.name="";
        this.addDate.memoName="";
        this.addDate.salePerSelect=[];
        this.addDate.adminPerSelect=[];
      },


   

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
