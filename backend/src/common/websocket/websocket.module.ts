import { Module } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { ConnectionRegistryService } from './connection-registry.service'

@Module({
  providers: [WebsocketGateway, ConnectionRegistryService],
  exports: [WebsocketGateway, ConnectionRegistryService],
})
export class WebsocketModule {}