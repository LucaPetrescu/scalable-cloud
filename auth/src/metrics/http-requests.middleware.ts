import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
    constructor(private readonly metricsService: MetricsService){}

    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
          this.metricsService.incrementHttpRequestCounter(
            req.method,
            req.originalUrl,
            res.statusCode.toString(),
          );
        });
        next();
      }
}