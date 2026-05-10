import { Injectable } from '@nestjs/common'

@Injectable()
export class ConnectionRegistryService {
  private connections = new Map<string, string[]>() // userId -> socketIds

  add(userId: string, socketId: string) {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, [])
    }
    const sockets = this.connections.get(userId)!
    if (!sockets.includes(socketId)) {
      sockets.push(socketId)
    }
  }

  remove(socketId: string) {
    for (const [userId, sockets] of this.connections.entries()) {
      const idx = sockets.indexOf(socketId)
      if (idx !== -1) {
        sockets.splice(idx, 1)
        if (sockets.length === 0) {
          this.connections.delete(userId)
        }
        break
      }
    }
  }

  getSocketIds(userId: string): string[] {
    return this.connections.get(userId) || []
  }

  hasConnection(userId: string): boolean {
    return this.connections.has(userId) && this.connections.get(userId)!.length > 0
  }
}