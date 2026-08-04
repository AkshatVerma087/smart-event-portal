# Innovation Challenge Report
**Project:** Smart Event Management Portal DevOps Pipeline

To fulfill the requirements of the Innovation Challenge (20 Marks), I have implemented three advanced DevOps and Cloud-Native features beyond the core requirements of Docker, Kubernetes, and Jenkins.

---

## 1. Automated Pipeline Rollbacks (Self-Healing CI/CD)
**Why the feature was chosen:**
Deploying broken code is a common issue that causes downtime. By implementing an automated rollback mechanism in Jenkins, we ensure that the system instantly recovers if a bad deployment occurs, minimizing user impact.

**How it works:**
In our `Jenkinsfile`, there is a `post { failure { ... } }` block. If the deployment stage fails (e.g., Kubernetes rejects the rollout, or the pods crash), Jenkins immediately executes `kubectl rollout undo` on the affected deployments, instantly reverting the cluster to the last stable state.

**Benefits to the organization:**
- Drastically reduces mean time to recovery (MTTR) during outages.
- Provides developers with a safety net when pushing new features.
- Ensures the production environment is always in a working state.

**Challenges faced during implementation:**
- Configuring Jenkins to gracefully handle failure states without breaking the pipeline execution required custom error handling (`catchError` blocks).
- Ensuring the rollback command targeted the correct deployment revisions.

---

## 2. Automated Database Migrations via Kubernetes InitContainers
**Why the feature was chosen:**
In a microservices environment, deploying new code that relies on database schema changes can result in downtime or errors if the code starts before the database is ready.

**How it works:**
In the `backend-deployment.yaml`, I implemented an `initContainer`. When Kubernetes schedules a new Backend Pod, it first runs the `initContainer` which executes `npx prisma db push`. The main backend container *will not start* until this init container finishes successfully.

**Benefits to the organization:**
- Enables true **Zero-Downtime Deployments**.
- Removes the need for manual database administration during releases.
- Ensures the application code and the database schema are always in perfect sync before taking live user traffic.

**Challenges faced during implementation:**
- Managing credentials securely so the initContainer could access the database URL (solved by using Kubernetes Secrets).
- Ensuring idempotency, meaning the migration script is safe to run multiple times concurrently if multiple pods are scaling up simultaneously.

---

## 3. Advanced Health Probes (Liveness & Readiness)
**Why the feature was chosen:**
By default, Kubernetes only checks if a container process is running. However, a Node.js or React application might be running but deadlocked or still establishing database connections, leading to dropped user requests.

**How it works:**
I implemented custom `livenessProbe` and `readinessProbe` blocks in both `frontend-deployment.yaml` and `backend-deployment.yaml`. 
- The **Liveness Probe** continuously checks the `/api/events` endpoint. If it fails repeatedly, Kubernetes automatically kills and restarts the Pod.
- The **Readiness Probe** prevents Kubernetes from sending traffic from the Service to the Pod until it returns a successful HTTP 200 OK.

**Benefits to the organization:**
- Protects users from encountering errors during scaling and rolling updates.
- Self-healing infrastructure: if the application hangs due to a memory leak, Kubernetes fixes it without human intervention.
- Allows the application to gracefully handle initialization spikes during high traffic.

**Challenges faced during implementation:**
- Tuning the `initialDelaySeconds` and `periodSeconds`. If set too aggressively, Kubernetes would kill the application before it even had a chance to start up. If set too loosely, users would experience delays.
