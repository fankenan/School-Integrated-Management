import { http } from '@/utils/request'
import type { PaginatedResult } from './personnel'

const BASE = '/api/v1'

export interface LeaveItem {
  id: string; studentId: string; type: string; reason?: string
  startTime: string; endTime: string; status: string
  approverId?: string; approvalNote?: string
  leaveAt?: string; returnAt?: string
  student?: { id: string; name: string; studentNo: string }
}

export function getLeaveList(params: Record<string, any>) {
  return http.get<PaginatedResult<LeaveItem>>(`${BASE}/leaves`, { params })
}
export function createLeave(data: Partial<LeaveItem>) {
  return http.post<LeaveItem>(`${BASE}/leaves`, data)
}
export function updateLeave(id: string, data: Partial<LeaveItem>) {
  return http.put<LeaveItem>(`${BASE}/leaves/${id}`, data)
}
export function deleteLeave(id: string) {
  return http.delete(`${BASE}/leaves/${id}`)
}
export function approveLeave(id: string, note?: string) {
  return http.post(`${BASE}/leaves/approve`, { id, note })
}
export function rejectLeave(id: string, note?: string) {
  return http.post(`${BASE}/leaves/reject`, { id, note })
}
