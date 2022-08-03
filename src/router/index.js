import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Login = () => import('@/layout/login/Login.vue');
const Home = () => import('@/layout/home/Home.vue');

Vue.use(VueRouter);

const constantRoutes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '登录页',
    component: Login,
    meta: {
      title: '登录页',
    },
  },
  {
    path: '/home',
    name: '系统设置',
    component: Home,
    meta: {
      title: '系统设置',
    },
    redirect: '/home/welcome',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes,
});

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

router.beforeEach(async (to, from, next) => {
  //登录
  if (to.path === '/login') {
    store.commit('menu/UPDATE_MENU_LIST', []);
    store.commit('menu/UPDATE_TOKEN', '');
    next();
  } else {
    let token = store.getters['menu/GET_TOKEN'];
    let menuList = store.getters['menu/GET_MENU_LIST'];

    if (token && menuList) {
      handleRoute(to, from, next);
      next();
    } else if (!token && menuList.length <= 0) {
      //获取token
      setVuexToken();
      //需要获取菜单列表
      store.dispatch('menu/getMenuList').then(res => {
        handleRoute(to, from, next);
      });
    } else if (menuList.length > 0 && !token) {
      //需要赋值token到vuex中
      setVuexToken();
      next();
    } else {
      next('/login');
    }
  }
});

//对路由进行添加
const handleRoute = (to, from, next) => {
  let route = router.getRoutes();
  if (route.length > 3) {
    next();
  } else {
    let list = store.getters['menu/GET_MENU_LIST'];
    if (list) {
      for (let item of list) {
        let parentName = item.menuParentName;

        if (parentName) {
          delete item.menuParentName;
          router.addRoute(parentName, item);
        } else {
          router.addRoute(item);
        }
      }
      next({ ...to, replace: true });
    } else {
      next();
    }
  }
};

//将token赋给vuex
const setVuexToken = () => {
  store.commit('menu/UPDATE_TOKEN', window.localStorage.getItem('token') || '');
};

export default router;
