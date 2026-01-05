import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConceptProxyService {
  private baseUrl = process.env.CONCEPT_SERVICE_URL;

  constructor(private http: HttpService) {}

  async getAllConcepts() {
    const res = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/`));
    return res.data;
  }

  async getConceptById(id: string) {
    const res = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/${id}`),
    );
    return res.data;
  }

  async createConcept(data: any, token: string) {
    const res = await firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return res.data;
  }
}
