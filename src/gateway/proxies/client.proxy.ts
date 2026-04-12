import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ClientProxyService {
  private baseUrl = process.env.CLIENT_SERVICE_URL;

  constructor(private http: HttpService) {}

  async getClients(token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.baseUrl}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, 'Error fetching clients');
    }
  }

  async getClientById(id: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.baseUrl}/clients/${id}`),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, `Error fetching client with ID ${id}`);
    }
  }

  private handleError(error: any, message: string) {
    if (error instanceof AxiosError) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const data = error.response?.data || { message: error.message };
      throw new HttpException(
        {
          message,
          gatewayError: data,
        },
        status,
      );
    }
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
