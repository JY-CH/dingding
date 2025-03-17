pipeline {
    agent any

    environment {
        NODE_VERSION = "22.12.0"
        PNPM_VERSION = "10.4.1"
        IMAGE_NAME = "react-app"
        CONTAINER_NAME = "react-container"
    }

    stages {
        stage('Checkout') {
            steps {
                // 기존 방식은 현재 디렉토리에 클론을 시도하는데, 이 방식은 문제가 될 수 있습니다.
                // checkout 명령어를 사용하면 Jenkins가 알아서 관리합니다.
                checkout scm
                
                // frontend 브랜치로 이동
                script {
                    sh "git checkout frontend || git checkout -b frontend origin/frontend"
                    sh "git pull origin frontend"
                }
            }
        }

        stage('Setup Node & Install Dependencies') {
            steps {
                script {
                    sh "curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - || true"
                    sh "apt-get update && apt-get install -y nodejs || true"
                    sh "npm install -g pnpm@${PNPM_VERSION} || npm install -g pnpm"
                    
                    // 프론트엔드 디렉토리로 이동 (필요한 경우)
                    sh "cd frontend && pnpm install || pnpm install"
                }
            }
        }

        stage('Build') {
            steps {
                // 프론트엔드 디렉토리에서 빌드
                sh 'cd frontend && pnpm run build || pnpm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                    sh "docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest || true"
                    sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest || true"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d --name ${CONTAINER_NAME} -p 80:80 ${IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed! Debugging Info:'
            sh "docker ps -a || true"
            sh "docker logs --tail=100 ${CONTAINER_NAME} || true"
            sh "netstat -tulnp || true"
            sh "ps aux || true"
        }
    }
}