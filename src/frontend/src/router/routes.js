import Login from 'pages/Login'
import {pageUrls} from '../util/env';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: {check: true} },
      { path: pageUrls.myAccount, component: () => import('pages/MyAccount.vue'), meta: {check: true} },
      { path: pageUrls.changePassword, component: () => import('pages/ChangePassword.vue'), meta: {check: true} },
      { path: pageUrls.adminManage, component: () => import('pages/AdminManage.vue'), meta: {check: true} },
      { path: pageUrls.addAdmin, component: () => import('pages/AddAdmin.vue'), meta: {check: true} },
      { path: pageUrls.commonManage, component: () => import('pages/CommonManage.vue'), meta: {check: true} },
      { path: pageUrls.addCommon, component: () => import('pages/AddCommon.vue'), meta: {check: true} },
      { path: pageUrls.groupManage, component: () => import('pages/GroupManage.vue'), meta: {check: true} },
      { path: pageUrls.addGroup, component: () => import('pages/AddGroup.vue'), meta: {check: true} },
      { path: pageUrls.projectManage, component: () => import('pages/ProjectManage.vue'), meta: {check: true} },
      { path: pageUrls.addProject, component: () => import('pages/AddProject.vue'), meta: {check: true} },
      { path: pageUrls.deviceManage, component: () => import('pages/DeviceManage.vue'), meta: {check: true} },
      { path: pageUrls.addDevice, component: () => import('pages/AddDevice.vue'), meta: {check: true} },
      { path: pageUrls.addDevices, component: () => import('pages/AddDevices.vue'), meta: {check: true} },
      { path: pageUrls.productManage, component: () => import('pages/ProductManage.vue'), meta: {check: true} },
      { path: pageUrls.addProduct, component: () => import('pages/AddProduct.vue'), meta: {check: true} },
      { path: pageUrls.deviceActivations, component: () => import('pages/DeviceActivations.vue'), meta: {check: true} },
      { path: pageUrls.uploadReport, component: () => import('pages/UploadReport.vue'), meta: {check: true} },
      { path: pageUrls.holidayManage, component: () => import('pages/HolidayManage'), meta: {check: true} },
      { path: pageUrls.addHolidays, component: () => import('pages/AddHolidays'), meta: {check: true} },
      { path: pageUrls.errorStatusManage, component: () => import('pages/ErrorStatusManage'), meta: {check: true} },
      { path: pageUrls.addStatus, component: () => import('pages/AddErrorStatus'), meta: {check: true} }
    ]
  },
/*
  {
    path: '/',
    component: Login,
    name: 'Login',
    meta:{ check:false}
  },
*/
  {
    path: '/' + pageUrls.login,
    component: Login,
    name: 'Login',
    meta:{ check:false}
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
