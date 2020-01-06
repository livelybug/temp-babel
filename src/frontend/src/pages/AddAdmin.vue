<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addAdminUser")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input id="addLoginNameValue" :class="{'error': $v.addDate.login_name.$error}" v-model="addDate.login_name" :stack-label='$t("loginName")' @blur="$v.addDate.login_name.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.login_name.loginNameLimit">{{$t("loginNameFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.login_name.$dirty && !$v.addDate.login_name.required">{{$t("loginNameNotEmpty")}}</span>


        <q-input id="addDisplayNameValue" :class="{'error': $v.addDate.display_name.$error}" v-model="addDate.display_name" :stack-label='$t("displayName")' @blur="$v.addDate.display_name.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.display_name.regularLimit">{{$t("displayNameCannotGreaterThaN64")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.display_name.$dirty && !$v.addDate.display_name.required">{{$t("displayNameNotEmpty")}}</span>

        <q-select
          id="addGroupValue"
          :stack-label='$t("groupId")'
          v-model="select"
          :options="permissions"
        />

        <!--<q-input v-model="password" type="password" :stack-label='$t("password")' v-show="display"/>-->
        <q-input id="addPasswordValue" type="password" :class="{'error': $v.addDate.password.$error}" v-model="addDate.password" :stack-label='$t("password")' @blur="$v.addDate.password.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.password.passwordLimit">{{$t("passwordFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.password.$dirty && !$v.addDate.password.required">{{$t("passwordNotEmpty")}}</span>

        <!--<p class="caption">{{$t("disabled")}}</p>
        <q-radio id="addDisabledValue1" v-model="addDate.disabled" val="true" color="secondary" :label='$t("yes")' />
        <q-radio id="addDisabledValue2" v-model="addDate.disabled" val="false" color="secondary" :label='$t("no")' style="margin-left: 10px" />-->

        <q-select
          v-model="addDate.disabled"
          :options="selectOptions"
          :stack-label="$t('disabled')"
        />

      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn id="addAdminAddButton" color="blue" @click='addAdminData(addDate.login_name,addDate.display_name,select,addDate.password,addDate.disabled)'>{{$t("append")}}</q-btn>
        <q-btn id="addAdminCancelButton" color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addAdmin,getPermissions, getPermissionsNumber} from '#/interface/getData'
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
            label: i18n.t('yes'),
            value: 'true'
          },
          {
            label: i18n.t('no'),
            value: 'false'
          }
        ],
        form: {},
        permissions: [],
        select:'',
        addDate: {}
      }

    },
    validations:{
      addDate: {
        login_name: {
          required: required,
          loginNameLimit: helpers.regex('loginNameLimit',/^[a-zA-Z0-9_-]{4,16}$/)
        },
        display_name:{
          required,
          regularLimit: helpers.regex('regularLimit', /^[^ ]{1,64}$/)
        },
        password: {
          required,
          passwordLimit: helpers.regex('passwordLimit',/^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-])[^]{8,20}$/)
        }
      }

    },
    async beforeMount() {

      const groupNumber = await getPermissionsNumber();
      const data = {};
      data.size = groupNumber.data;
      const r = await getPermissions({...data});
      
      if (r.status && checkHttp(r.status)) {
        r.data.map(x => {
          x.label = x.name;
          x.value = x.groupId
        });
        
        this.permissions = r.data;
      }


    },

    methods: {

      async addAdminData(login_name,display_name,select,password,disabled) {

        if (this.$v.addDate.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }

        const adminData = {};
        adminData.login_name = login_name;
        adminData.display_name = display_name;
        adminData.groupId = select;
        adminData.password = password;
        adminData.disabled = disabled;

        
        const rv = await addAdmin(adminData)
       
        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      async clearEmpty(){
        this.addDate.login_name="";
        this.addDate.display_name="";
        this.select="";
        this.addDate.password="";
        this.addDate.disabled=""
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
