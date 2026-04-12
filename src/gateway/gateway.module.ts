import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { ClientProxyService } from './proxies/client.proxy';
import { ConceptProxyService } from './proxies/concept.proxy';
import { BookingProxyService } from './proxies/booking.proxy';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [ClientProxyService, ConceptProxyService, BookingProxyService],
})
export class GatewayModule {}
