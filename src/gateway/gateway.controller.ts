import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { ClientProxyService } from './proxies/client.proxy';
import { ConceptProxyService } from './proxies/concept.proxy';
import { BookingProxyService } from './proxies/booking.proxy';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientDto } from 'src/client/dto';

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  constructor(
    private clientProxy: ClientProxyService,
    private conceptProxy: ConceptProxyService,
    private bookingProxy: BookingProxyService,
  ) {}

  // Client Endpoints
  @Get('clients')
  @ApiCreatedResponse({
    description: 'Get all clients',
    type: [ClientDto],
  })
  @ApiBadRequestResponse({
    description: 'Clients list cannot get information. Try again!',
  })
  getClients(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.clientProxy.getClients(token);
  }

  @Get('clients/:id')
  @ApiCreatedResponse({
    description: 'Get cleint by id',
    type: ClientDto,
  })
  @ApiBadRequestResponse({
    description: 'Client cannot get information. Try again!',
  })
  getClientById(@Param('id') id: string) {
    return this.clientProxy.getClientById(id);
  }

  // Concept Endpoints
  @Get('concepts')
  @ApiCreatedResponse({
    description: 'Get all concepts',
    type: [Object],
  })
  @ApiBadRequestResponse({
    description: 'Concepts list cannot get information. Try again!',
  })
  getConcepts() {
    return this.conceptProxy.getAllConcepts();
  }

  @Get('concepts/:id')
  @ApiCreatedResponse({
    description: 'Get concept by id',
    type: Object,
  })
  @ApiBadRequestResponse({
    description: 'Concept cannot get information. Try again!',
  })
  getConceptById(@Param('id') id: string) {
    return this.conceptProxy.getConceptById(id);
  }

  @Post('concept')
  @ApiCreatedResponse({
    description: 'Create a new concept',
    type: Object,
  })
  @ApiBadRequestResponse({
    description: 'Concept cannot be created. Try again!',
  })
  createConcept(@Body() data: any, @Req() req: any) {
    const token = req.headers.authorization;
    return this.conceptProxy.createConcept(data, token);
  }

  // Booking Endpoints
  @Get('bookings')
  @ApiCreatedResponse({
    description: 'Get all booking',
    type: [Object],
  })
  @ApiBadRequestResponse({
    description: 'Booking cannot be created. Try again!',
  })
  getAllBookings() {
    return this.bookingProxy.getAllBookings();
  }

  @Get('bookings/:id')
  @ApiCreatedResponse({
    description: 'Get booking by id',
    type: Object,
  })
  @ApiBadRequestResponse({
    description: 'Booking cannot get information. Try again!',
  })
  getBookingById(@Param('id') id: string) {
    return this.bookingProxy.getBookingById(id);
  }

  @Post('bookings')
  @ApiCreatedResponse({
    description: 'Create a new booking',
    type: Object,
  })
  @ApiBadRequestResponse({
    description: 'Booking cannot be created. Try again!',
  })
  createBooking(@Body() payload: any) {
    return this.bookingProxy.createBooking(payload);
  }
}
