import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      message = typeof res === 'string' ? res : (res as any).message || exception.message
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
    }

    response.status(status).json({
      code: status,
      message: Array.isArray(message) ? message.join('; ') : message,
      data: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }
}
