import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkflowService } from './workflow.service'
import {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowNode,
  WorkflowApproval,
} from './entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowTemplate, WorkflowInstance, WorkflowNode, WorkflowApproval]),
  ],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}