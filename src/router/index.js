import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/layout/login/Login.vue');
const Home = () => import('@/layout/home/Home.vue');

const Welcome = () => import('@/views/home/Welcome.vue');
const MenuManage = () => import('@/views/home/MenuManage.vue');
const UserManage = () => import('@/views/home/UserManage.vue');
const PostManage = () => import('@/views/home/PostManage.vue');
const DictionaryManage = () => import('@/views/home/DictionaryManage.vue');
const RoleManage = () => import('@/views/home/RoleManage.vue');
const DepartmentManage = () => import('@/views/home/DepartmentManage.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录页',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '系统设置',
    },
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: Welcome,
        meta: {
          title: '欢迎页',
        },
      },
      {
        path: 'menuManage',
        component: MenuManage,
        meta: {
          title: '菜单管理',
        },
      },
      {
        path: 'userManage',
        component: UserManage,
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'postManage',
        component: PostManage,
        meta: {
          title: '岗位管理',
        },
      },
      {
        path: 'dictionaryManage',
        component: DictionaryManage,
        meta: {
          title: '字典管理',
        },
      },
      {
        path: 'roleManage',
        component: RoleManage,
        meta: {
          title: '角色管理',
        },
      },
      {
        path: 'departmentManage',
        component: DepartmentManage,
        meta: {
          title: '部门管理',
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

// router.beforeEach((to, from, next) => {
//   //验证token
//   let token = localStorage.getItem('token');
//   if (token || to.path === '/login') {
//     next();
//   } else {
//     next('/login');
//   }
// });

export default router;
