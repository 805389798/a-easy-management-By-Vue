import { getPermissionMenuList } from '@/network/modules/menu';

const actions = {
  getMenuList({ commit }) {
    return getPermissionMenuList()
      .then(res => {
        let menuList = res.data.data || [];
        let routeList = [];
        for (let item of menuList) {
          let data = {
            path: item.routingPath,
            name: item.menuName,
            //需要使用正则处理
            component: resolve => require([`@/${item.componentPath.replace(/(^\/*)/g, '')}.vue`], resolve),
            menuParentName: item.menuParentName,
            meta: {
              title: item.menuName,
              icon: item.menuIcon,
              hidden: item.showStatus == '0' ? true : false,
            },
          };
          if (item.routingPath == '/home') {
            data.redirect = '/home/welcome';
          }
          routeList.push(data);
        }
        commit('UPDATE_MENU_LIST', routeList);
      })
      .catch(err => {
        console.log(err.data);
      });
  },
};

export default actions;
