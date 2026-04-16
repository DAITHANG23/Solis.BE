import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { keysToCamel } from './case.util';

// (Tùy chọn) Định nghĩa interface cho dữ liệu trả về để chuẩn type
export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        const camelData = keysToCamel(data);

        return {
          data: camelData,
          statusCode: statusCode,
          message: 'success',
        };
      }),
    );
  }
}
