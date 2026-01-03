import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientProxyService {
  private baseUrl = process.env.CLIENT_SERVICE_URL;

  constructor(private http: HttpService) {}

  async getClients(token: string) {
    const res = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return res.data;
  }

  async getClientById(id: string) {
    const res = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/clients/${id}`),
    );
    return res.data;
  }
}
