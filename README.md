<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Kafka-231F20?style=flat-square&logo=apache-kafka&logoColor=white" />
  <img src="https://img.shields.io/badge/Sigma_Rules-0095D5?style=flat-square&logo=sigma&logoColor=white" />
  <img src="https://img.shields.io/badge/MITRE_ATT%26CK-EE2334?style=flat-square&logo=mitre&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

<h1 align="center">CruXDR</h1>
<p align="center">
  <strong>Extended Detection & Response Platform</strong><br />
  <em>Real-time threat detection · Sigma rule engine · MITRE ATT&CK mapping · UEBA analytics · SOAR automation</em>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Service Map](#service-map)
- [Technology Stack](#technology-stack)
- [Demo Walkthrough](#demo-walkthrough)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Detection Coverage](#detection-coverage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CruXDR is a comprehensive, event-driven **Extended Detection and Response (XDR)** platform built from the ground up to simulate a real-world Security Operations Center (SOC) workflow. It ingests security telemetry, evaluates Sigma rules in real-time, maps every detection to the MITRE ATT&CK framework, performs behavioral analytics via a UEBA engine, and enables automated response actions through a SOAR pipeline — all unified in a single, interactive web dashboard.

Whether you are a detection engineer validating Sigma rules, a SOC analyst investigating incidents, or a security architect studying event-driven defense systems, CruXDR provides a complete, production-architecture playground.

---

## Key Features

### Detection Engineering
- **Sigma Rule Engine** — Dynamic, runtime-loaded Sigma YAML rules evaluated against every incoming event in real time
- **Live Rule Upload** — Upload new rules on the fly through the UI — no service restarts, no code changes
- **Per-Rule Aggregation** — Alerts are deduplicated and aggregated by rule title with event counts
- **Custom Matching** — Supports substring, wildcard, regex, `startswith`, `endswith`, and `contains` modifiers
- **MITRE ATT&CK Tagging** — Automatically extracts technique IDs from rule tags and maps them to the MITRE framework

### Security Analytics
- **MITRE ATT&CK Heatmap** — Real-time coverage visualization showing which techniques are being detected
- **Threat Trend Analysis** — Time-series charts of alert activity across techniques and severity levels
- **Attack Graph** — Entity-relationship graph showing source IPs, victims, techniques, and attack paths
- **Alert Correlation** — Multi-event correlation that groups related alerts into incidents

### User & Entity Behavior Analytics (UEBA)
- **Risk Scoring** — Per-user risk scores with time-decayed severity weighting (critical = 100, high = 60, medium = 30, low = 5)
- **Anomaly Detection** — Five anomaly types: Impossible Travel, Data Transfer Spike, Failed Login Burst, Off-Hours Access, Privilege Escalation Chain
- **IP Geolocation** — Deterministic IP-to-country mapping for geo-anomaly detection
- **Risk Monitoring Dashboard** — Real-time view of top risky users and active anomalies

### SOAR Automation
- **IP Blocking** — Simulated perimeter block for malicious source IPs
- **Host Isolation** — Simulated network isolation of compromised hosts
- **User Disable** — Simulated account disable for compromised users
- **Response History** — Audit trail of all automated response actions

### AI SOC Assistant
- **Live Alert Analysis** — Sends security events to DeepSeek (via opencode.ai Zen API) for contextual analysis
- **Threat Summaries** — Natural-language summaries of ongoing incidents
- **Response Recommendations** — AI-generated suggestions for containment and remediation
- **Context-Aware** — Analysis includes MITRE technique, severity, host, and user context
- **Powered by DeepSeek v4** — Zero local GPU required; queries are processed remotely via the Zen API gateway

### Attack Simulation
- **Pre-built Attack Scenarios** — 20+ sample log files covering credential access, execution, persistence, privilege escalation, lateral movement, exfiltration, defense evasion, and more
- **Simulation Service** — REST and WebSocket endpoints for launching synthetic attacks in real time
- **Live Event Streaming** — Simulated attacks stream events directly to the dashboard via WebSocket

### Visualization
- **Live Security Dashboard** — KPI cards (critical/high alerts), event counters, upload telemetry, and live alert feed
- **Sigma Studio** — Rule browser, rule upload, and triggered alerts view with classification
- **UEBA Dashboard** — User risk scores, active anomalies, and behavioral timelines
- **Incident Response** — Correlated incidents with timeline, IOC extraction, and SOAR integration
- **Attack Graph** — Interactive React Flow graph of attack paths with severity and MITRE annotations
- **SOC Command Center** — Centralized view of platform health, event throughput, and active threats
- **Threat Hunting** — Proactive search interface for IOC-based queries

---

## Architecture

### High-Level Data Flow

```
                          ┌─────────────────────────────────────┐
                          │         Attack Simulation           │
                          │  (simulation-service :8010)         │
                          │  REST API · WebSocket /ws/events    │
                          └───────────────┬─────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          KAFKA EVENT BUS                               │
│         Topics: cruxdr-logs · alerts · incidents · responses           │
└────┬────────────────────┬──────────────────────┬──────────────────┬────┘
     │                    │                      │                  │
     ▼                    ▼                      ▼                  ▼
┌──────────┐       ┌──────────┐         ┌─────────────┐     ┌──────────┐
│  Sigma   │       │Detection │         │    UEBA     │     │ Threat   │
│  Service │       │ Service  │         │   Service   │     │  Intel   │
│  :8050   │       │          │         │   :8060     │     │          │
└────┬─────┘       └────┬─────┘         └──────┬──────┘     └────┬─────┘
     │                  │                      │                 │
     └──────────────────┴──────────────────────┴─────────────────┘
                                    │
                                    ▼
                       ┌────────────────────┐
                       │    Correlation     │
                       │     Service        │
                       │      :8030         │
                       │ (incidents + graph)│
                       └─────────┬──────────┘
                                 │
                                 ▼
            ┌──────────────────────────────────┐
            │        SOAR Service :8061        │
            │  (block IP · isolate host ·      │
            │   disable user)                  │
            └──────────────────────────────────┘
                                 ▲
                                 │
                       ┌────────┴────────┐
                       │  Log Ingestion  │
                       │     :8080       │
                       │ (file upload +  │
                       │  built-in       │
                       │  detection)     │
                       └────────┬────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     API Gateway       │
                    │       :8000           │
                    └───────────┬───────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │       CRUXDR FRONTEND           │
              │     Next.js 16 · :3000          │
              │                                  │
              │  ┌─────┐ ┌──────┐ ┌──────────┐  │
              │  │Live │ │Sigma│ │  MITRE   │  │
              │  │Alerts│ │Studio│ │ Heatmap  │  │
              │  └─────┘ └──────┘ └──────────┘  │
              │  ┌─────┐ ┌──────┐ ┌──────────┐  │
              │  │UEBA │ │Attack│ │   SOAR   │  │
              │  │Dash │ │Graph │ │  Actions │  │
              │  └─────┘ └──────┘ └──────────┘  │
              └─────────────────────────────────┘
```

### Pipeline End-to-End

```
Log Source → Kafka (cruxdr-logs) → Sigma Matcher (per-event YAML eval)
                                        ↓
                                 Alert produced?
                                        ↓
                              Kafka (alerts) → Correlation Engine
                                        ↓
                                  Incident created?
                                        ↓
                          Graph Builder · SOAR forward · Frontend display
```

---

## Service Map

| Service | Port | Container Name | Role |
|---------|------|----------------|------|
| **Sigma Service** | `8050` | `cruxdr-sigma-service` | Core Sigma rule engine. Loads YAML rules, matches against events via Kafka consumer + REST `/detect` endpoint, aggregates alerts by rule, publishes to `alerts` topic |
| **Log Ingestion Service** | `8080` | `cruxdr-log-ingestion-service` | Parses uploaded log files, runs built-in pattern detection, forwards events to Kafka + OpenSearch + UEBA, calls sigma `/detect` for batch analysis |
| **Correlation Service** | `8030` | `cruxdr-correlation-service` | Consumes `alerts` topic, creates incidents, builds entity-relationship attack graphs, forwards to SOAR service |
| **Detection Service** | — | `crux-detection-service` | Legacy Kafka consumer for sigma-rule visibility and brute-force attack chain tracking |
| **UEBA Service** | `8060` | `cruxdr-ueba-service` | User & Entity Behavior Analytics. Consumes events, calculates risk scores, detects anomalies (impossible travel, data spikes, etc.) |
| **SOAR Service** | `8061` | `crux-soar-service` | Security Orchestration, Automation, and Response. Receives incidents, manages block/isolate/disable actions |
| **Simulation Service** | `8010` | `cruxdr-simulation-service` | Attack simulation engine. REST endpoints + WebSocket streams for synthetic attack generation |
| **AI Service** | `8001` | `crux-ai-service` | AI-powered SOC analysis via DeepSeek (Zen API). Processes chat queries and automated threat summaries |
| **Control Service** | `8070` | `cruxdr-control-service` | Platform control plane and alert management API |
| **Hunting Service** | `8040` | `cruxdr-hunting-service` | Threat hunting gateway for proactive IOC-based queries |
| **Search Service** | `8020` | `cruxdr-search-service` | Event and log search API across OpenSearch |
| **Threat Intel Service** | — | `crux-threat-intel-service` | Kafka consumer that enriches incidents with threat intelligence context |
| **API Gateway** | `8000` | `crux-api-gateway` | Central API gateway for external integrations |

### Infrastructure Services

| Service | Port | Purpose |
|---------|------|---------|
| **Kafka** | `9092` | Event streaming backbone — all telemetry, alerts, and incidents flow through Kafka topics |
| **Zookeeper** | `2181` | Kafka coordination |
| **PostgreSQL** | `5432` | Relational storage for platform state |
| **Redis** | `6379` | Caching, pub/sub |
| **OpenSearch** | `9200` | Log storage, indexing, and full-text search |
| **OpenSearch Dashboards** | `5601` | Log exploration UI |
| **MinIO** | `9000` | S3-compatible object storage |
| **Qdrant** | `6333` | Vector database for AI similarity search |

---

## Technology Stack

### Backend
- **Language**: Python 3.11
- **Framework**: FastAPI
- **Event Bus**: Apache Kafka (confluent-kafka)
- **Search Engine**: OpenSearch 2.12
- **Databases**: PostgreSQL 16, Redis 7, Qdrant
- **Object Storage**: MinIO
- **AI**: DeepSeek v4 via opencode.ai Zen API (no local GPU required)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4, class-variance-authority
- **Animation**: Framer Motion 12
- **State Management**: Zustand 5
- **Charts**: ECharts 6, Recharts, D3.js 7
- **Graph Visualization**: React Flow 11
- **Data Fetching**: TanStack React Query 5, Axios
- **WebSocket**: Socket.IO Client

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Security Frameworks**: Sigma, MITRE ATT&CK

---

## Demo Walkthrough

This walkthrough takes you from a freshly cloned repository to a fully functional XDR platform with custom rules, ingested telemetry, and correlated incidents.

### Phase 1 — Platform Startup

```bash
# 1. Clone the repository
git clone https://github.com/kr3xxz/cruxdr.git
cd cruxdr

# 2. Configure environment variables
cp .env .env.backup
# Edit .env if needed (defaults work for local development)

# 3. Start all backend infrastructure and services
docker compose up -d --build

# 4. Wait for services to initialize (60-90 seconds)
docker compose logs -f  # Ctrl+C to stop watching

# 5. Install and start the frontend
cd frontend
npm install
npm run dev
```

Access the dashboard at **http://localhost:3000**

### Phase 2 — Upload a Sigma Rule

CruXDR's Sigma engine evaluates rules dynamically — no code changes or service restarts needed.

1. Navigate to the **Settings** tab (gear icon in sidebar)
2. Under **Sigma Rule Upload**, click to select a file
3. Choose a rule from `samples/sigma-rules/` — for example `22-local-admin-creation.yaml`
4. Click **Upload** — the page reloads and the rule is now live
5. Switch to the **Detection Center** tab → **Sigma Studio** shows the loaded rule

**What happens behind the scenes:**
- The rule file is saved to the sigma-service's `app/rules/` directory
- The in-memory rule list is cleared and reloaded
- The `/rules` API reflects the new rule immediately

### Phase 3 — Ingest Security Telemetry

1. Go to the **Dashboard** tab
2. Click **Upload File** and select a log file from `samples/logs/`
3. After upload, the status message shows:
   - `"2 events triggered 1 rule(s)"` — sigma matched 2 events against your rule
   - Or `"0 sigma matches (rules loaded: 1, events: 9)"` — the log doesn't match your rule

**For the included sample files:**

| Log File | Matching Rule | Expected Result |
|----------|---------------|-----------------|
| `22-local-admin-creation.log` | `22-local-admin-creation.yaml` | **2 events / 1 rule** |
| `21-malicious-execution.log` | `21-malicious-execution.yaml` | **3 events / 1 rule** |
| `05-powershell-download.log` | `05-powershell-download.yaml` | **2 events / 1 rule** |

### Phase 4 — Investigate Detections

**Live Alerts** (Dashboard tab):
- Cards appear showing triggered rules with severity, MITRE technique, and event count badges
- Each card shows the host, user, and source IP involved

**MITRE ATT&CK Heatmap** (MITRE tab):
- The mapped technique (e.g., T1136.001) is highlighted on the heatmap
- Coverage shows which adversary techniques your rules can detect

**Incident Response** (Incidents tab):
- Each sigma alert generates a correlated incident
- Incidents include: title, severity, host, user, MITRE ID, detection timeline, and IOCs
- The attack graph visualizes entity relationships — source IPs, victims, and attack paths

**Sigma Studio** (Detection Center tab):
- All loaded rules are listed with descriptions and severity
- Triggered alerts are classified from the event store, with MITRE mappings

### Phase 5 — Run Attack Simulations

The simulation service can generate synthetic attacks in real time.

```bash
# Trigger a ransomware simulation
curl -X POST http://localhost:8010/simulate \
  -H "Content-Type: application/json" \
  -d '{"scenario": "ransomware"}'
```

Or use the simulation UI if available. Events stream to the dashboard via WebSocket and are evaluated by the sigma engine in real time.

### Phase 6 — Automated Response (SOAR)

When incidents are created, the SOAR service provides automated response actions:

1. **Block IP** — Simulates adding a source IP to a blocklist
2. **Isolate Host** — Simulates network isolation of a compromised machine
3. **Disable User** — Simulates disabling a compromised user account

These actions appear in the incident details and are logged in the SOAR response history.

---

## Screenshots

*Add screenshots or animated GIFs to the `screenshots/` directory and reference them here.*

### Dashboard Overview

```
## Dashboard Overview

![Dashboard Overview](screenshots/Dashboard%20Overview.png)
```

### Sigma Studio

```
[Screenshot: Sigma Studio showing loaded rules and triggered alerts]
```

### MITRE ATT&CK Heatmap

```
[Screenshot: MITRE ATT&CK matrix with active techniques highlighted]
```

### Attack Graph

```
[Screenshot: Interactive attack graph with source IPs, victims, and MITRE annotations]
```

### Incident Response

```
[Screenshot: Correlated incidents with timeline, IOCs, and SOAR actions]
```

### UEBA Dashboard

```
[Screenshot: UEBA risk scores, anomaly list, and risk distribution chart]
```

### SOAR Actions

```
[Screenshot: SOAR response panel with block/isolation/disable actions]
```

### AI SOC Assistant

```
[Screenshot: AI analysis panel with threat summary and recommendations]
```

---

## Prerequisites

- **Docker** 24+ and **Docker Compose** v2
- **Node.js** 20+ and **npm** 10+
- **Python** 3.11+ (for local development only — Docker images bundle Python)
- **Git**
- 8 GB+ RAM recommended (16 GB for all services + AI)

### Optional
- **Zen API Key** — Required for AI SOC Assistant features (get one at https://opencode.ai)
- **OpenSearch Dashboards** at http://localhost:5601 for direct log exploration

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/kr3xxz/cruxdr.git
cd cruxdr

# 2. Configure environment
cp .env .env.backup
# Edit .env to add your Zen API key (required for AI SOC Assistant):
#   ZEN_API_KEY=sk-your-key-here
# Get a free key at https://opencode.ai

# 3. Launch backend
docker compose up -d --build

# 4. Wait for all services to become healthy
docker compose ps  # All services should show "Up"

# 5. Launch frontend
cd frontend
npm install
npm run dev

# 6. Open browser
open http://localhost:3000
```

---

## Configuration

### Backend Environment (`.env`)

Copy `.env` from the repository root. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `cruxdr` | PostgreSQL database name |
| `POSTGRES_USER` | `crux` | PostgreSQL user |
| `POSTGRES_PASSWORD` | `ChangeMe!` | PostgreSQL password (change for production) |
| `KAFKA_PORT` | `9092` | Kafka broker port |
| `OPENSEARCH_PORT` | `9200` | OpenSearch REST port |
| `JWT_SECRET` | `change-me...` | JWT signing secret (change for production) |
| `ZEN_API_KEY` | — | **Required for AI SOC Assistant.** Get a free API key from https://opencode.ai |
| `ZEN_MODEL` | `deepseek-v4-flash-free` | Zen model ID to use for AI queries |

### Frontend Environment (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_CONTROL_API` | `http://localhost:8070` | Control service API URL |
| `NEXT_PUBLIC_SIGMA_API` | `http://localhost:8050` | Sigma service API URL |
| `NEXT_PUBLIC_UEBA_API` | `http://localhost:8060` | UEBA service API URL |
| `NEXT_PUBLIC_CORRELATION_API` | `http://localhost:8030` | Correlation service API URL |
| `NEXT_PUBLIC_SIMULATION_WS` | `ws://localhost:8010/ws/events` | Simulation WebSocket URL |

---

## Usage Guide

### Uploading Custom Sigma Rules

1. Write a standard Sigma YAML rule (see `samples/sigma-rules/` for examples)
2. Go to **Settings** → **Sigma Rule Upload**
3. Upload the `.yaml` file
4. The rule is immediately active — no restart needed
5. Upload matching log telemetry to trigger the rule

**Rule field requirements:**
- `title` — Display name for the rule
- `detection` — Block containing `selection` keys and `condition`
- `level` — Severity (low, medium, high, critical)
- `tags` — MITRE ATT&CK tags (e.g., `attack.t1136.001`) for automatic technique mapping

### Rule Matching Features

| Modifier | Example | Behavior |
|----------|---------|----------|
| Plain string | `process.name: "cmd.exe"` | Case-insensitive substring match |
| `contains\|` | `process.path: "contains\|Downloads\|Temp"` | Any of the parts present |
| `startswith\|` | `process.name: "startswith\|powershell"` | Value starts with prefix |
| `endswith\|` | `process.name: "endswith\|.exe"` | Value ends with suffix |
| `re:` | `command_line: "re:\d{1,3}\.\d{1,3}"` | Regex match |
| `*` wildcard | `process.path: "*Downloads*"` | Glob-style wildcard match |

### Available Sample Attacks

All sample log files are in `samples/logs/` and cover these MITRE techniques:

| File | Technique | Scenario |
|------|-----------|----------|
| `01-lsass-dump.log` | T1003.001 | LSASS memory dumping via procdump |
| `02-sam-registry.log` | T1003.002 | SAM registry hive access |
| `03-dcsync-attack.log` | T1003.006 | DCSync replication attack |
| `05-powershell-download.log` | T1059.001 | PowerShell encoded download cradle |
| `14-defender-disable.log` | T1562.001 | Windows Defender registry disable |
| `18-rdp-brute-force.log` | T1110.001 | RDP brute force authentication |
| `21-malicious-execution.log` | T1204.002 | Executables from user-writable directories |
| `22-local-admin-creation.log` | T1136.001 | Local admin account via net.exe |

---

## Detection Coverage

| Rule | MITRE ATT&CK | Tactics |
|------|--------------|---------|
| LSASS Memory Dumping | T1003.001 | Credential Access |
| SAM Registry Access | T1003.002 | Credential Access |
| DCSync Attack | T1003.006 | Credential Access |
| Kerberos Ticket Extraction | T1003.008 | Credential Access |
| Malicious PowerShell Download | T1059.001 | Execution |
| WMI Process Creation | T1047 | Execution |
| Scheduled Task Creation | T1053.005 | Persistence |
| Registry Run Key Modification | T1547.001 | Persistence |
| Windows Service Installation | T1543.003 | Persistence |
| Startup Folder Modification | T1547.001 | Persistence |
| UAC Bypass (Fodhelper) | T1548.002 | Privilege Escalation |
| Token Manipulation | T1134 | Privilege Escalation |
| DLL Search Order Hijacking | T1574.001 | Persistence, Privilege Escalation |
| Windows Defender Disable | T1562.001 | Defense Evasion |
| Process Hollowing | T1055.012 | Defense Evasion |
| Event Log Clearing | T1070.001 | Defense Evasion |
| PsExec Service Creation | T1021.002 | Lateral Movement |
| RDP Brute Force | T1110.001 | Credential Access |
| SMB Admin Share Access | T1021.002 | Lateral Movement |
| DNS Exfiltration | T1048 / T1572 | Exfiltration |
| **Local Admin Creation** | **T1136.001** | **Persistence** |
| **Malicious File Execution** | **T1204.002** | **Execution** |

---

## Project Structure

```
cruxdr/
├── backend/
│   ├── apps/
│   │   ├── sigma-service/           # Sigma rule engine
│   │   ├── log-ingestion-service/   # Log parser & ingestion
│   │   ├── correlation-service/     # Incident correlation & graph
│   │   ├── detection-service/       # Legacy detection consumer
│   │   ├── ueba-service/            # User & entity behavior analytics
│   │   ├── soar-service/            # SOAR automation
│   │   ├── simulation-service/      # Attack simulation
│   │   ├── ai-service/              # AI SOC assistant
│   │   ├── threat-intel-service/    # Threat intelligence enrichment
│   │   ├── control-service/         # Platform control plane
│   │   ├── hunting-service/         # Threat hunting gateway
│   │   ├── search-service/          # Search API
│   │   └── api-gateway/             # External API gateway
│   └── shared/                      # Shared data (seed data, configs)
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js pages (dashboard, log-analysis)
│   │   └── components/              # React component library
│   │       ├── ui/                  # Primitives (buttons, badges, cards)
│   │       ├── sigma/               # Sigma Studio, upload, rules
│   │       ├── incidents/           # Incident response, AI panel
│   │       ├── graph/               # Attack graph visualization
│   │       ├── ueba/                # UEBA dashboard
│   │       ├── soar/                # SOAR actions
│   │       ├── mitre/               # MITRE heatmap
│   │       ├── dashboard/           # KPI cards
│   │       ├── layout/              # Sidebar, header
│   │       └── ...
│   ├── store/                       # Zustand state management
│   └── hooks/                       # WebSocket hooks
├── samples/
│   ├── logs/                        # Sample log files (22 scenarios)
│   └── sigma-rules/                 # Sample sigma rules (22 rules)
├── docker-compose.yml               # Docker Compose orchestration
└── .env                             # Environment variables
```

---

## API Reference

### Sigma Service (`:8050`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload a Sigma YAML rule file |
| `GET` | `/rules` | List all loaded sigma rules |
| `DELETE` | `/rules` | Clear all loaded rules |
| `POST` | `/detect` | Run sigma matching against a batch of events |
| `GET` | `/alerts` | Get in-memory sigma alerts (polled by frontend) |
| `GET` | `/logs` | Get processed event logs |

### Log Ingestion Service (`:8080`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload a log file for parsing and detection |
| `GET` | `/logs` | Get parsed events |
| `DELETE` | `/logs` | Clear parsed events |
| `GET` | `/alerts` | Get built-in detection alerts |
| `GET` | `/search?q=` | Full-text search across ingested logs |

### Correlation Service (`:8030`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/incidents` | List correlated incidents |
| `DELETE` | `/incidents` | Clear all incidents |
| `GET` | `/graph` | Get attack graph data |

### UEBA Service (`:8060`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/risk-scores` | Get user risk scores |
| `GET` | `/anomalies` | Get active anomalies |
| `GET` | `/users` | List tracked users |
| `POST` | `/event` | Forward an event for UEBA processing |

### SOAR Service (`:8061`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/responses` | List SOAR response actions |
| `POST` | `/responses` | Trigger a response action |
| `DELETE` | `/responses` | Clear response history |

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Ensure the platform builds and runs: `docker compose up -d --build`
5. Submit a pull request

**Areas for contribution:**
- Additional Sigma rules (new MITRE techniques)
- New attack simulation scenarios
- Frontend visualization improvements
- Enhanced correlation logic
- Documentation and sample data
- Unit and integration tests

---

## License

This project is open source under the MIT License.

---

<p align="center">
  Built by <a href="https://github.com/kr3xxz">kr3xxz</a><br />
  <em>Detection Engineering · SIEM · XDR · SOC Operations</em>
</p>
