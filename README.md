# Smart Event Management Portal - DevOps Pipeline

This repository contains the complete source code and DevOps pipeline configurations for the Smart Event Management Portal. It demonstrates a modern, cloud-native application lifecycle spanning from local development to automated deployment.

## Architecture & Tech Stack

This project uses a multi-tier microservices architecture:

- **Frontend:** React / Vite application served by Nginx.
- **Backend:** Node.js Express REST API.
- **Database:** PostgreSQL accessed via Prisma ORM.

### DevOps Toolchain
- **Source Code Management:** Git & GitHub
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes (Deployment, Service, Scaling, Rolling Updates)
- **CI/CD Automation:** Jenkins (Declarative Pipeline)

---

## Directory Structure

```
smart-event-portal/
├── frontend/               # React frontend source code and Dockerfile
├── backend/                # Node.js backend source code and Dockerfile
├── k8s/                    # Kubernetes manifests (deployments, services)
├── docker-compose.yml      # Local development multi-container setup
├── Jenkinsfile             # Automated CI/CD pipeline definition
├── architecture-diagram.md # Mermaid architecture visualization
└── innovation-report.md    # Details on advanced DevSecOps features implemented
```

---

## Getting Started

### 1. Running Locally (Docker Compose)
To run the entire stack locally without installing Node.js or Postgres:

```bash
docker-compose up -d --build
```
- Frontend will be available at: `http://localhost:5173`
- Backend API will be available at: `http://localhost:5000`

### 2. Deploying to Kubernetes (Local / Minikube / Docker Desktop)
Ensure your Kubernetes cluster is running, then apply the manifests:

```bash
kubectl apply -f k8s/
```

Check the status of your pods:
```bash
kubectl get pods
```

### 3. CI/CD Automation (Jenkins)
The provided `Jenkinsfile` orchestrates the entire deployment process:
1. **Checkout:** Pulls the latest code.
2. **Build & Test:** Runs NPM install and tests.
3. **Containerize:** Builds Docker images for frontend and backend.
4. **Security Scan:** Analyzes images for vulnerabilities.
5. **Push:** Pushes versioned images to Docker Hub.
6. **Deploy:** Dynamically updates Kubernetes manifests and applies them.
7. **Verify & Rollback:** Automatically rolls back the deployment if health checks fail.

---

## Innovation Challenge Features

As part of the project requirements, several advanced cloud-native features were integrated:
1. **DevSecOps Integration:** Automated vulnerability scanning during the build process.
2. **Zero-Downtime DB Migrations:** Kubernetes `initContainers` handle database schema updates before backend pods start.
3. **Advanced Health Probes:** Custom Liveness and Readiness probes to ensure resilient autoscaling.

*See `innovation-report.md` for a full breakdown of these features.*
