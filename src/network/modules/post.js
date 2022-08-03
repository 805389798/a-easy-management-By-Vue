import axios from '@/network/http';
import base from '@/network/base';

//岗位
//新增岗位
export function addPost(params) {
  return axios.post(`${base.current}/sys/post/addInfo`, JSON.stringify(params));
}

//编辑岗位
export function updatePost(params) {
  return axios.post(`${base.current}/sys/post/updateInfo`, JSON.stringify(params));
}

//删除岗位
export function deletePost(params) {
  return axios.post(`${base.current}/sys/post/deleteInfo/${params}`);
}

//查询岗位
export function getPost(params) {
  return axios.get(`${base.current}/sys/post/getInfo`, { params: params });
}

//查询岗位
export function getPostTree() {
  return axios.get(`${base.current}/sys/post/getTreeStructure`);
}
