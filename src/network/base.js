/**
 * 接口域名的管理
 */
//反向代理 跨域
// let base = {
//   current: '',
//   dev: '/api',
//   dbg: 'http://192.168.33.220:8888',
//   base: 'http://139.224.202.206:8888',
// };
// //设置当前使用的路径
// base.current = base.dev;

// export default base;

//后端进行跨域设置
let base = {
  current: '',
  dev: 'http://10.1.255.19:8084',
  dbg: '',
};

//设置当前使用的路径
base.current = base.dev;

export default base;
