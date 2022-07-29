import axios from '@/network/http';
import base from '@/network/base';

//部门
//添加部门数据
export function addDepartment(params) {
  return axios.post(`${base.current}/sys/department/addInfo`, JSON.stringify(params));
}

//修改部门数据
export function updateDepartment(params) {
  return axios.post(`${base.current}/sys/department/updateInfo`, JSON.stringify(params));
}

//删除部门数据
export function deleteDepartment(params) {
  return axios.post(`${base.current}/sys/department/deleteInfo/${params}`);
}

//查询部门数据
export function getDepartment(params) {
  return axios.get(`${base.current}/sys/department/getParentList`, { params, params });
}
