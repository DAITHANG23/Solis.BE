import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingProxyService {
  private baseUrl = process.env.BOOKING_SERVICE_URL;

  constructor(private http: HttpService) {}

  async createBooking(payload: any) {
    const res = await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/`, payload),
    );
    return res.data;
  }

  async getAllBookings() {
    const res = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/`));
    return res.data;
  }

  async getBookingById(id: string) {
    const res = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/${id}`),
    );
    return res.data;
  }
}
