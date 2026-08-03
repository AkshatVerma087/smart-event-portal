# Smart Event Portal - DevOps Pipeline

This repository contains the source code and complete DevOps infrastructure for the Smart Event Management Portal.

## Architecture
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Kubernetes, Jenkins CI/CD

## Prerequisites
- Docker & Docker Desktop (for building images)
- Minikube or an active Kubernetes Cluster
- `kubectl` configured to your cluster
- Jenkins server with Git, Docker, and Kubernetes plugins installed

## Phase 1 & 2: Local Setup & Dockerization

### Running the App Locally (Without Docker)
1. Navigate to `/backend`, run `npm install`, add a `.env` file with `DATABASE_URL`, and run `npm run dev`.
2. Navigate to `/frontend`, run `npm install`, and run `npm run dev`.

### Building the Docker Images
```bash
# Build Backend
cd backend
docker build -t akshatverma087/eventportal-backend:v1 .

# Build Frontend
cd frontend
docker build -t akshatverma087/eventportal-frontend:v1 .
```

### Pushing to Docker Hub
```bash
docker login
docker push akshatverma087/eventportal-backend:v1
docker push akshatverma087/eventportal-frontend:v1
```

## Phase 3: Kubernetes Deployment

To deploy this architecture to Kubernetes, ensure your cluster is running and apply the YAML manifests in the `k8s/` directory.

### Create Database Secret
Because our backend uses an `initContainer` (Innovation Feature 2) for automated database migrations, you must first create a K8s secret containing your database URL:
```bash
kubectl create secret generic db-credentials --from-literal=database_url="postgresql://user:pass@host:5432/db"
```

### Apply Manifests
```bash
kubectl apply -f k8s/
```

### Verify Deployment, Scale, and Rollout
```bash
# Check Pods
kubectl get pods

# Check Services
kubectl get svc

# Scale the application
kubectl scale deployment eventportal-frontend --replicas=3

# Rollout new version
kubectl set image deployment/eventportal-backend eventportal-backend=akshatverma087/eventportal-backend:v2
kubectl rollout status deployment/eventportal-backend

# Rollback
kubectl rollout undo deployment/eventportal-backend
```

## Phase 4: Jenkins CI/CD

The included `Jenkinsfile` fully automates the CI/CD lifecycle.

### Setup Instructions
1. In Jenkins, install the **Git**, **Docker Pipeline**, and **Kubernetes** plugins.
2. Add your Docker Hub credentials in Jenkins (ID: `dockerhub-credentials`).
3. Create a new "Pipeline" job and point it to this GitHub repository.
4. Set up a Webhook in GitHub to trigger the Jenkins build on every `push`.

### Pipeline Stages
1. **Checkout**: Pulls the latest code.
2. **Build & Test**: Installs dependencies.
3. **Security Scan (Innovation 1)**: Runs Trivy to detect vulnerabilities.
4. **Build & Push Docker Images**: Containerizes the app with the latest Build Tag.
5. **Deploy to K8s**: Updates the YAML manifests with the new tag and applies them.
6. **Verify & Rollback**: Checks the K8s rollout status. If it fails, it automatically issues a `kubectl rollout undo` command.

## Innovation Challenge
Please refer to `innovation-report.md` for a detailed breakdown of the three innovative DevOps features implemented in this pipeline:
1. DevSecOps Image Scanning
2. Automated Database Migrations via InitContainers
3. Advanced Self-Healing Health Probes
