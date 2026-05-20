import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { RolesModule } from './modules/roles/roles.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { DepartmentsModule } from './modules/departments/departments.module'
import { StudentsModule } from './modules/students/students.module'
import { TeachersModule } from './modules/teachers/teachers.module'
import { StaffModule } from './modules/staff/staff.module'
import { ParentsModule } from './modules/parents/parents.module'
import { AccountsModule } from './modules/accounts/accounts.module'
import { GradeAdminsModule } from './modules/grade-admins/grade-admins.module'
import { SchoolsModule } from './modules/schools/schools.module'
import { ClassesModule } from './modules/classes/classes.module'
import { RepairsModule } from './modules/repairs/repairs.module'
import { HealthExamsModule } from './modules/health-exams/health-exams.module'
import { MentalRecordsModule } from './modules/mental-records/mental-records.module'
import { GradesModule } from './modules/grades/grades.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { LeavesModule } from './modules/leaves/leaves.module'

import { EventBusModule } from './common/event-bus'
import { WorkflowModule } from './common/workflow'
import { NotificationModule } from './common/notification'
import { FileModule } from './common/file'
import { WechatModule } from './common/wechat'
import { WebsocketModule } from './common/websocket'

import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { PermissionGuard } from './common/guards/permission.guard'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'
import { DataScopeInterceptor } from './common/interceptors/data-scope.interceptor'
import { RequestIdMiddleware } from './common/middleware/request-id.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.development', '.env.production'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE', 'school_management'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    EventBusModule,
    AuthModule, UsersModule, RolesModule, PermissionsModule, DepartmentsModule,
    StudentsModule, TeachersModule, StaffModule, ParentsModule,
    AccountsModule, GradeAdminsModule, SchoolsModule, ClassesModule, RepairsModule, HealthExamsModule, MentalRecordsModule, GradesModule, DocumentsModule, LeavesModule,
    WorkflowModule, NotificationModule, FileModule, WechatModule, WebsocketModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: DataScopeInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*')
  }
}
