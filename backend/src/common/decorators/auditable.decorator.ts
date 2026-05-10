import { SetMetadata } from '@nestjs/common'

export const AUDIT_KEY = 'audit'

export interface AuditConfig {
  module: string
  action: string
}

export const Auditable = (config: AuditConfig) => SetMetadata(AUDIT_KEY, config)
