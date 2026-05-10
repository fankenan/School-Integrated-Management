import { http } from '@/utils/request'
import type { PaginatedResult } from './personnel'

const BASE = '/api/v1'

export interface ClassItem {
  id: string; name: string; grade?: string; headTeacher?: string
  studentCount: number; classroom?: string; schoolId?: string
}

export function getClassList(params: Record<string, any>) {
  return http.get<PaginatedResult<ClassItem>>(`${BASE}/classes`, { params })
}
export function createClass(data: Partial<ClassItem>) {
  return http.post<ClassItem>(`${BASE}/classes`, data)
}
export function updateClass(id: string, data: Partial<ClassItem>) {
  return http.put<ClassItem>(`${BASE}/classes/${id}`, data)
}
export function deleteClass(id: string) {
  return http.delete(`${BASE}/classes/${id}`)
}

export interface GradeItem {
  id: string; studentId: string; subject: string; score: number
  type: string; examName?: string; semester?: string; classId?: string
  student?: { id: string; name: string; studentNo: string }
}

export function getGradeList(params: Record<string, any>) {
  return http.get<PaginatedResult<GradeItem>>(`${BASE}/grades`, { params })
}
export function createGrade(data: Partial<GradeItem>) {
  return http.post<GradeItem>(`${BASE}/grades`, data)
}
export function updateGrade(id: string, data: Partial<GradeItem>) {
  return http.put<GradeItem>(`${BASE}/grades/${id}`, data)
}
export function deleteGrade(id: string) {
  return http.delete(`${BASE}/grades/${id}`)
}
export function getClassStats(classId: string, examName?: string) {
  return http.get<any>(`${BASE}/grades/stats/${classId}`, { params: { examName } })
}
