<template>
  <q-page padding class="card-examples row items-start justify-center">

    <q-card inline dark class="q-ma-sm">
      <q-card-title>
        {{$t("personal")}}
        <span slot="subtitle">Subtitle</span>
      </q-card-title>
      <q-card-main >
        <q-input id="myAccountLoginName" v-model="form.login_name" :stack-label='$t("loginName")' :readonly="true" v-show="display"/>


        <q-input id="myAccountDisplayName" v-model="form.display_name" :stack-label='$t("displayName")' :class="{'error': $v.form.display_name.$error}" @blur="$v.form.display_name.$touch" :readonly="display"/>
        <span style="color: red" class="message" v-if="!$v.form.display_name.required">{{$t("displayNameNotEmpty")}}</span>
        <span style="color: red" class="message" v-if="!$v.form.display_name.maxLength">{{$t("displayNameCannotGreaterThaN64")}}</span>


        <q-input v-model="form.create_date" :stack-label='$t("createDate")' :readonly="true" v-show="display"/>
        <q-input v-model="form.update_date" :stack-label='$t("updateDate")' :readonly="true" v-show="display"/>
        <q-input v-model="form.password_update_date" :stack-label='$t("passwordUpdateDate")' :readonly="true" v-show="display"/>

        <div v-show="display">
          <br/>
          {{$t("userPermissions")}}
          <br/>
          <q-btn-dropdown id="myAccountGroup" :no-caps="true" :label=form.group.name>
            <q-list link>
              <q-list-header>{{$t("permissionsForDetails")}}</q-list-header>
              <q-item v-for="(item, index) in form.group.permission" :key="`${index}`" v-close-overlay>
                <q-item-main>
                  <q-item-tile label :id="`${index}myAccountGroup`">{{item}}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>


        <div v-show="!display">



          <br/>
          {{$t("userPermissions")}}
          <br/>

          <q-list id="myAccountGroupList">
            <q-select
              id="myAccountNewGroup"
              v-model="select"
              :options="permissions"
            />
            <!--<q-item
              link
              v-for="permission in permissions"
              :key="permission.id"
              @click.native="showActionSheet(permission)"
              v-ripple.mat
            >
              <q-item-main :label="permission.name"/>
              <q-item-side right icon="keyboard_arrow_right"/>
            </q-item>-->

            <q-item-separator/>
          </q-list>

        </div>
        <!--
                <q-action-sheet
                  v-model="actionSheet"
                  title="Action Sheet"
                  @ok="onOk"
                  @cancel="onCancel"
                  :actions="[
                  {
                    label: 'Delete',
                  },
                  {
                    label: 'Share',
                  },
                  {
                    label: 'Play',
                  },
                  {
                    label: 'Favorite',
                  }
                ]"
                />
        -->


      </q-card-main>
      <q-card-separator/>
      <q-card-actions>
        <q-btn color="blue" @click='edit' v-show="display" id="myAccountUpdateButton">{{$t("updata")}}</q-btn>
        <q-btn  color="blue" @click='saveUser' v-show="!display" id="myAccountSaveButton">{{$t("save")}}</q-btn>
        <q-btn color="blue" @click='cancelEdit' v-show="!display">{{$t("cancel")}}</q-btn>
      </q-card-actions>
    </q-card>

  </q-page>
</template>

<script>
  import {getPermissions, getPermissionsNumber, saveAdminGr, saveAdminInfo} from '#/interface/getData'
  import {httpStatus} from '#/util/env'
  import {maxLength, minLength, required} from 'vuelidate/lib/validators'
  import {i18n} from '../plugins/i18n'
  import {checkHttp} from '../libs/utils'
  import { helpers, numeric } from 'vuelidate/lib/validators'

  export default {
    data() {
      return {
        form: {},
        display: true,
        actionSheet: false,
        permissions: [],
        oldData:{},
        select:''
      }

    },
    validations:{
      form:{
        display_name:{
          required,
          minLength: minLength(1),
          maxLength: helpers.regex('maxLength', /^[^ ]{1,64}$/)
        },
      }

    },

    async beforeMount() {
      this.form = this.$store.getters.getUserInfo;
      this.form.groupId = this.form.group.groupId;

      const groupNumber = await getPermissionsNumber();

      if (!this.form.password_update_date) this.form.password_update_date = i18n.t('passwordNotUpdated');
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
      if(await this.getGroupValue() === false) return;
      this.select = this.form.groupId;
    },

    methods: {
      async edit() {
        this.oldData = this.form.group;
        this.oldData.display_name = this.form.display_name;
        this.display = false;
        this.select = this.form.group.groupId
      },

      async saveUser() {
       
        if (this.$v.form.$error){
          this.$q.notify(i18n.t('pleaseEnterTheCorrectValue'))
          return
        }
        const userSaved = {};
        userSaved.id = this.form.id;
        userSaved.display_name = this.form.display_name;
        const r = await saveAdminInfo(userSaved);
      
        if (!r.status || !checkHttp(r.status)) return;

        userSaved.groupId = this.select;
       
        const r2 = await saveAdminGr(userSaved);
      
        if (!r2.status || !checkHttp(r2.status)) return;
        const r1 = await getPermissions({groupId: this.select});
      
        if (!r1.status || !checkHttp(r1.status)){
          return;
        }
        else {
          this.form.group = r1.data[0];
        }

        this.display = true;
      },

      async cancelEdit() {
        this.form.group = this.oldData;
        this.form.group.name = this.oldData.name;
        this.form.display_name = this.oldData.display_name;
        this.display = true;
      },

      showActionSheet(permission) {

        const actions = permission.permission.map(x => ({label: x, icon: 'gamepad'}));
      
        this.$q.actionSheet({
          title: i18n.t('permissionsForDetails'),
          grid: false,
          actions: [...actions,
            {}, // separator
            {
              label: i18n.t('confirm'),
              handler: () => {
                this.form.groupId = permission.groupId;
                this.$q.notify(i18n.t('permissionsSelected'))
              }
            }
          ],
          dismiss: {
            label: i18n.t('cancel'),
            handler: () => {
              this.$q.notify(i18n.t('cancel'))
            }
          }
        })

      },

      onOk (item) {
        if (item.handler) {
          // if we've already triggered a handler
          return
        }
        this.$q.notify({
          color: 'secondary',
          message: `Clicked on "${item.label}"`
        })
      },

      onCancel () {
        this.$q.notify({
          color: 'tertiary',
          icon: 'done',
          message: 'Action Sheet was dismissed'
        })
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
