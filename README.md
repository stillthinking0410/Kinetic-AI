# Kinetic AI

Kinetic AI is a real-time event analytics platform designed to process streaming events, detect anomalies, and generate AI-powered operational insights.

The project follows a microservice architecture and serves as a hands-on learning platform for distributed systems, event-driven architecture, Kafka, Spring Boot, C++, Python, observability, and DevOps.

---

## Architecture Overview

```text
React UI
    │
    ▼
API Gateway (Spring Boot)
    │
    ├─────────────────────────────┐
    │                             │
    ▼                             ▼

Event Service             AI Insights Service
(Spring Boot)             (Python FastAPI)

    │
    ▼

Kafka (events)

    │
    ▼

Detection Service
(C++)

    │
    ▼

Kafka (detections)

    │
    ▼

AI Insights Service

    │
    ▼

Kafka (insights)

    │
    ▼

API Gateway

    │
    ▼

React UI
```

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite

### Backend Services

- Spring Boot
- Java 21

### Detection Service

- C++20
- CMake

### AI Insights Service

- Python
- FastAPI

### Messaging

- Apache Kafka

### Databases (Future)

- PostgreSQL
- Redis

### Infrastructure

- Docker
- Docker Compose

### Observability (Future)

- OpenTelemetry
- Prometheus
- Grafana
- Jaeger

---

## Project Structure

```text
Kinetic-AI/
│
├── frontend/
│
├── services/
│   ├── api-gateway/
│   ├── event-service/
│   ├── detection-service/
│   └── ai-insights-service/
│
├── contracts/
│   ├── event.schema.json
│   ├── detection.schema.json
│   ├── insight.schema.json
│   ├── event-dlq.schema.json
│   ├── detection-dlq.schema.json
│   └── insight-dlq.schema.json
│
├── infrastructure/
│   ├── docker/
│   └── kafka/
│
├── docs/
│
└── README.md
```

---

## Kafka Topics

### Primary Topics

```text
events
detections
insights
```

---

## Consumer Groups

```text
detection-group
insights-group
```

---

## Event Flow

```text
Event Service
      │
      ▼
events
      │
      ▼
Detection Service
      │
      ▼
detections
      │
      ▼
AI Insights Service
      │
      ▼
insights
      │
      ▼
API Gateway
      │
      ▼
React UI
```

---

## Learning Objectives

This project is intended to provide practical experience with:

### Distributed Systems

- Microservices
- Event-Driven Architecture
- Service Communication Patterns
- Fault Tolerance

### Kafka

- Producers
- Consumers
- Consumer Groups
- Partitions
- Rebalancing
- Replication
- Dead Letter Queues
- Delivery Guarantees

### Backend Development

- Spring Boot
- REST APIs
- Kafka Integration
- Contract-First Design

### Systems Programming

- Modern C++20
- CMake
- High-Performance Event Processing

### AI & Analytics

- FastAPI
- Event Analytics
- AI Insights Generation

### DevOps

- Docker
- Docker Compose
- Monitoring
- Logging
- Distributed Tracing

---

## License

MIT License