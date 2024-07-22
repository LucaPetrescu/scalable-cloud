package com.scalablecloud.metricscollector;

import org.springframework.web.bind.annotation.RestController;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tag;
import io.micrometer.core.instrument.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MetricsCollector {
    
    @Autowired
    private MeterRegistry meterRegistry{

    }

    @PostMapping("/metrics")
    public void receiveMetrics(@RequestBody Map<String, Double> metrics) {
        metrics.forEach((key, value) -> {
            meterRegistry.gauge(key, value);
        });
    }
}
