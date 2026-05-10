import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'

// 基础路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', ignoreAuth: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '工作台', icon: 'Dashboard' },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        meta: { title: '工作台' },
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
  {
    path: '/office',
    name: 'Office',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '办公管理', icon: 'Apps' },
    children: [
      { path: '', name: 'OfficeHome', meta: { title: '办公概览' }, component: () => import('@/views/office/index.vue') },
      { path: 'documents', name: 'OfficeDocuments', meta: { title: '公文处理' }, component: () => import('@/views/office/documents/index.vue') },
    ],
  },
  {
    path: '/teaching',
    name: 'Teaching',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '教学管理', icon: 'Book' },
    children: [
      { path: '', name: 'TeachingHome', meta: { title: '教学概览' }, component: () => import('@/views/teaching/index.vue') },
    ],
  },
  {
    path: '/moral',
    name: 'Moral',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '德育管理', icon: 'Heart' },
    children: [
      { path: '', name: 'MoralHome', meta: { title: '德育概览' }, component: () => import('@/views/moral/index.vue') },
    ],
  },
  {
    path: '/safety',
    name: 'Safety',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '校园安全', icon: 'Safe' },
    children: [
      { path: '', name: 'SafetyHome', meta: { title: '安全概览' }, component: () => import('@/views/safety/index.vue') },
    ],
  },
  {
    path: '/logistics',
    name: 'Logistics',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '后勤服务', icon: 'Tool' },
    children: [
      { path: '', name: 'LogisticsHome', meta: { title: '后勤概览' }, component: () => import('@/views/logistics/index.vue') },
    ],
  },
  {
    path: '/personnel',
    name: 'Personnel',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '人员管理', icon: 'UserGroup' },
    children: [
      { path: '', name: 'PersonnelHome', meta: { title: '人员概览' }, component: () => import('@/views/personnel/index.vue') },
      { path: 'students', name: 'PersonnelStudents', meta: { title: '学生管理' }, component: () => import('@/views/personnel/students/index.vue') },
      { path: 'teachers', name: 'PersonnelTeachers', meta: { title: '教师管理' }, component: () => import('@/views/personnel/teachers/index.vue') },
      { path: 'staff', name: 'PersonnelStaff', meta: { title: '职工管理' }, component: () => import('@/views/personnel/staff/index.vue') },
    ],
  },
  {
    path: '/health',
    name: 'Health',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '校园卫生', icon: 'Safe' },
    children: [
      { path: '', name: 'HealthHome', meta: { title: '卫生概览' }, component: () => import('@/views/health/index.vue') },
    ],
  },
  {
    path: '/communication',
    name: 'Communication',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '家校沟通', icon: 'Message' },
    children: [
      { path: '', name: 'CommunicationHome', meta: { title: '沟通概览' }, component: () => import('@/views/communication/index.vue') },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '个人中心', icon: 'User' },
    children: [
      { path: '', name: 'ProfileHome', meta: { title: '个人中心' }, component: () => import('@/views/profile/index.vue') },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/layouts/default/index.vue'),
    meta: { title: '系统设置', icon: 'Settings' },
    children: [
      { path: '', name: 'SettingsHome', meta: { title: '系统设置' }, component: () => import('@/views/settings/index.vue') },
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