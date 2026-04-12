import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BookingProxyService {
  private baseUrl = process.env.BOOKING_SERVICE_URL;

  constructor(private http: HttpService) {}

  async createBooking(payload: any) {
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}/`, payload),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, 'Error creating booking');
    }
  }

  async getAllBookings() {
    try {
      const res = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/`));
      return res.data;
    } catch (error) {
      this.handleError(error, 'Error fetching all bookings');
    }
  }

  async getBookingById(id: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.baseUrl}/${id}`),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, `Error fetching booking with ID ${id}`);
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
