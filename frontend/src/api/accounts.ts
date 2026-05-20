import { http } from '@/utils/request'

const BASE = '/api/v1'

// ========== 家长管理 ==========
export interface ParentItem {
  id: string; name: string; gender: string; phone: string
  email?: string; relation: string; wechatOpenId?: string
  status: string; schoolId?: string; userId?: string
  students?: { id: string; name: string; studentNo: string }[]
  user?: { id: string; username: string }
}

export function getParentList(params: Record<string, any>) {
  return http.get<{ list: ParentItem[]; total: number; page: number; pageSize: number }>(`${BASE}/parents`, { params })
}
export function createParent(data: Partial<ParentItem> & { studentIds?: string[] }) {
  return http.post<ParentItem>(`${BASE}/parents`, data)
}
export function updateParent(id: string, data: Partial<ParentItem> & { studentIds?: string[] }) {
  return http.put<ParentItem>(`${BASE}/parents/${id}`, data)
}
export function deleteParent(id: string) {
  return http.delete(`${BASE}/parents/${id}`)
}
export function bindStudent(parentId: string, studentId: string) {
  return http.post(`${BASE}/parents/${parentId}/bind-student/${studentId}`)
}
export function unbindStudent(parentId: string, studentId: string) {
  return http.delete(`${BASE}/parents/${parentId}/unbind-student/${studentId}`)
}
export function createParentAccount(parentId: string, data: { username: string; password: string }) {
  return http.post(`${BASE}/parents/${parentId}/account`, data)
}

// ========== 统一账号管理 ==========
export interface AccountItem {
  id: string; name: string; phone?: string; email?: string
  teacherNo?: string; staffNo?: string
  status?: string; department?: { id: string; name: string }
  user?: { id: string; username: string }
  userId?: string
}

export function getTeacherAccounts(params: Record<string, any>) {
  return http.get<{ list: any[]; total: number; page: number; pageSize: number }>(`${BASE}/accounts/teachers`, { params })
}
export function getParentAccounts(params: Record<string, any>) {
  return http.get<{ list: any[]; total: number; page: number; pageSize: number }>(`${BASE}/accounts/parents`, { params })
}
export function getStaffAccounts(params: Record<string, any>) {
  return http.get<{ list: any[]; total: number; page: number; pageSize: number }>(`${BASE}/accounts/staff`, { params })
}
export function createTeacherAccount(teacherId: string, data: { username: string; password: string; roleCode?: string }) {
  return http.post(`${BASE}/accounts/create-for-teacher/${teacherId}`, data)
}
export function createStaffAccount(staffId: string, data: { username: string; password: string; roleCode?: string }) {
  return http.post(`${BASE}/accounts/create-for-staff/${staffId}`, data)
}
export function assignRoles(userId: string, roleIds: string[]) {
  return http.put(`${BASE}/accounts/${userId}/roles`, { roleIds })
}
export function resetPassword(userId: string, newPassword: string) {
  return http.post(`${BASE}/accounts/${userId}/reset-password`, { newPassword })
}
export function getAllRoles() {
  return http.get<{ id: string; name: string; code: string; description?: string }[]>(`${BASE}/accounts/roles`)
}

// ========== 年级管理员 ==========
export interface GradeAdminItem {
  id: string; gradeName: string; gradeLevel: string
  userId: string; schoolId: string; departmentId?: string
  user?: { id: string; username: string; realName: string; phone?: string }
  school?: { id: string; name: string }
}

export function getGradeAdminList(params: Record<string, any>) {
  return http.get<{ list: GradeAdminItem[]; total: number; page: number; pageSize: number }>(`${BASE}/grade-admins`, { params })
}
export function createGradeAdmin(data: {
  username: string; password: string; realName: string
  schoolId: string; gradeLevel: string; gradeName: string
  departmentId?: string; phone?: string
}) {
  return http.post(`${BASE}/grade-admins`, data)
}
export function deleteGradeAdmin(id: string) {
  return http.delete(`${BASE}/grade-admins/${id}`)
}
