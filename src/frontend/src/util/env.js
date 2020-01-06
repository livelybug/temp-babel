/*
 *  baseUrl: 域名地址
 *  routerMode: 路由模式
 */


let baseUrl = '';
let baseUrlHub = ''
let socketUrl = '';
let imgPath = '';
let routerMode = 'history';
const gVals = {};
gVals.rowsPerPage = [5, 10, 20, 50, 200]

gVals.httpReTimeout = 10000;
  //baseUrl = 'http://127.0.0.1:9030/';
  baseUrl = 'http://47.106.197.70:9030/';
  baseUrlHub = 'http://47.106.197.70:8090/';
  socketUrl = '47.106.197.70';

const requestUrls = {
  logout: "logout",
  auth: "auth",
  admin: "admin",
  admins: "admins",
  adminById:"admins-id",
  adminsNumber:"admins-number",
  adminGroups: "admin-groups",
  adminGroupsNumber: "admin-groups-number",
  adminGroupValue:"admin-group-value",
  adminGroupid: "admin-groupid",
  adminDisabled:"admin-disable",
  otherPassword:"admin-other-password",
  updatePassword:"admin-password",
  common:"common",
  commonNumber:"common-number",
  commons:"commons",
  updateCommon:"update-common",
  adminGroup:"admin-group",
  devices:"devices",
  addDevices:"add-devices",
  devicesNumber:"devices-number",
  device:"device",
  productNumber:"products-number",
  product:"products",
  projects:"projects",
  projectsNumber:"projects-number",
  addressInfo:"address-info",
  project:"project",
  productUp:"product",
  deviceDataInfo:"device-data-information",
  workOrderNumber:"work-order-number",
  deviceInfoNumber:"devices-info-number",
  deviceFaultNumber:"devices-fault-number",
  workOrderListNumber:"work-order-list",
  deviceActivationNumber:"device-activations-number",
  deviceActivations:"device-activations",
  addDeviceActivation:"device-activation",
  downloadFile:"download-file",
  uploadReportNumber:"upload-report-number",
  uploadReport:"upload-report",
  ceshi:"lawn-lamp",
  holidays:"holidays",
  holiday:"holiday",
  errorCodes:"error-codes",
  errorCode:"error-code",
  getHubToken:"hub-token"

};

const pageUrls = {
  login: "login",
  myAccount: "my-account",
  adminManage: "admin-manage",
  addAdmin:"add-admin",
  userManage: "user-manage",
  changePassword:"change-password",
  commonManage:"common-manage",
  addCommon:"add-common",
  groupManage:"group-manage",
  addGroup:"add-group",
  projectManage:"project-manage",
  addProject:"add-project",
  deviceManage:"device-manage",
  addDevice:"add-device",
  addDevices:"add-devices",
  productManage:"product-manage",
  addProduct:"add-product",
  deviceActivations:"device-activations",
  uploadReport:"upload-report",
  holidayManage:"holiday-manage",
  addHolidays:"add-holidays",
  errorStatusManage:"error-status-manage",
  addStatus:"add-status"
};

const httpStatus = {
  ok: 200,
  unAuth: 403
};

export {
	baseUrl,
  baseUrlHub,
	imgPath,
	socketUrl,
	routerMode,
  requestUrls,
  httpStatus,
  pageUrls,
  gVals
}
