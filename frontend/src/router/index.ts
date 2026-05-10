import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'

// 基础路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      ignoreAuth: true,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: '工作台',
      icon: 'IconDashboard',
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

setupRouterGuards(router)

export default router