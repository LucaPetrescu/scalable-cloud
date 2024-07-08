import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestDurationMicroseconds: client.Histogram<string>;

  constructor() {
    this.httpRequestDurationMicroseconds = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'code'],
      buckets: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    });
  }
}
