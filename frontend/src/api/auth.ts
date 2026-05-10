import { http } from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo } from '@/types/user'

const BASE_URL = '/api/v1'

// 登录
export function login(data: LoginForm) {
  return http.post<LoginResponse>(`${BASE_URL}/auth/login`, data)
}

// 获取用户信息
export function getUserInfo() {
  return http.get<UserInfo>(`${BASE_URL}/auth/userinfo`)
}

// 退出登录
export function logout() {
  return http.post(`${BASE_URL}/auth/logout`)
}

// 修改密码
export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return http.post(`${BASE_URL}/auth/change-password`, data)
}