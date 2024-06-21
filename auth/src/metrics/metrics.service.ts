import {Injectable} from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
    private readonly httpRequestDurationMicroseconds: client.Histogram<string>;

    constructor(){
        
    }
}