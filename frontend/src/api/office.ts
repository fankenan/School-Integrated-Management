import { http } from '@/utils/request'
import type { PaginatedResult } from './personnel'

const BASE = '/api/v1'

export interface DocumentItem {
  id: string; title: string; content?: string; type: string; urgency: string
  status: string; creatorId?: string; createdAt: string
}

export function getDocumentList(params: Record<string, any>) {
  return http.get<PaginatedResult<DocumentItem>>(`${BASE}/documents`, { params })
}
export function createDocument(data: Partial<DocumentItem>) {
  return http.post<DocumentItem>(`${BASE}/documents`, data)
}
export function updateDocument(id: string, data: Partial<DocumentItem>) {
  return http.put<DocumentItem>(`${BASE}/documents/${id}`, data)
}
export function deleteDocument(id: string) {
  return http.delete(`${BASE}/documents/${id}`)
}
