import { http } from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo } from '@/types/user'

// 登录
export function login(data: LoginForm) {
  return http.post<LoginResponse>('/auth/login', data)
}

// 获取用户信息
export function getUserInfo() {
  return http.get<UserInfo>('/auth/userinfo')
}

// 退出登录
export function logout() {
  return http.post('/auth/logout')
}

// 修改密码
export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return http.post('/auth/change-password', data)
}