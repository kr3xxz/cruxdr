# CruXDR

## Overview

CruXDR is a modern Extended Detection and Response (XDR) platform built from scratch to simulate the workflow of a real Security Operations Center (SOC).

The platform ingests security telemetry, processes events through a Sigma-based detection engine, maps detections to the MITRE ATT&CK framework, performs behavioral analytics, and provides automated response capabilities through an interactive web dashboard.

CruXDR was designed to demonstrate detection engineering, threat detection, SIEM/XDR concepts, SOAR workflows, event-driven architectures, and security monitoring at scale.

---

## Key Features

### Detection Engineering

* Dynamic Sigma Rule Engine
* Runtime Sigma Rule Upload
* Custom Detection Rules
* Keyword-Based Matching Engine
* Alert Generation Pipeline
* Severity Classification

### Security Analytics

* MITRE ATT&CK Heatmap
* Technique Mapping
* Detection Statistics
* Threat Trend Analysis
* Alert Correlation

### UEBA (User & Entity Behavior Analytics)

* User Risk Scoring
* Behavioral Anomaly Detection
* Risk Monitoring Dashboard

### SOAR Automation

* IP Blocking
* Host Isolation Simulation
* User Disable Actions
* Automated Response Workflows

### AI SOC Assistant

* Live Alert Analysis
* Threat Summaries
* Context-Aware Recommendations
* Security Telemetry View

### Security Event Simulation

* Ransomware Activity
* Lateral Movement
* Phishing Attacks
* Data Exfiltration
* Brute Force Attempts
* Credential Access Simulation

### Visualization

* Live Security Dashboard
* MITRE ATT&CK Heatmap
* Sigma Studio
* UEBA Analytics
* Incident Intelligence
* Attack Graph Visualization

---

## Architecture

```text
                    ┌────────────────────┐
                    │ Attack Simulation  │
                    └─────────┬──────────┘
                              │
                              ▼

                    ┌────────────────────┐
                    │       Kafka        │
                    │ Event Streaming    │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼

     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │ Sigma       │  │ Detection   │  │ UEBA        │
     │ Engine      │  │ Service     │  │ Analytics   │
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
            └────────────────┼────────────────┘
                             ▼

                   ┌────────────────────┐
                   │ Alert Processing   │
                   └─────────┬──────────┘
                             │
                             ▼

                   ┌────────────────────┐
                   │ CruXDR Frontend    │
                   └────────────────────┘
```

---

## Technology Stack

### Backend

* Python
* FastAPI
* Apache Kafka
* Docker
* Sigma Rules

### Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Framer Motion
* Zustand

### Security Technologies

* Sigma
* MITRE ATT&CK
* SOAR Concepts
* UEBA Concepts
* Detection Engineering

---

## Current Detection Coverage

| Detection                     | MITRE ATT&CK |
| ----------------------------- | ------------ |
| Ransomware Activity           | T1486        |
| Lateral Movement              | T1021        |
| Brute Force                   | T1110        |
| Phishing                      | T1566        |
| Data Exfiltration             | T1041        |
| Credential Dumping (Mimikatz) | T1003        |

---

## Example Workflow

### 1. Upload a Sigma Rule

Upload a custom Sigma rule through Sigma Studio.

### 2. Generate an Attack

Launch a simulated attack:

* Ransomware
* Phishing
* Lateral Movement
* Exfiltration
* Brute Force

### 3. Detection

CruXDR automatically:

* Processes events through Kafka
* Evaluates Sigma rules
* Generates alerts
* Maps activity to MITRE ATT&CK

### 4. Investigation

Analysts can view:

* MITRE Heatmap
* UEBA Analytics
* AI Recommendations
* Attack Graphs

### 5. Response

Execute SOAR actions:

* Block IP
* Isolate Host
* Disable User

---

## Running the Project

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/CruXDR.git
cd CruXDR
```

### Start Services

```bash
docker compose up -d --build
```

### Access Dashboard

```text
Frontend: http://localhost:3000
Sigma Service: http://localhost:8050
UEBA Service: http://localhost:8060
Simulation Service: http://localhost:8010
```

---

## Screenshots

Add screenshots here:

* Dashboard Overview
* Sigma Studio
* MITRE ATT&CK Heatmap
* UEBA Analytics
* AI SOC Assistant
* Attack Graph
* SOAR Actions

---

## Project Goals

CruXDR was built to explore:

* Detection Engineering
* Security Monitoring
* Event-Driven Architectures
* SOC Operations
* Threat Detection
* Security Automation
* XDR Platform Design

---

## Future Improvements

* WebSocket-Based Real-Time Streaming
* Incident Management System
* Threat Hunting Workbench
* IOC Management
* Rule Versioning
* Multi-Tenant Support
* Advanced Correlation Engine
* Threat Intelligence Integration

---

## Author

Built as a cybersecurity engineering project focused on SIEM, XDR, Detection Engineering, and SOC Operations.

GitHub: https://github.com/kr3xxz
