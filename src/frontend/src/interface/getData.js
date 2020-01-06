import {baseUrl, baseUrlHub, requestUrls, gVals} from '#/util/env'
import store from '#/store/index';
import axios from 'axios';
import {notifyOk, notifyErr} from '#/libs/notify';
import {i18n} from '../plugins/i18n';
import {httpErrHdl} from '../libs/utils';
import {Dialog} from 'quasar';


/****************************封装ajax******************************************/
/*
const mAJAX = (url, data) => {
  return $.ajax({
    url: url, type: 'POST', data: data,
    xhrFields: {withCredentials: true}, crossDomain: true,
    success(res) {
      console.log(res)
      if (res.status == 1 && res.msg == i18n.t('logonFailure')) {  //统一处理对所有登录失效操作进行重新登录
        Notification.info(i18n.t('timeOut'));
        var obj = {a00103: store.state.userInfo.a00106, a00104: store.state.userInfo.a00104};
        $.ajax({
          url: baseUrl + 'g00101', type: 'POST', data: obj, xhrFields: {withCredentials: true}, crossDomain: true,
          success(res) {
            if (res.status == 0) {
              Notification.info(i18n.t('reconnectionSuccessful'));
              mAJAX(url, data);   //重新执行上一次ajax操作
            }
          },
          error() {
            Message.error(i18n.t('serverException'));
          }
        });
      }
    },
    error() {
      Message.error(i18n.t('serverException'));
    }
  });
}
*/

/****************************初始化axios******************************************/

const axiosConf = {
  baseURL: baseUrl,
  timeout: gVals.httpReTimeout,
  headers: {'content-type': "application/json; charset=utf-8"}
};

let axios1 = axios.create(axiosConf);

export const setAxios = () => {
  if (store.state.language === 'en-us') {
    axiosConf.headers = {'content-type': "application/json; charset=utf-8;", 'Accept-Language':"en"};
  }else {
    axiosConf.headers = {'content-type': "application/json; charset=utf-8;", 'Accept-Language':"zh"};
  }

  store.commit('saveLanguage', store.state.language,store.state.language);

  if (store.getters.getToken) {
    axiosConf.headers.Authorization = `Bearer ${store.getters.getToken}`;
  }
  axios1 = axios.create(axiosConf);
}

const axiosConfHub = {
  baseURL: baseUrlHub,
  timeout: gVals.httpReTimeout,
  headers: {'content-type': "application/json; charset=utf-8"}
};

let axiosHub = axios.create(axiosConfHub);

export const setAxiosHub = () => {
  if (store.getters.getHubToken) {
    axiosConfHub.headers.Authorization = `Bearer ${store.getters.getHubToken}`;
  }
  axiosHub = axios.create(axiosConfHub);
}

/****************************初始化axios******************************************/


function errorReply(error) {
  if (error.response) {
    //请求已发出，但服务器使用状态代码进行响应, 落在2xx的范围之外
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  } else {
    //在设置触发错误的请求时发生了错误
    console.error('Error', error.message);
    error.response.data = error.message;
  }
  console.error(error.config)
  return error.response;
}

export const Login = data => axios1.post(requestUrls.auth, data).then(function (response) {
  notifyOk(i18n.t('loggedin'));

  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
  });

export const LoginHub = data => axiosHub.post(requestUrls.auth, data).then(function (response) {
  return response;
})
  .catch(function (error) {
    console.log(error)
    if (error == "Error: Network Error"){
      notifyErr(i18n.t('hubServerNotStarted'))
    }
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//获取用户列表
export const getAdmins = data => axios1.get(requestUrls.admins, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//按照id获取用户
export const getAdminById = data => axios1.get(requestUrls.adminById, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {

  });


//获取内部用户总数
export const getAdminsNumber = data => axios1.get(requestUrls.adminsNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//查询权限分组列表
export const getPermissions = data => axios1.get(requestUrls.adminGroups, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//查询权限分组列表总数
export const getPermissionsNumber = data => axios1.get(requestUrls.adminGroupsNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


//获取权限值列表
export const getGroupValue = data => axios1.get(requestUrls.adminGroupValue, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//更新内部用户
export const saveAdminInfo = data => axios1.patch(requestUrls.admin, data, {params: {id: data.id}}).then(function (response) {
  notifyOk(i18n.t('saveSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

export const saveAdminGr = data => axios1.patch(requestUrls.adminGroupid, null, {params: data}).then(function (response) {
  notifyOk(i18n.t('saveSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//删除内部用户
export const deleteAdmins = data => axios1.delete(requestUrls.admins, {params: {adminUserId: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//添加内部用户
export const addAdmin = data => axios1.post(requestUrls.admin, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    if (error.response.status ===405 || error.response.status === 403){
      let httpValue = httpErrHdl(error.response.status);
      notifyErr(httpValue);
    }else{
      notifyErr(error.response.data);
    }
    return errorReply(error);
  });

export const testUrl = data => axios1.request(data).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

  //修改管理员disable
  export const updateAdminDisabled = data => axios1.patch(requestUrls.adminDisabled, data, {params: {id: data.id, disabled:data.disabled}}).then(function (response) {
    notifyOk(i18n.t('disabledUpdate'));
    return response;
  })
    .catch(function (error) {
      let httpValue = httpErrHdl(error.response.status);
      notifyErr(error.response.data + httpValue);
      return errorReply(error);
    });

    //修改管理员姓名
    export const updateAdminDisplayName = data => axios1.patch(requestUrls.admin, data, {params: {id: data.id}}).then(function (response) {
      notifyOk(i18n.t('displayNameUpdate'));
      return response;
    })
      .catch(function (error) {
        let httpValue = httpErrHdl(error.response.status);
        notifyErr(error.response.data + httpValue);
        return errorReply(error);
      });

   //修改管理员groupId
  export const updateAdminGroupId = data => axios1.patch(requestUrls.adminGroupid, data, {params: {id: data.id, groupId:data.groupId}}).then(function (response) {
    notifyOk(i18n.t('groupIdUpdate'));
    return response;
  })
    .catch(function (error) {
      let httpValue = httpErrHdl(error.response.status);
      notifyErr(error.response.data + httpValue);
      return errorReply(error);
    });

     //修改管理员密码
  export const updateAdminPassword = data => axios1.post(requestUrls.otherPassword, data, {params: {id: data.id}}).then(function (response) {
    notifyOk(i18n.t('passwordUpdate'));
    return response;
  })
    .catch(function (error) {
      let httpValue = httpErrHdl(error.response.status);
      notifyErr(error.response.data + httpValue);
      return errorReply(error);
    });

//修改管理员自己的密码
export const updatePassword = data => axios1.post(requestUrls.updatePassword, data, {params: {id: data.id}}).then(function (response) {
  notifyOk(i18n.t('passwordUpdate'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });


  //获取外部用户列表
export const getCommons = data => axios1.get(requestUrls.common, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

  //获取外部用户总数
export const getCommonNumber = data => axios1.get(requestUrls.commonNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//删除外部用户
export const deleteCommons = data => axios1.delete(requestUrls.commons, {params: {commonUserId: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });


//修改外部用户信息
export const updateCommonById = data => axios1.post(requestUrls.updateCommon, data, {params: {id: data.id}}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

  //添加外部用户
export const addCommon = data => axios1.post(requestUrls.common, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    if (error.response.status ===405 || error.response.status === 403){
      let httpValue = httpErrHdl(error.response.status);
      notifyErr(httpValue);
    }else{
      notifyErr(error.response.data);
    }
    return errorReply(error);
  });

    //添加权限组

export const addGroup = data => axios1.post(requestUrls.adminGroup, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);

    return errorReply(error);
  });

  //修改权限组信息
export const updateGroup = data => axios1.patch(requestUrls.adminGroup, data, {params: {id: data.id}}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

  //删除权限组
export const deleteGroups = data => axios1.delete(requestUrls.adminGroups, {params: {group_id: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//获取项目列表
export const getProjects = data => axios1.get(requestUrls.projects, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


//获取项目列表总数
export const getProjectNumber = data => axios1.get(requestUrls.projectsNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

  //获取地址列表
export const getAddressValue = data => axios1.get(requestUrls.addressInfo, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


  //修改项目信息
export const updateProject = data => axios1.patch(requestUrls.project, data, {params: {id: data.id,project:data}}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });


  //删除项目
export const deleteProject = data => axios1.delete(requestUrls.projects, {params: {projectId: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });


  //添加项目
export const addProject = data => axios1.post(requestUrls.project, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });

//获取设备列表
export const getDevices = data => axios1.get(requestUrls.devices, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//获取设备列表总数
export const getDevicesNumber = data => axios1.get(requestUrls.devicesNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//删除设备
export const deleteDevice = data => axios1.delete(requestUrls.devices, {params: {id: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//修改设备信息
export const updateDevice = data => axios1.patch(requestUrls.device,data, {params:{id: data.id}}).then(function (response) {
  notifyOk(i18n.t('deviceUpdate'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//添加设备
export const addDevice = data => axios1.post(requestUrls.device, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });

//批量添加设备
export const addDevices = data => axios1.post(requestUrls.devices, data).then(function (response) {
  if (response.data.length<=0){
    notifyOk(i18n.t('addSuccess'));
    return response
  } else {
    return response
  }

})
  .catch(function (error) {
    //var bb = aa.join('\n')
     /*Dialog.create({
       type: 'positive',
       title: i18n.t('errorInfo'),
       message: bb
    });*/
    return error.response
  });

//获取产品列表总数
export const getProductNumber = data => axios1.get(requestUrls.productNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//获取产品列表
export const getProduct = data => axios1.get(requestUrls.product, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


//修改产品信息
export const updateProduct = data => axios1.patch(requestUrls.productUp,data, {params:{id: data.id}}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

  //删除产品
export const deleteProduct = data => axios1.delete(requestUrls.product, {params: {productIds: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

    //添加产品
export const addProduct = data => axios1.post(requestUrls.productUp, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });

 //显示设备历史数据信息
export const deviceDataInfo = data => axios1.get(requestUrls.deviceDataInfo, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });

//获取工单总数
export const getWorkOrderNumber = data => axios1.get(requestUrls.workOrderNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//查询设备数量信息
export const getDeviceInfoNumber = data => axios1.get(requestUrls.deviceInfoNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

  //查询故障设备数量信息
export const getDeviceFaultNumber = data => axios1.get(requestUrls.deviceFaultNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

  //查询工单数量信息
export const getWorkOrderListNumber = data => axios1.get(requestUrls.workOrderListNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });


  //获取激活列表总数
export const getActivationNumber = data => axios1.get(requestUrls.deviceActivationNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//获取激活列表
export const getActivation = data => axios1.get(requestUrls.deviceActivations, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });
    //添加设备激活数据
export const addDeviceActivation = data => axios1.get(requestUrls.addDeviceActivation, {params:data}).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });

  //获取所有激活设备数据
export const getAllDownLoadFile = data => axios1.get(requestUrls.downloadFile, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });
 //查询上传报告表
export const getUploadReport = data => axios1.get(requestUrls.uploadReport, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

 //查询上传报告表总数
export const getUploadReportNumber = data => axios1.get(requestUrls.uploadReportNumber, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//测试hub服务器连接
export const getcehsi = data => axiosHub.get(requestUrls.ceshi).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(httpValue);
  });

//获取日期列表
export const getHolidays = data => axios1.get(requestUrls.holidays, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


//更新日期列表
export const updateHoliday = data => axios1.patch(requestUrls.holiday,data, {params: data}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//删除日期列表
export const deleteHolidays = data => axios1.delete(requestUrls.holidays,{params:data}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//批量添加日期
export const addHolidays = data => axios1.post(requestUrls.holidays, data).then(function (response) {
  if (response.data == '添加成功' || response.data == 'Add succeeded'){
    notifyOk(i18n.t('addSuccess'));
    return response
  } else {
    return response
  }
})
  .catch(function (error) {
    return error.response
  });

//获取错误状态列表
export const getErrorStatusList = data => axios1.get(requestUrls.errorCodes, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//更新错误状态
export const updateErrorCode = data => axios1.patch(requestUrls.errorCode,data, {params: data}).then(function (response) {
  notifyOk(i18n.t('updateSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });

//删除errorCode信息
export const deleteErrorCode = data => axios1.delete(requestUrls.errorCodes, {params: {errorStatus: data}}).then(function (response) {
  notifyOk(i18n.t('deleteSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
    return errorReply(error);
  });

//添加错误状态
export const addErrorCode = data => axios1.post(requestUrls.errorCode, data).then(function (response) {
  notifyOk(i18n.t('addSuccess'));
  return response;
})
  .catch(function (error) {
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data);
    return errorReply(error);
  });


//admin服务器中获取hub服务器的token
export const adminLoginHub = data => axios1.get(requestUrls.getHubToken, {params: data}).then(function (response) {
  return response;
})
  .catch(function (error) {
    console.log(error)
    if (error == "Error: Network Error"){
      notifyErr(i18n.t('hubServerNotStarted'))
    }
    let httpValue = httpErrHdl(error.response.status);
    notifyErr(error.response.data + httpValue);
  });


