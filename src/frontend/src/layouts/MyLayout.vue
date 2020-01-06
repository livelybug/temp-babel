<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          id="myLayoutLiftList"
          flat
          dense
          round
          @click="drawerState = !drawerState"
          aria-label="Menu"
        >
          <q-icon name="menu"/>
        </q-btn>

        <q-toolbar-title>

          <div slot="subtitle">{{$t("jzkj")}}</div>
        </q-toolbar-title>

         <!-- <q-btn-dropdown icon="assignment_ind">
          <q-list link>
            <q-item v-for="(item, index) in drops" :key="`${index}`" v-close-overlay @click.native="item.method">
              <q-item-main>
                <q-item-tile label>{{item.message}}</q-item-tile> -->
                <!--<q-item-tile sublabel>February 22, 2016</q-item-tile>-->
              <!-- </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>  -->
        <q-btn color="primary">
          <q-icon id="myLayoutRightList" name="assignment_ind" />

          <q-popover>
            <q-list link separator class="scroll" style="min-width: 100px">
              <q-item v-for="(item, index) in drops" :key="`${index}`" v-close-overlay @click.native="item.method">
              <q-item-main>
                <q-item-tile label :id="`${index}myLayoutRight`">{{item.message}}
                  <q-tooltip v-if="index===0">
                    {{$t("LanguageSwitchings")}}
                  </q-tooltip>
                </q-item-tile>
              </q-item-main>
            </q-item>
            </q-list>
          </q-popover>
        </q-btn>


      </q-toolbar>
    </q-layout-header>

<!--
    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Essential Links</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school"/>
          <q-item-main label="Docs" sublabel="quasar-framework.org"/>
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side icon="code"/>
          <q-item-main label="GitHub" sublabel="github.com/quasarframework"/>
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="chat"/>
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg"/>
        </q-item>
        <q-item @click.native="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over"/>
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org"/>
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed"/>
          <q-item-main label="Twitter" sublabel="@quasarframework"/>
        </q-item>
      </q-list>
    </q-layout-drawer>
-->

    <q-layout-drawer v-model="drawerState" show-if-above>
      <q-scroll-area
        style="width: 100%; height: 100%;"
        :class="$q.theme === 'mat' ? 'bg-grey-3' : null"
      >
        <div class="row flex-center bg-white" style="height: 115px">
          <img alt="Quasar logo" src="~assets/quasar-logo.svg" style="height: 75px; width: 240px;">
          <div class="caption q-ml-md">
            <!--{{$t("jzkj")}}-->
          </div>
        </div>
        <q-list no-border>
          <q-item
            to="/"
            exact
          >
            <q-item-side icon="home" />
            <q-item-main :label='$t("homePage")'/>
          </q-item>
          <q-item-separator />
          <template v-for="(category,index1) in categories">
            <q-list-header :key="`header-${category.title}`">
              {{ category.title }}
            </q-list-header>
            <q-item
              v-for="(feature,index) in category.features"
              :id="`${index1}${index}myAccountGroupLift`"
              :key="feature.hash"
              :to="`/${feature.hash}`"
            >
              <q-item-side :icon="feature.icon" />
              <q-item-main :label="feature.title" />
              <!--
              <q-item-side right v-if="feature.status">
                <q-chip dense color="faded">{{ feature.status }}</q-chip>
              </q-item-side>
              -->
            </q-item>
            <q-item-separator :key="`separator-${category.title}`" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-layout-drawer>

    <q-pull-to-refresh :handler="refresher">
    <q-page-container>
      <router-view/>
    </q-page-container>
    </q-pull-to-refresh>

     <q-modal v-model="minimizedModal" minimized ref="modalRef">
      <div style="padding: 50px">
        <p>{{$t("confirmAgainToLoginOut")}}</p>

        <q-btn id="toLogout" color="red" v-close-overlay :label='$t("confirm")' @click="toLogout"/>
        &nbsp;&nbsp;&nbsp;
        <q-btn color="blue" v-close-overlay :label='$t("cancel")' @click="cancel"/>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
  import {openURL} from 'quasar';
  import {mapMutations, mapState} from 'vuex';
  import categories from '#/assets/categories';
  import {pageUrls, requestUrls} from "../util/env";
  import {UrlTest} from '../util/constants'
  import {getAuth} from '../libs/utils'
  import {i18n} from '../plugins/i18n';
  import {vuexUuid} from '../store/index';
  import store from '#/store/index';
  import { Login } from "#/interface/getData";

  export default {
    name: 'MyLayout',
    data() {
      return {
        leftDrawerOpen: this.$q.platform.is.desktop,
        drops: [],
        categories,
        minimizedModal:false,
      }
    },

    methods: {
      ...mapMutations(['saveUserToken']),

      openURL,
      toMyAccount() {
        this.$router.push(pageUrls.myAccount);
/*
        import(`quasar-framework/i18n/en-us`).then(lang => {
          this.$q.i18n.set(lang.default);
          this.$i18n.locale='en-us'
        })
*/

      },


      toChangePassword() {
        this.$router.push(pageUrls.changePassword);
      },
      confirmAgain(){
        this.minimizedModal = true;
      },

      ...mapMutations(['saveLanguage']),

      LanguageSwitching(){
        if (store.state.language === 'zh-hans'){
          store.state.language = 'en-us'
          Login.headers = {'content-type': "application/json; charset=utf-8;", 'Accept-Language':"en"};

        }else if (store.state.language === 'en-us') {
          //i18n.locale = 'en-us';
          store.state.language = 'zh-hans'
          Login.headers = {'content-type': "application/json; charset=utf-8", 'Accept-Language':"zh"};

        }

        this.saveLanguage(this.language,this.language)
        location.reload()
      },


      toLogout() {
        this.saveUserToken({token: undefined, details: undefined}); //清空vuex中的用户资料及其token
        localStorage.removeItem(vuexUuid);
        this.$router.push(pageUrls.login);
        location.reload()
      },
      cancel(){

      },

      genDrops() {
        let urls = [];
        urls = urls.concat(new UrlTest(requestUrls.admins, 'get'));
        // this.drops = this.drops.concat({ message: this.$t('personal'), method: this.toMyAccount, urlTest: urls });
        this.drops = this.drops.concat({ message: i18n.t('LanguageSwitching'), method: this.LanguageSwitching });
        this.drops = this.drops.concat({ message: this.$t('personal'), method: this.toMyAccount });
        this.drops = this.drops.concat({ message: this.$t('changePassword'), method: this.toChangePassword });
        this.drops = this.drops.concat({ message: i18n.t('exitAccount'), method: this.confirmAgain });

      },

      refresher (done) {
        location.reload();
        done();
      }
    },

    computed: {
      drawerState: {
        get () {
          return this.$store.state.showcase.drawerState
        },
        set (val) {
          this.$store.commit('showcase/updateDrawerState', val)
        }
      },
      ...mapState('showcase', [
        'pageMeta'
      ])
    },

    async beforeMount() {
      this.genDrops();

/*
      this.drops = this.drops.filter(async x => {
        if(!x.urlTest || !x.urlTest.length || x.urlTest.length === 0) return true;
        for(const i in x.urlTest){
          const r = await testUrl(x.urlTest[i]);
          if(r.status !== httpStatus.unAuth) return true;
        }
      });
*/
      this.drops = await getAuth(this.drops);

      for(const i in categories)
        if(categories[i].features && categories[i].features.length > 0) {
          categories[i].features = await getAuth(categories[i].features)
        }

    }
  }


</script>

<style>
</style>
