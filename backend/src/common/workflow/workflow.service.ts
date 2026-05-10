import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowInstanceStatus,
  WorkflowNode,
  WorkflowNodeStatus,
  WorkflowApproval,
  ApprovalAction,
} from './entities'

export interface StartWorkflowDto {
  templateId: string
  businessType: string
  businessId: string
  title: string
  initiatorId: string
}

export interface ApproveWorkflowDto {
  nodeId: string
  approverId: string
  action: ApprovalAction
  comment?: string
  attachments?: string[]
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowTemplate)
    private templateRepo: Repository<WorkflowTemplate>,
    @InjectRepository(WorkflowInstance)
    private instanceRepo: Repository<WorkflowInstance>,
    @InjectRepository(WorkflowNode)
    private nodeRepo: Repository<WorkflowNode>,
    @InjectRepository(WorkflowApproval)
    private approvalRepo: Repository<WorkflowApproval>,
    private eventEmitter: EventEmitter2,
  ) {}

  async startWorkflow(dto: StartWorkflowDto): Promise<WorkflowInstance> {
    const template = await this.templateRepo.findOne({ where: { id: dto.templateId } })
    if (!template || !template.isActive) {
      throw new NotFoundException('审批模板不存在或未启用')
    }

    const instance = this.instanceRepo.create({
      templateId: dto.templateId,
      businessType: dto.businessType,
      businessId: dto.businessId,
      title: dto.title,
      initiatorId: dto.initiatorId,
      status: WorkflowInstanceStatus.PENDING,
      nodeConfigSnapshot: template.nodeSchema,
    })

    const savedInstance = await this.instanceRepo.save(instance)

    // Create workflow nodes from template
    const nodes: WorkflowNode[] = []
    for (const nodeConfig of template.nodeSchema) {
      const node = this.nodeRepo.create({
        instanceId: savedInstance.id,
        nodeOrder: nodeConfig.order,
        nodeName: nodeConfig.name,
        approvalType: nodeConfig.approvalType,
        approvers: nodeConfig.approvers,
        status: nodeConfig.order === 1 ? WorkflowNodeStatus.IN_PROGRESS : WorkflowNodeStatus.PENDING,
        startedAt: nodeConfig.order === 1 ? new Date() : undefined,
      })
      nodes.push(node)
    }
    await this.nodeRepo.save(nodes)

    const firstNode = nodes.find((n) => n.nodeOrder === 1)
    if (firstNode) {
      savedInstance.currentNodeId = firstNode.id
      await this.instanceRepo.save(savedInstance)
    }

    this.eventEmitter.emit('workflow.started', { instanceId: savedInstance.id, businessType: dto.businessType })
    return savedInstance
  }

  async approve(dto: ApproveWorkflowDto): Promise<WorkflowApproval> {
    const node = await this.nodeRepo.findOne({
      where: { id: dto.nodeId },
      relations: ['instance'],
    })
    if (!node) throw new NotFoundException('审批节点不存在')
    if (node.status === WorkflowNodeStatus.COMPLETED) {
      throw new BadRequestException('该节点已处理')
    }

    const approval = this.approvalRepo.create({
      nodeId: dto.nodeId,
      approverId: dto.approverId,
      action: dto.action,
      comment: dto.comment,
      attachments: dto.attachments,
    })
    await this.approvalRepo.save(approval)

    if (dto.action === ApprovalAction.REJECT) {
      node.status = WorkflowNodeStatus.COMPLETED
      node.completedAt = new Date()
      await this.nodeRepo.save(node)

      const instance = node.instance
      instance.status = WorkflowInstanceStatus.REJECTED
      instance.currentNodeId = null
      instance.completedAt = new Date()
      await this.instanceRepo.save(instance)

      this.eventEmitter.emit('workflow.rejected', { instanceId: instance.id })
    } else if (dto.action === ApprovalAction.APPROVE) {
      // Check if all approvals in this node are done based on approvalType
      const nodeApprovals = await this.approvalRepo.find({ where: { nodeId: dto.nodeId } })
      const totalApprovers = node.approvers.length

      if (node.approvalType === 'OR' || nodeApprovals.length >= totalApprovers) {
        // Node completed
        node.status = WorkflowNodeStatus.COMPLETED
        node.completedAt = new Date()
        await this.nodeRepo.save(node)

        // Move to next node
        const nextNode = await this.nodeRepo.findOne({
          where: { instanceId: node.instanceId, nodeOrder: node.nodeOrder + 1 },
        })

        const instance = await this.instanceRepo.findOne({ where: { id: node.instanceId } })
        if (nextNode) {
          nextNode.status = WorkflowNodeStatus.IN_PROGRESS
          nextNode.startedAt = new Date()
          await this.nodeRepo.save(nextNode)
          instance.currentNodeId = nextNode.id
        } else {
          // Workflow completed
          instance.status = WorkflowInstanceStatus.APPROVED
          instance.completedAt = new Date()
          instance.currentNodeId = null
          this.eventEmitter.emit('workflow.approved', { instanceId: instance.id })
        }
        await this.instanceRepo.save(instance)
      }
    }

    return approval
  }

  async getInstance(id: string) {
    return this.instanceRepo.findOne({
      where: { id },
      relations: ['template', 'initiator', 'nodes', 'nodes.approvals', 'nodes.approvals.approver'],
    })
  }

  async getPendingApprovals(userId: string) {
    return this.instanceRepo
      .createQueryBuilder('instance')
      .leftJoinAndSelect('instance.nodes', 'nodes')
      .leftJoinAndSelect('instance.template', 'template')
      .leftJoinAndSelect('instance.initiator', 'initiator')
      .where('instance.status = :status', { status: WorkflowInstanceStatus.PENDING })
      .andWhere('nodes.status = :nodeStatus', { nodeStatus: WorkflowNodeStatus.IN_PROGRESS })
      .getMany()
  }
}