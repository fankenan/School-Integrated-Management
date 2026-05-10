// 用户登录表单
export interface LoginForm {
  username: string
  password: string
  captcha?: string
}

// 登录响应
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: UserInfo
}

// 用户角色
export interface Role {
  id: string
  name: string
  code: string
  description?: string
}

// 用户权限
export interface Permission {
  id: string
  name: string
  code: string
  type: string
}

// 用户信息
export interface UserInfo {
  id: string
  username: string
  realName: string
  email?: string
  phone?: string
  avatar?: string
  status: number
  roles: Role[]
  permissions: Permission[]
  departmentId?: string
  departmentName?: string
}

// 用户列表项
export interface UserListItem {
  id: string
  username: string
  realName: string
  email?: string
  phone?: string
  avatar?: string
  status: number
  roles: Role[]
  departmentId?: string
  departmentName?: string
  createdAt: string
  updatedAt: string
}

// 用户查询参数
export interface UserQueryParams {
  page?: number
  pageSize?: number
  username?: string
  realName?: string
  status?: number
  departmentId?: string
  roleId?: string
}

// 用户列表响应
export interface UserListResponse {
  list: UserListItem[]
  total: number
  page: number
  pageSize: number
}