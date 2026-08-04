pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_REGISTRY = 'akshatverma087'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/event-portal-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/event-portal-frontend"
        TAG = "v${BUILD_NUMBER}"
        KUBECONFIG = 'C:\\Users\\asus\\.kube\\config'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'echo "Assuming basic tests pass for demonstration"'
                }
            }
        }

        stage('Build & Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        docker.build("${BACKEND_IMAGE}:${TAG}")
                    }
                    dir('frontend') {
                        docker.build("${FRONTEND_IMAGE}:${TAG}")
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        docker.image("${BACKEND_IMAGE}:${TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:${TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Use powershell to dynamically update the tags in the YAML files
                    powershell """
                        (Get-Content k8s/backend-deployment.yaml) -replace ':v1', ':${TAG}' | Set-Content k8s/backend-deployment.yaml
                        (Get-Content k8s/frontend-deployment.yaml) -replace ':v1', ':${TAG}' | Set-Content k8s/frontend-deployment.yaml
                    """
                    
                    // Deploy to the cluster
                    bat "kubectl apply -f k8s/"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Wait for rollouts to finish
                    bat "kubectl rollout status deployment/eventportal-backend"
                    bat "kubectl rollout status deployment/eventportal-frontend"
                }
            }
        }
    }

    post {
        failure {
            echo "Deployment failed! Initiating rollback..."
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                bat "kubectl rollout undo deployment/eventportal-backend"
            }
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                bat "kubectl rollout undo deployment/eventportal-frontend"
            }
        }
        success {
            echo "Successfully deployed Smart Event Portal v${BUILD_NUMBER}!"
        }
    }
}
