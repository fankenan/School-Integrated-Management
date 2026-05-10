import { http } from '@/utils/request'

const BASE = '/api/v1'

export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ========== 学生管理 ==========
export interface StudentItem {
  id: string; studentNo: string; name: string; gender: string
  birthday?: string; idCard?: string; address?: string; phone?: string
  guardianName?: string; guardianPhone?: string; guardianRelation?: string
  enrollmentDate?: string; status: string; classId?: string; schoolId?: string
  class?: { id: string; name: string }; school?: { id: string; name: string }
}

export function getStudentList(params: Record<string, any>) {
  return http.get<PaginatedResult<StudentItem>>(`${BASE}/students`, { params })
}
export function getStudent(id: string) {
  return http.get<StudentItem>(`${BASE}/students/${id}`)
}
export function createStudent(data: Partial<StudentItem>) {
  return http.post<StudentItem>(`${BASE}/students`, data)
}
export function updateStudent(id: string, data: Partial<StudentItem>) {
  return http.put<StudentItem>(`${BASE}/students/${id}`, data)
}
export function deleteStudent(id: string) {
  return http.delete(`${BASE}/students/${id}`)
}

// ========== 教师管理 ==========
export interface TeacherItem {
  id: string; teacherNo: string; name: string; gender: string
  title?: string; subjects?: string; education?: string
  phone?: string; email?: string; hireDate?: string; status: string
  departmentId?: string; schoolId?: string
  department?: { id: string; name: string }; school?: { id: string; name: string }
}

export function getTeacherList(params: Record<string, any>) {
  return http.get<PaginatedResult<TeacherItem>>(`${BASE}/teachers`, { params })
}
export function getTeacher(id: string) {
  return http.get<TeacherItem>(`${BASE}/teachers/${id}`)
}
export function createTeacher(data: Partial<TeacherItem>) {
  return http.post<TeacherItem>(`${BASE}/teachers`, data)
}
export function updateTeacher(id: string, data: Partial<TeacherItem>) {
  return http.put<TeacherItem>(`${BASE}/teachers/${id}`, data)
}
export function deleteTeacher(id: string) {
  return http.delete(`${BASE}/teachers/${id}`)
}

// ========== 职工管理 ==========
export interface StaffItem {
  id: string; staffNo: string; name: string; gender: string
  position?: string; phone?: string; hireDate?: string; status: string
  departmentId?: string; schoolId?: string
  department?: { id: string; name: string }; school?: { id: string; name: string }
}

export function getStaffList(params: Record<string, any>) {
  return http.get<PaginatedResult<StaffItem>>(`${BASE}/staff`, { params })
}
export function getStaff(id: string) {
  return http.get<StaffItem>(`${BASE}/staff/${id}`)
}
export function createStaff(data: Partial<StaffItem>) {
  return http.post<StaffItem>(`${BASE}/staff`, data)
}
export function updateStaff(id: string, data: Partial<StaffItem>) {
  return http.put<StaffItem>(`${BASE}/staff/${id}`, data)
}
export function deleteStaff(id: string) {
  return http.delete(`${BASE}/staff/${id}`)
}
