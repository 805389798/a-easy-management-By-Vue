import axios from '@/network/http';
import base from '@/network/base';

//登录与验证
//登录
export function login(params) {
  return axios.post(`${base.current}/sys/login`, JSON.stringify(params));
}

export function logout() {
  return axios.get(`${base.current}/sys/logOut`);
}

//验证码
export function captcha() {
  return axios.post(`${base.current}/sys/captchaImage`);
}

//判断token是否过期
export function isToken() {
  return axios.get(`${base.current}/sys/getToken`);
}
