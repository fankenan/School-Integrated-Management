import { http } from '@/utils/request'
import type { PaginatedResult } from './personnel'

const BASE = '/api/v1'

export interface RepairItem {
  id: string; reporter: string; location: string; description: string
  urgency: string; status: string; repairPerson?: string; completedAt?: string
}

export function getRepairList(params: Record<string, any>) {
  return http.get<PaginatedResult<RepairItem>>(`${BASE}/repairs`, { params })
}
export function createRepair(data: Partial<RepairItem>) {
  return http.post<RepairItem>(`${BASE}/repairs`, data)
}
export function updateRepair(id: string, data: Partial<RepairItem>) {
  return http.put<RepairItem>(`${BASE}/repairs/${id}`, data)
}
export function deleteRepair(id: string) {
  return http.delete(`${BASE}/repairs/${id}`)
}
export function assignRepair(id: string, repairPerson: string) {
  return http.post(`${BASE}/repairs/assign`, { id, repairPerson })
}
export function completeRepair(id: string) {
  return http.post(`${BASE}/repairs/complete`, { id })
}
