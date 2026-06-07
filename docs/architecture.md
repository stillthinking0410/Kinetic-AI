# Kinetic AI - Architecture Document

## Project Vision

Kinetic AI is a real-time event analytics platform designed to process streaming events, detect abnormal behavior, generate alerts, and provide AI-powered operational insights.

The system follows a microservice architecture to enable independent deployment, scalability, fault isolation, and technology diversity.

The project is also intended as a learning platform for:

- Microservices
- Event-Driven Architecture
- Kafka
- Spring Boot
- C++
- Python
- Distributed Systems
- Observability
- DevOps

---

## High-Level Architecture

```text
                     +----------------------+
                     |      React UI        |
                     +----------+-----------+
                                ^
                                |
                         WebSocket / REST
                                |
                                v
                     +----------------------+
                     |     API Gateway      |
                     |    (Spring Boot)     |
                     +----------+-----------+
                                ^
                                |
                    +-----------+-----------+
                    |                       |
                    |                       |
                    v                       v

               Kafka(alerts)         Kafka(insights)
                    ^                       ^
                    |                       |
                    |                       |
         +----------+-----+       +---------+---------+
         | Detection      |       | AI Insights       |
         | Service (C++)  |       | Service (Python)  |
         +----------+-----+       +---------+---------+
                    ^                       ^
                    |                       |
                    +-----------+-----------+
                                |
                                v

                          Kafka(events)
                                ^
                                |
                                |
                     +----------+-----------+
                     |     Event Service    |
                     |    (Spring Boot)     |
                     +----------------------+
```

---

## Architectural Principles

### Service Ownership

Each service owns its business logic and deployment lifecycle.

### Event-Driven Communication

Services communicate primarily through Kafka events rather than direct service calls.

### Independent Scalability

Services can scale independently based on workload requirements.

### Loose Coupling

Services communicate through contracts and events, not shared code.

### Polyglot Architecture

Different services may use different programming languages when technically justified.

### Single Responsibility

Each service should represent a meaningful business capability rather than a technical implementation detail.

---

## Service Responsibilities

### API Gateway

#### Technology

- Spring Boot

#### Responsibilities

- Public API entry point
- Request routing
- API aggregation
- WebSocket endpoint
- Authentication (future)
- Authorization (future)
- Rate limiting (future)
- Real-time alert delivery
- Real-time insights delivery

#### Consumes

- alerts topic
- insights topic

---

### Event Service

#### Technology

- Spring Boot

#### Responsibilities

- Event ingestion
- Event validation
- Event simulation
- Event publishing

#### Produces

- events topic

---

### Detection Service

#### Technology

- C++20
- CMake

#### Responsibilities

- Consume events
- Detect anomalies
- Calculate statistics
- Evaluate thresholds
- Determine severity levels
- Generate alerts
- Publish alert events

#### Consumes

- events topic

#### Produces

- alerts topic

---

### AI Insights Service

#### Technology

- Python FastAPI

#### Responsibilities

- Consume events
- Consume alerts
- Maintain event context and historical patterns
- Perform detailed analysis when alerts occur
- Detect trends
- Generate recommendations
- Produce operational insights

#### Consumes

- events topic
- alerts topic

#### Produces

- insights topic

---

### React Dashboard

#### Technology

- React
- TypeScript

#### Responsibilities

- Display alerts
- Display insights
- Display system health
- Real-time dashboards
- Operational monitoring

---

## Communication Architecture

### Synchronous Communication

#### Protocol

- REST

#### Used For

- React UI → API Gateway
- Administrative operations
- Dashboard APIs

#### Future Consideration

- gRPC

---

### Asynchronous Communication

#### Platform

- Kafka

#### Topics

##### events

Produced By:

- Event Service

Consumed By:

- Detection Service
- AI Insights Service

Purpose:

- Raw event stream for real-time processing and analytics

---

##### alerts

Produced By:

- Detection Service

Consumed By:

- API Gateway
- AI Insights Service

Purpose:

- Alert notifications generated from anomaly detection

---

##### insights

Produced By:

- AI Insights Service

Consumed By:

- API Gateway

Purpose:

- AI-generated recommendations, trends, and operational insights

---

#### Benefits

- Loose coupling
- Reliability
- Scalability
- Event replay
- Fault tolerance

---

## Data Ownership

Each service owns its data.

Services must not directly access another service's database.

### Future Databases

#### Event Database

Owned By:

- Event Service

Stores:

- Event history
- Event metadata

---

#### Alert Database

Owned By:

- Detection Service

Stores:

- Generated alerts
- Alert severity
- Detection statistics

---

#### Insights Database

Owned By:

- AI Insights Service

Stores:

- Generated insights
- Trend analysis
- Recommendation history

---

## Contracts

Services communicate through shared message contracts.

Future contract definitions will be maintained under:

```text
contracts/
├── event.schema.json
├── alert.schema.json
└── insight.schema.json
```

No service should depend on another service's internal code.

---

## Observability Roadmap

### Logging

- Structured Logging
- Correlation IDs
- Centralized Log Aggregation

### Monitoring

- Metrics Collection
- Service Health Checks
- Kafka Monitoring

### Tracing

- Distributed Tracing

### Candidate Technologies

- OpenTelemetry
- Jaeger
- Prometheus
- Grafana

---

## Security Roadmap

### Authentication

- JWT Authentication

### Authorization

- Role-Based Access Control (RBAC)

### API Security

- Rate Limiting
- Request Validation
- Input Sanitization

### Service Security

- Service-to-Service Authentication

---

## Learning Objectives

### Architecture

- Microservices
- Event-Driven Architecture
- Distributed Systems
- Service Communication Patterns
- Domain-Driven Service Boundaries

### Backend Development

- Spring Boot
- REST APIs
- Kafka Producers
- Kafka Consumers
- API Gateway Patterns

### Systems Programming

- Modern C++20
- CMake
- High-Performance Processing
- Concurrent Event Processing

### AI & Data Processing

- Python
- FastAPI
- Event Analytics
- Operational Insights
- Trend Analysis

### Operations

- Docker
- Docker Compose
- Observability
- Monitoring
- Logging
- Distributed Tracing

### Software Engineering

- Contract-First Design
- Scalability
- Reliability
- Fault Tolerance
- Production-Oriented Architecture
- Event-Driven System Design

---

## Future Enhancements

### Reliability

- Circuit Breakers
- Retry Mechanisms
- Dead Letter Queues (DLQ)

### Security

- OAuth2 Integration
- Fine-Grained Authorization

### Observability

- Full Distributed Tracing
- Centralized Dashboards

### Scalability

- Multi-Broker Kafka Cluster
- Kubernetes Deployment
- Horizontal Service Scaling

### Intelligence

- Predictive Analytics
- Machine Learning Models
- Root Cause Analysis
- Adaptive Thresholding