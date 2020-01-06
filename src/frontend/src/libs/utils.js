/* eslint-disable */
import {testUrl} from "../interface/getData";
const { filter } = require('p-iteration');
import {httpStatus} from "../util/env";
import {i18n} from '../plugins/i18n';


export const convertTimeString = function (date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`
}

export const randomColor = function () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const parseURL = function (url) {
  var a = document.createElement('a')
  a.href = url
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  }
}
// export default convertTimeString
// export default parseURL


export async function getAuth(list) {
  return await filter(list, async x => {
    if(!x.urlTest || !x.urlTest.length || x.urlTest.length === 0) return true;
    let auth = true;
    for(const i in x.urlTest){
      const r = await testUrl(x.urlTest[i]);
      if(r.status === httpStatus.unAuth) {auth = false; break}
    }
    return auth;
  });
}

export function checkHttp(state) {
  if (100 <= state && state <= 307) {
    return true;
  }else {
    return false;
  }
}

export function httpErrHdl(returnState) {
  if (returnState == 505){
    return i18n.t('notExist')
  }else if (returnState == 400){
    return i18n.t('badRequest')
  }else if (returnState == 417){
    return i18n.t('expectationFailed')
  }else if (returnState == 403 || returnState == 404 ||returnState == 405){
    return i18n.t('cannotAccess')
  }
}



