import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
import * as os from 'os';
import axios from 'axios';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly cpuUsageGauge: client.Gauge<string>;
  private readonly memoryUsageGauge: client.Gauge<string>;
  private readonly httpRequestCounter: client.Counter<string>;
}
