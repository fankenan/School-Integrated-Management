import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as compression from 'compression'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  const configService = app.get(ConfigService)
  const logger = new Logger('Bootstrap')

  // 全局前缀
  app.setGlobalPrefix('api/v1')

  // 启用压缩
  app.use(compression())

  // 安全头
  app.use(helmet())

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  // 启用CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  // Swagger API文档
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('学校综合业务服务平台API')
      .setDescription('学校综合业务服务平台后端API文档')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', '认证相关')
      .addTag('users', '用户管理')
      .addTag('roles', '角色管理')
      .addTag('permissions', '权限管理')
      .addTag('departments', '部门管理')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)

    logger.log('API文档地址: http://localhost:3000/api/docs')
  }

  const port = configService.get<number>('PORT') || 3000
  await app.listen(port)

  logger.log(`应用程序运行在: http://localhost:${port}`)
  logger.log(`环境: ${configService.get('NODE_ENV') || 'development'}`)
}

bootstrap()
