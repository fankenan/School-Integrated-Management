import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { ConnectionRegistryService } from './connection-registry.service'
import { AuthGuard } from '@nestjs/passport'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/ws' })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(WebsocketGateway.name)

  constructor(private connectionRegistry: ConnectionRegistryService) {}

  handleConnection(client: Socket) {
    // In production, validate JWT from handshake token
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '')
    if (!token) {
      client.emit('error', 'Unauthorized')
      client.disconnect()
      return
    }
    // Extract userId from JWT payload
    const userId = this.extractUserId(token)
    if (userId) {
      this.connectionRegistry.add(userId, client.id)
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`)
      client.emit('connected', { socketId: client.id })
    } else {
      client.emit('error', 'Invalid token')
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    this.connectionRegistry.remove(client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  private extractUserId(token: string): string | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      return payload.sub || null
    } catch {
      return null
    }
  }

  // Send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    const socketIds = this.connectionRegistry.getSocketIds(userId)
    for (const socketId of socketIds) {
      this.server.to(socketId).emit(event, data)
    }
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data)
  }

  // Emergency alert broadcast
  @SubscribeMessage('emergency-alert')
  handleEmergencyAlert(client: Socket, payload: { message: string; level: string }) {
    this.broadcast('emergency-alert', { ...payload, timestamp: new Date().toISOString() })
  }

  // Get online count
  getOnlineCount(): number {
    return this.server?.sockets?.sockets?.size || 0
  }
}