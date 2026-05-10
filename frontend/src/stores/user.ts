import { defineStore } from 'pinia'
import { login, getUserInfo, logout as logoutApi } from '@/api/auth'
import type { LoginForm, UserInfo } from '@/types/user'
import { Message } from '@arco-design/web-vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.userInfo?.id,
    username: (state) => state.userInfo?.username,
    roles: (state) => state.userInfo?.roles || [],
    permissions: (state) => state.userInfo?.permissions || [],
  },

  actions: {
    // 登录
    async login(loginForm: LoginForm) {
      try {
        const res = await login(loginForm)
        this.token = res.accessToken
        this.userInfo = res.user
        localStorage.setItem('token', res.accessToken)
        return res
      } catch (error) {
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const userInfo = await getUserInfo()
        this.userInfo = userInfo
        return userInfo
      } catch (error) {
        throw error
      }
    },

    // 退出登录
    async logout() {
      try {
        await logoutApi()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        Message.success('退出登录成功')
      }
    },

    // 更新用户信息
    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...userInfo }
      }
    },
  },
})