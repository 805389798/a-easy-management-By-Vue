import axios from '@/network/http';
import base from '@/network/base';

//菜单
//获取菜单列表
export function getMenuList(params) {
  return axios.get(`${base.current}/sys/menu/getMenuInfo`, { params: params });
}

//添加菜单
export function addMenu(params) {
  return axios.post(`${base.current}/sys/menu/addMenuInfo`, JSON.stringify(params));
}

//编辑菜单
export function updateMenu(params) {
  return axios.post(`${base.current}/sys/menu/updateMenuInfo`, JSON.stringify(params));
}

//删除菜单
export function deleteMenu(params) {
  return axios.post(`${base.current}/sys/menu/deleteMenuInfo/${params}`);
}

//获取权限菜单列表
export function getPermissionMenuList(params) {
  return axios.get(`${base.current}/sys/menu/getPermissionsInfo`, { params: params });
}

//获取菜单树形结构
export function getMenuTree() {
  return axios.get(`${base.current}/sys/menu/getTreeStructure`);
}
