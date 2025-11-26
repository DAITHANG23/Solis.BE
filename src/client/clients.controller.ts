import {
  Body,
  Controller,
  //   HttpCode,
  //   HttpStatus,
  Post,
  //   UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guard';
import { ClientDto, CreateClientDto } from './dto';
import { ClientService } from './clients.service';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post('createClient')
  @ApiCreatedResponse({
    description: 'Create client',
    type: ClientDto,
  })
  @ApiBadRequestResponse({
    description: 'Cannot create new client. Try again!',
  })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }
}
