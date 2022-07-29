import axios from '@/network/http';
import base from '@/network/base';

//字段
//查询字段列表
export function getField(params) {
  return axios.get(`${base.current}/sys/dictionary/field/getFieldInfo`, { params, params });
}

//新增字段
export function addField(params) {
  return axios.post(`${base.current}/sys/dictionary/field/addFieldInfo`, JSON.stringify(params));
}

//修改字段
export function updateField(params) {
  return axios.post(`${base.current}/sys/dictionary/field/updateFieldInfo`, JSON.stringify(params));
}

//删除模型
export function deleteField(params) {
  return axios.post(`${base.current}/sys/dictionary/field/deleteFieldInfo/${params}`);
}