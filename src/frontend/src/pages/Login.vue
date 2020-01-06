<template lang="pug">
  <div class="container">
  <div class="auroral-northern"></div>
  <div class="auroral-stars"></div>
  <div class="auroral-stars2"></div>

  .page

    .content
      q-card.no-margin(square='', flat='', style='position:absolute;top:-5rem;width:100%;')
        q-card-main(style='text-align:center;')
          span(style='font-size:1.6rem;color:white;text-shadow:yellow 0 1px 0;') {{$t("jinzhongTechnology")}}
          br
          small(style='color:white;text-shadow:green 0 1px 0;')
            span(style='color:red;') ♥
            |  tree hugger~
      q-card.no-margin(flat=true)
        q-card-main
          q-input(@blur='$v.form.username.$touch', v-model='form.username', type='text', required='', :stack-label='$t("loginName")')
          //- q-input(v-model='form.username', type='number', required='', stack-label='一卡通账号')
          //- q-input( v-model='form.password', type='password', required='', stack-label='密码')
          q-input(@blur='$v.form.password.$touch', v-model='form.password', type='password', required='', :stack-label='$t("password")' @keyup.enter='login')

        q-card-actions
          q-btn.full-width(loader='', color='primary', @click='login',name="btnsubmit")
            | {{$t("login")}}
      q-card.no-margin(square='', flat='', style='position:absolute;bottom:-4rem;width:100%;')
        q-card-main(style='text-align:center;color:white;')
          <!--small ©2017 JZKJ.All Rights Reserved.-->
          <!--br-->
          <!--small {{$t("company")}}-->
    <!--.bg-boxes-->
      <!--svg#col1(width='10px', height='100%')-->
        <!--rect#bub1.bubble(width='15px', height='15px', x='75px', y='75px')-->
      <!--svg#col2(width='20px', height='100%')-->
        <!--rect#bub2.bubble(width='10px', height='10px', x='50px', y='50px')-->
      <!--svg#col3(width='20px', height='100%')-->
        <!--rect#bub3.bubble(width='10px', height='10px', x='65px', y='65px')-->
      <!--svg#col4(width='16px', height='100%')-->
        <!--rect#bub4.bubble(width='80px', height='80px', x='40px', y='40px')-->
      <!--svg#col5(width='24px', height='100%')-->
        <!--rect#bub5.bubble(width='120px', height='120px', x='60px', y='60px')-->
      <!--// Here is a triangle-->
      <!--svg#col6(width='20px', height='100%')-->
        <!--polygon#bub6.bubble(points='50,150 100,50 150,150')-->
      <!--svg#col7(width='20px', height='100%')-->
        <!--rect#bub7.bubble(width='10px', height='10px', x='5px', y='5px')-->
      <!--svg#col8(width='20px', height='100%')-->
        <!--rect#bub8.bubble(width='100px', height='100px', x='50px', y='50px')-->
      <!--svg#col9(width='20px', height='100%')-->
        <!--rect#bub9.bubble(width='10px', height='100px', x='50px', y='50px')-->
      <!--svg#col10(width='20px', height='100%')-->
        <!--rect#bub10.bubble(width='10px', height='100px', x='50px', y='50px')-->
      <!--svg#col11(width='10px', height='100%')-->
        <!--rect#bub11.bubble(width='50px', height='50px', x='25px', y='25px')-->
  </div>
</template>

<script>
import { Notify, QCheckbox, QInput } from "quasar";
import { required } from "vuelidate/lib/validators";
import { Login, LoginHub,adminLoginHub} from "#/interface/getData";
import { httpStatus } from "#/util/env";
import jwtDecode from "jwt-decode";
import { mapMutations, mapState } from "vuex";
import { i18n } from "../plugins/i18n";
import { checkHttp } from "../libs/utils";
import store from '#/store/index';
import {setAxios, setAxiosHub} from '#/interface/getData';

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      passwordVisiable: true,
      loginLoading: false,
      rememberMe: false
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  async beforeMount() {
    await this.getBrowserLanguage()
  },
  mounted() {
    // this.$refs.basicModal.open()
  },
  beforeDestory() {
    // this.$refs.basicModal.close()
    // debugger
  },
  computed: {
    ...mapState(["userInfo", "userJwt", "Permision"])
  },
  methods: {
    async getBrowserLanguage(){
      const language = (navigator.language || navigator.userLanguage || navigator.systemLanguage || navigator.browserLanguage).substr(0,2).toLowerCase();
      if (language==='en'){
        store.state.language = 'en-us';
        i18n.locale = 'en-us';
        Login.headers = {'content-type': "application/json; charset=utf-8; accept-language"};
      } else {
        store.state.language = 'zh-hans';
        i18n.locale = 'zh-hans';
      }
    },
    ...mapMutations(["saveUserToken", "setPermision", 'saveHubToken']),
    async login(e, done) {
      var _this = this;
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        done();
        this.$q.notify(i18n.t("accountNumberAndPasswordCorrectly"));
        return;
      }
      this.loginLoading = true;

      var loginData = {
        username: this.form.username,
        password: this.form.password
      };
      const r = await Login(loginData);
     

      this.form = { username: "", password: "" };
      if (r.status && checkHttp(r.status)) {
        const jwtDetail = jwtDecode(r.data.token);
        await this.saveUserToken({ token: r.data.token, details: jwtDetail }); //将用户资料及其token存入state

        //获取hub用户token
        setAxios();
        const rr = await adminLoginHub();
        const jwtDetail2 = jwtDecode(rr.data.token);
        this.saveHubToken({token: rr.data.token, details: jwtDetail2}); //将用户hub token存入state
        this.$router.push('/');

       /* const r2 = await LoginHub(loginData);
        console.log(r2);
        if (r2.status && checkHttp(r2.status))  {
          const jwtDetail2 = jwtDecode(r.data.token);
          console.log(jwtDetail2);
          this.saveHubToken({token: r2.data.token, details: jwtDetail2}); //将用户hub token存入state
          this.$router.push('/');
        }*/
        //await this.getHubTokens();
      }

    }

  }
};
</script>

<style scoped src ='../css/auroral.css' >
/*  .page
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background #082549
    background -webkit-linear-gradient(top left, #84C8A9 10%, #082549 100%)
    background linear-gradient(to bottom right, #082549 10%, #309488 100%)
    // font-family: 'Roboto', sans-serif;
    // font-weight: 300;
    height 100vh !* Allow spacing based on window height *!
    margin 0
    min-height 240px
    z-index 6000*/

/* The background from https://codepen.io/lotap/pen/yNYxRz */
/* The form part */
/* .content
    !* A box that the form resides in - centered vertically and horizontally based on the window. The max-width and % width combo allow it to resize for small devices *!
    background #FFF
    border-radius 8px
    box-shadow 0 2px 4px rgba(0, 0, 0, 0.1)
    display block
    left 50%
    max-width 360px
    position absolute
    top 50%
    -ms-transform translate(-50%, -50%)
    -webkit-transform translate(-50%, -50%)
    transform translate(-50%, -50%)
    width 90%
    z-index 2*/

/* The Background Part - Each svg element will act as a column that rises. Within each svg column will be a rect element that rotates. Due to an error FF regarding the transform-origin of objects in an svg, the transform-orgin must be explicitly given without percents */
/*  .bg-boxes
    !* Set the container for the svg elements to take up the whole window and hide objects outside of the window *!
    height 100%
    min-height 240px
    position absolute
    overflow hidden
    width 100%
    z-index 1*/

/*  svg
    !* Set defaults for svg columns. Opacity set to 0 so the elements are invisible before the animation begins and will not show up on browsers without animation *!
    -webkit-animation riser 20s infinite
    animation riser 20s infinite
    opacity 0
    overflow visible
    position absolute*/
/*
  .bubble
    !* Set the defaults for the "bubbles". transform-origin should always be the center-point of the object including blank-space within the svg. Since the object should be centered, this is equal to the width of the object. The default bubble is 100px by 100px in an svg object with a width of 200px *!
    -webkit-animation rotator 20s linear infinite
    animation rotator 20s linear infinite
    fill #FFF
    -webkit-transform-origin 100px 100px
    transform-origin 100px 100px*/

/*  #col1
    !* Since this element is larger than the set default, I want it to rise a little faster to give a subtle sense of depth *!
    -webkit-animation-duration 15s
    animation-duration 15s

  #bub1
    !* The transform-origin has to be redefined because this bubble is not the set default size *!
    -webkit-transform-origin 150px 150px
    transform-origin 150px 150px

  #col2
    !* To offset the columns, adjust their left attribute and add an animation-delay *!
    left 15%
    -webkit-animation-delay 18s
    animation-delay 18s

  #col3
    left 30%
    -webkit-animation-delay 14s
    animation-delay 14s
    -webkit-animation-duration 17s
    animation-duration 17s

  #bub3
    -webkit-animation-delay 14s
    animation-delay 14s
    -webkit-transform-origin 130px 130px
    transform-origin 130px 130px

  #col4
    left 45%
    -webkit-animation-delay 8s
    animation-delay 8s
    -webkit-animation-duration 22s
    animation-duration 22s

  #bub4
    -webkit-animation-delay 8s
    animation-delay 8s
    -webkit-transform-origin 80px 80px
    transform-origin 80px 80px

  #col5
    left 60%
    -webkit-animation-delay 15s
    animation-delay 15s
    -webkit-animation-duration 18s
    animation-duration 18s

  #bub5
    -webkit-animation-delay 15s
    animation-delay 15s
    -webkit-transform-origin 120px 120px
    transform-origin 120px 120px

  #col6
    left 75%
    -webkit-animation-delay 19s
    animation-delay 19s

  #col7
    left 90%
    -webkit-animation-delay 4s
    animation-delay 4s

  #col8
    left -5%
    -webkit-animation-delay 11s
    animation-delay 11s

  #col9
    left 25%
    -webkit-animation-delay 5s
    animation-delay 5s

  #col10
    left 50%
    -webkit-animation-delay 12s
    animation-delay 12s

  #col11
    left 67%
    -webkit-animation-delay 1s
    animation-delay 1s
    -webkit-animation-duration 25s
    animation-duration 25s

  #bub11
    -webkit-animation-delay 1s
    animation-delay 1s
    -webkit-transform-origin 50px 50px
    transform-origin 50px 50px*/

/* Rotation Animation - Should be set to a factor of 360 to prevent jumpiness */
/* @keyframes rotator
    to
      -webkit-transform rotate(360deg)
      transform rotate(360deg)

  @keyframes rotator
    to
      -webkit-transform rotate(360deg)
      transform rotate(360deg)

  @keyframes riser
    0%
      opacity 0.2
      -webkit-transform translateY(100%)
      transform translateY(100%)

    100%
      opacity 0.2
      -webkit-transform translateY(-250px)
      transform translateY(-250px)

  @keyframes riser
    0%
      opacity 0.2
      -webkit-transform translateY(100%)
      transform translateY(100%)

    100%
      opacity 0.2
      -webkit-transform translateY(-250px)
      transform translateY(-250px)*/
</style>
