import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { randomUUID } from 'crypto'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name)

  use(req: any, res: any, next: () => void) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID()
    req.requestId = requestId
    res.setHeader('X-Request-Id', requestId)

    const { method, originalUrl } = req
    this.logger.log(`[${requestId}] ${method} ${originalUrl}`)

    next()
  }
}
