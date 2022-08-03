import axios from '@/network/http';
import base from '@/network/base';

//角色
//新增角色
export function addRole(params) {
  return axios.post(`${base.current}/sys/role/addRole`, JSON.stringify(params));
}

//删除角色
export function deleteRole(params) {
  return axios.post(`${base.current}/sys/role/deleteRole/${params}`);
}

//删除角色
export function updateRole(params) {
  return axios.post(`${base.current}/sys/role/updateRole`, JSON.stringify(params));
}

//分页查询角色
export function getRole(params) {
  return axios.get(`${base.current}/sys/role/getConditionInfo`, { params, params });
}

//更新角色菜单关系
export function updateRoleRelationMenu(params) {
  return axios.post(`${base.current}/sys/role/updateRoleRelationMenu`, JSON.stringify(params));
}

//分页查询角色
export function getRoleTree() {
  return axios.get(`${base.current}/sys/role/getTreeStructure`);
}
