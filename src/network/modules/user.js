import axios from '@/network/http';
import base from '@/network/base';

//用户
//获取用户信息(主页使用)
export function getUserInfo() {
  return axios.get(`${base.current}/sys/getInfo`);
}

//分页查询
export function getUserList(params) {
  return axios.get(`${base.current}/sys/user/getConditionInfoAll`, { params, params });
}

//新增用户
export function addUser(params) {
  return axios.post(`${base.current}/sys/user/addInfo`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

//删除用户
export function deleteUser(params) {
  return axios.post(`${base.current}/sys/user/deleteInfo/${params}`);
}

//编辑用户
export function updateUser(params) {
  return axios.post(`${base.current}/sys/user/updateInfo`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

//重置密码
export function updateUserPassword(params) {
  return axios.post(`${base.current}/sys/user/updatePassword`, JSON.stringify(params));
}
