import axios from '@/network/http';
import base from '@/network/base';

//字典
//添加字典数据
export function addDictionary(params) {
  return axios.post(`${base.current}/sys/dictionary/addInfo`, JSON.stringify(params));
}

//删除字典数据
export function deleteDictionary(params) {
  return axios.post(`${base.current}/sys/dictionary/deleteInfo/${params}`);
}

//修改字典数据
export function updateDictionary(params) {
  return axios.post(`${base.current}/sys/dictionary/updateInfo`, JSON.stringify(params));
}

//查询字典数据
export function getDictionary(params) {
  return axios.get(`${base.current}/sys/dictionary/getInfo`, { params: params });
}

//状态切换
export function changeDictionaryStatus(params) {
  return axios.post(`${base.current}/sys/dictionary/bulkUpdateStatus`, JSON.stringify(params));
}
