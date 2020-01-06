<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("addCommonUser")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input :class="{'error': $v.addDate.commonUserLoginName.$error}" v-model="addDate.commonUserLoginName" :stack-label='$t("loginName")' @blur="$v.addDate.commonUserLoginName.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.commonUserLoginName.loginNameLimit">{{$t("loginNameFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.commonUserLoginName.$dirty && !$v.addDate.commonUserLoginName.required">{{$t("loginNameNotEmpty")}}</span>


        <q-input :class="{'error': $v.addDate.commonUserName.$error}" v-model="addDate.commonUserName" :stack-label='$t("displayName")' @blur="$v.addDate.commonUserName.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.commonUserName.regularLimit">{{$t("displayNameCannotGreaterThaN64")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.commonUserName.$dirty && !$v.addDate.commonUserName.required">{{$t("displayNameNotEmpty")}}</span>
     
         <q-input :class="{'error': $v.addDate.phoneNumber.$error}" v-model="addDate.phoneNumber" :stack-label='$t("phoneNumber")' @blur="$v.addDate.phoneNumber.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.phoneNumber.regularLimit">{{$t("phoneNumberFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.phoneNumber.$dirty && !$v.addDate.phoneNumber.required">{{$t("phoneNumberNotEmpty")}}</span>

        <q-select
          :stack-label='$t("groupName")'
          v-model="select"
          :options="permissions"
          />

        <!-- 外部用户项目 -->
        <q-select
          id="project"
          class="col-xs-12 col-lg-6"
          chips
          multiple
          color="amber"
          v-model="addDate.project"
          :options="projects"
          :stack-label='$t("adminProject")'
        />

        <!--<q-input v-model="password" type="password" :stack-label='$t("password")' v-show="display"/>-->
        <q-input type="password" :class="{'error': $v.addDate.password.$error}" v-model="addDate.password" :stack-label='$t("password")' @blur="$v.addDate.password.$touch()"/>
        <span style="color: red" class="message" v-if="!$v.addDate.password.passwordLimit">{{$t("passwordFarmatError")}}</span>
        <span style="color: red" class="error" v-if="$v.addDate.password.$dirty && !$v.addDate.password.required">{{$t("passwordNotEmpty")}}</span>

        <!--<p class="caption">{{$t("disabled")}}</p>
        <q-radio v-model="addDate.disabled" val="true" color="secondary" :label='$t("yes")' />
        <q-radio v-model="addDate.disabled" val="false" color="secondary" :label='$t("no")' style="margin-left: 10px" />-->

        <q-select
          v-model="addDate.disabled"
          :options="selectOptions"
          :stack-label="$t('disabled')"
        />

      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" @click='addCommonData(addDate)'>{{$t("append")}}</q-btn>
        <q-btn color="blue" @click='clearEmpty()'>{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {addCommon,getPermissions, getPermissionsNumber, getProjectNumber, getProjects} from '#/interface/getData'
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
        addDate: {
          project: []
        },
        projects: []
      }

    },
    validations:{
      addDate: {
        commonUserLoginName: {
          required: required,
          loginNameLimit: helpers.regex('loginNameLimit',/^[a-zA-Z0-9_-]{4,16}$/)
        },
        commonUserName:{
          required,
          regularLimit: helpers.regex('regularLimit', /^[^ ]{1,64}$/)
        },
        phoneNumber:{
          required,
          regularLimit: helpers.regex('regularLimit', /^[1][3,4,5,7,8,9][0-9]{9}$/)
        },
        password: {
          required,
          passwordLimit: helpers.regex('passwordLimit',/^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-])[^]{8,20}$/)
        },
        select:{
          required
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
      await this.getProjectValue()

    },

    methods: {

      async addCommonData(addDate) {

        if (this.$v.addDate.commonUserLoginName.$error || this.$v.addDate.commonUserName.$error  ||
             this.$v.addDate.phoneNumber.$error  ||this.$v.addDate.password.$error ||this.$v.addDate.select.$error ){
          notifyErr(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }

        const commonData = {
          project: []
        };
        commonData.commonUserLoginName = addDate.commonUserLoginName;
        commonData.commonUserName = addDate.commonUserName;
        commonData.phoneNumber=addDate.phoneNumber;
        commonData.commonUserGroupId = this.select;
        commonData.project = addDate.project;
        commonData.password = addDate.password;
        commonData.disabled = addDate.disabled;

        console.log(commonData)
     
        const rv = await addCommon(commonData)
       
        if (rv.status && checkHttp(rv.status)) {
          return true
        }else{
          return false
        }
      },

      //获取项目名称
      async getProjectValue() {

        const projectNum = await getProjectNumber();
        const projectNumber = {};
        projectNumber.size = projectNum.data;
        const project = await getProjects({...projectNumber});

        for (let values of project.data) {
          let projectName = values.name;
          this.projects.push({
            label: projectName,
            value: projectName
          })
        }

      },

      async clearEmpty(){
        this.addDate.commonUserLoginName="";
        this.addDate.commonUserName="";
        this.addDate.phoneNumber="";
        this.addDate.project = [];
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
