<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addErrorCode")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >

        <q-input v-model="addDate.errorStatus" :stack-label='$t("errorState")' @blur="$v.addDate.errorStatus.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.errorStatus.regularLimit">{{$t("errorStatusMustBeNumber")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.errorStatus.$dirty && !$v.addDate.errorStatus.required">{{$t("errorStatusNotEmpty")}}</span>

        <q-input v-model="addDate.errorInfo" :stack-label='$t("errorInfo")'/>
        <span style="color: red" class="message" v-if="!$v.addDate.errorInfo.required">{{$t("errorInfoNotEmpty")}}</span>


      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" @click='addErrorCodeData(addDate)'>{{$t("append")}}</q-btn>
        <q-btn color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addErrorCode} from '#/interface/getData'
  import {httpStatus} from '#/util/env'
  import {required} from 'vuelidate/lib/validators'
  import {checkHttp} from '../libs/utils'
  import { helpers } from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'
  import {notifyOk, notifyErr} from '#/libs/notify';

  export default {
    name: "AddErrorStatus",
    data() {
      return {
        select:'',
        addDate: {}
      }

    },
    validations:{
      addDate: {
        errorStatus:{
          required,
          regularLimit: helpers.regex('regularLimit', /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[0-9])$/)
        },
        errorInfo:{
          required,
        }
      }

    },

    methods: {

      async addErrorCodeData(addDate) {

        if (this.$v.addDate.$error){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }
        const data = {};
        data.errorStatus = addDate.errorStatus;
        data.errorInfo = addDate.errorInfo;

        console.log(data)
        const rv = await addErrorCode(data)

        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      async clearEmpty(){
        this.addDate.errorStatus="";
        this.addDate.errorInfo="";
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
