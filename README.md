# CruXDR

CruXDR is a modern Extended Detection and Response (XDR) platform designed to simulate real-world SOC operations, threat detection, incident correlation, and SOAR automation workflows.

## Features

* Real-time attack simulation
* SOC Command Center
* MITRE ATT&CK heatmap
* UEBA analytics
* Threat hunting console
* Sigma rule detections
* SOAR response automation
* Live attack correlation graph
* Interactive security telemetry

## Attack Simulations

CruXDR can simulate:

* Ransomware
* Phishing
* Brute Force
* Lateral Movement
* Data Exfiltration

## SOAR Capabilities

* Block IP
* Isolate Host
* Disable User
* Threat containment simulation
* Persistent deny-list enforcement

## Tech Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS
* Framer Motion
* Zustand

### Backend

* FastAPI
* Python
* Docker
* Microservices Architecture

## Architecture

CruXDR follows a modular microservices architecture with dedicated services for:

* Detection
* Correlation
* UEBA
* Threat Hunting
* Sigma Processing
* Simulation
* SOAR Automation
* Threat Intelligence

## Installation

### Clone Repository

```bash
git clone https://github.com/kr3xxz/cruxdr.git
cd cruxdr
```

### Start Backend

```bash
docker compose up -d
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

## Project Goals

CruXDR was built to demonstrate:

* Modern SOC workflows
* Blue-team engineering
* Threat detection pipelines
* XDR/SOAR concepts
* Interactive cyber defense operations

## Author

GitHub: https://github.com/kr3xxz
