package com.kineticai.api_gateway.service;

import org.springframework.stereotype.Service;

@Service
public class HealthService {
    
    public String getStatus() {
        return "API Gateway Running";
    }
}
