<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addGroup")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
      
        <q-input :class="{'error': $v.addDate.name.$error}" v-model="addDate.name" :stack-label='$t("permissionName")' @blur="$v.addDate.name.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.name.regularLimit">{{$t("permissionNameCannotGreaterThaN64")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.name.$dirty && !$v.addDate.name.required">{{$t("permissionNameNotEmpty")}}</span>
    
        <q-select
          chips
          color="amber"
          :stack-label='$t("groupId")'
          multiple
          v-model="select"
          :options="permissions"
          />

      
      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" @click='addGrouppData(addDate.name,select)'>{{$t("append")}}</q-btn>
        <q-btn color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addGroup,getPermissions, getGroupValue} from '#/interface/getData'
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
        permissions: [],
        select:[],
        addDate: {}
      }

    },
    validations:{
      addDate: {
        
        name:{
          required,
          regularLimit: helpers.regex('regularLimit', /^[^ ]{4,64}$/)
        }
      }

    },
    async beforeMount() {

      
       let groupValue = await getGroupValue();
    
      for (let values of groupValue.data){
        let groupValues = values.slice(5)
       this.permissions.push({
          label:groupValues,
          value:groupValues
        })
      }
      

    },

    methods: {

      async addGrouppData(name,select) {

        if (this.$v.addDate.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }

        const groupData = {};
        groupData.name = name;
        groupData.permission = select;
  
      
        const rv = await addGroup(groupData)
     
        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      async clearEmpty(){
        this.addDate.name="";
        this.select=[];
      },


      async getGroupValue() {
        const groupValue = await getPermissions();
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
