import { SetMetadata } from '@nestjs/common'

export const DATA_SCOPE_KEY = 'dataScope'

export interface DataScopeConfig {
  field: string // e.g. 'classId', 'gradeId', 'schoolId', 'departmentId'
  selfField?: string // e.g. 'ownClassId' — the field on the user entity that holds their scope value
  userField?: string // the user request property to read from
}

export const DataScope = (config: DataScopeConfig) => SetMetadata(DATA_SCOPE_KEY, config)
