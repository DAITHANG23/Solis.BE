import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ConceptProxyService {
  private baseUrl = process.env.CONCEPT_SERVICE_URL;

  constructor(private http: HttpService) {}

  async getAllConcepts() {
    try {
      const res = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/`));
      return res.data;
    } catch (error) {
      this.handleError(error, 'Error fetching all concepts');
    }
  }

  async getConceptById(id: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${this.baseUrl}/${id}`),
      );
      return res.data;
    } catch (error) {
      this.handleError(error, `Error fetching concept with ID ${id}`);
    }
  }

  async createConcept(data: any, token: string) {
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}/`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return res.data;
    } catch (error) {
      this.handleError(error, 'Error creating concept');
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
