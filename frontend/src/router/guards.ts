import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'

// 白名单路由
const whiteList = ['/login', '/404']

export function setupRouterGuards(router: Router) {
  // 前置守卫
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const hasToken = userStore.token
    const { ignoreAuth } = to.meta

    // 如果页面忽略认证，直接放行
    if (ignoreAuth) {
      next()
      return
    }

    // 已登录状态
    if (hasToken) {
      if (to.path === '/login') {
        // 如果已登录，访问登录页则跳转到首页
        next({ path: '/' })
      } else {
        // 检查是否已获取用户信息
        if (userStore.userInfo) {
          next()
        } else {
          // 获取用户信息
          userStore
            .getUserInfo()
            .then(() => {
              next()
            })
            .catch(() => {
              // 获取用户信息失败，退出登录
              userStore.logout()
              Message.error('登录状态已过期，请重新登录')
              next({ path: '/login', query: { redirect: to.fullPath } })
            })
        }
      }
    } else {
      // 未登录状态
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接放行
        next()
      } else {
        // 不在白名单中，跳转到登录页
        next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }
  })

  // 后置钩子
  router.afterEach((to) => {
    // 设置页面标题
    document.title = `${to.meta.title || '学校综合业务服务平台'}`
  })
}