import {Injectable, OnModuleInit} from '@nestjs/common';
import * as client from 'prom-client';
import * as os from 'os';
import axios from 'axios';

@Injectable()
export class MetricsService implements OnModuleInit{
    private readonly httpRequestDurationMicroseconds: client.Histogram<string>;
    private readonly cpuUsageGauge: client.Gauge<string>;
    private readonly memoryUsageGauge: client.Gauge<string>;
    private readonly httpRequestCounter: client.Counter<string>;

    constructor(){
        this.cpuUsageGauge = new client.Gauge({
            name: 'cpu_usage_percent',
            help: 'CPU usage percentage',
        });

        this.memoryUsageGauge = new client.Gauge({
            name:'memory_usage_bytes',
            help: 'Memory usage in bytes',
        });

        this.httpRequestCounter = new client.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'path', 'status']
        })

        this.httpRequestDurationMicroseconds = new client.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'path', 'status'],
            buckets: [0.1, 0.5, 1, 2.5, 5, 10],
          });
    }

    onModuleInit() {
        client.collectDefaultMetrics();
        this.startMonitoring();
        this.sendMetricsToCollector();
    }

    private startMonitoring(){
        setInterval(() => {
            const cpuUsage = this.getCPUUsage();
            const memoryUsage = this.getMemoryUsage();

            this.cpuUsageGauge.set(cpuUsage);
            this.memoryUsageGauge.set(memoryUsage);
        }, 5000);
    }

    private getCPUUsage(): number {
        const cpus = os.cpus();
        let user = 0;
        let nice = 0;
        let sys = 0;
        let idle = 0;
        let irq = 0;
        let total = 0;
    
        for (const cpu of cpus) {
          user += cpu.times.user;
          nice += cpu.times.nice;
          sys += cpu.times.sys;
          idle += cpu.times.idle;
          irq += cpu.times.irq;
        }
    
        total = user + nice + sys + idle + irq;
    
        return ((total - idle) / total) * 100;
      }

      private getMemoryUsage(): number {
        return os.totalmem() - os.freemem();
      }

      async getMetrics(): Promise<string> {
        return await client.register.metrics();
      }

      incrementHttpRequestCounter(method: string, path: string, status: string) {
        this.httpRequestCounter.inc({ method, path, status });
      }
    
      private async sendMetricsToCollector() {
        setInterval(async () => {
          const metrics = await this.getMetrics();
          try {
            await axios.post('http://localhost:8080/metrics', metrics, {
              headers: {
                'Content-Type': 'text/plain',
              },
            });
            console.log('Metrics sent to collector');
          } catch (error) {
            console.error('Error sending metrics:', error);
          }
        }, 60000); // Send metrics every 60 seconds
      }
}