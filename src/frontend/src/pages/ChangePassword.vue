<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("changePassword")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input type="password" id="oldPassword"  v-model="currentPassword" :stack-label='$t("currentPassword")'/>



        <q-input type="password"  id="newPassword1"  :class="{'error': $v.newPassword.$error}" v-model="newPassword" :stack-label='$t("newPassword")' @blur="$v.newPassword.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.newPassword.passwordLimit">{{$t("passwordFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.newPassword.$dirty && !$v.newPassword.required">{{$t("passwordNotEmpty")}}</span>


        <q-input type="password"  id="newPassword2" :class="{'error': $v.confirmNewPassword.$error}" v-model="confirmNewPassword" :stack-label='$t("confirmNewPassword")' @blur="$v.confirmNewPassword.$touch()"/>
        <span style="color: red" class="error" v-if="!$v.confirmNewPassword.sameAsPassword">{{$t("differentPasswords")}}</span>


      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn   id="updatePassword" color="blue" @click='changePassword(currentPassword,newPassword)'>{{$t("updata")}}</q-btn>
        <q-btn  id="cancelPassword" color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {getPermissions, updatePassword} from '#/interface/getData'
  import {httpStatus, pageUrls} from '#/util/env'
  import {maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import { helpers,sameAs } from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'

  export default {
    data() {
      return {
        form: {},
        currentPassword:'',
        newPassword:'',
        confirmNewPassword:''
      }

    },
    validations:{
      newPassword: {
        required,
        passwordLimit: helpers.regex('passwordLimit',/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-])[^]{8,20}$/)
      },
      confirmNewPassword:{
        sameAsPassword: sameAs('newPassword')
      }
    },
    async beforeMount() {
      this.form = this.$store.getters.getUserInfo;
    },

    methods: {

      async changePassword(currentPassword,newPassword) {

        if (this.$v.confirmNewPassword.$error || this.$v.newPassword.$error){
          this.$q.notify(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }
        const passwordData = {};
        passwordData.id = this.form.id;
        passwordData.oldPassword = currentPassword;
        passwordData.newPassword = newPassword;
       
        const rv = await updatePassword(passwordData);
        
        if (rv.status && checkHttp(rv.status)) {
          this.$router.push('/' + pageUrls.login);
          return true
        }else{
          return false
        }


      },

      async clearEmpty(){
        this.currentPassword="";
        this.newPassword="";
        this.confirmNewPassword=""
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
