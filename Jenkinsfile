pipeline {
    agent any

    environment {
        NODE_VERSION = "22.12.0"
        PNPM_VERSION = "10.4.1"
        IMAGE_NAME = "react-app"
        CONTAINER_NAME = "react-container"
        REPO_URL = "https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git"
        BRANCH = "frontend"
        CLONE_DIR = "workspace/frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if (fileExists("${CLONE_DIR}/.git")) {
                        echo "✅ 기존 폴더 존재: ${CLONE_DIR}, pull 수행"
                        sh """
                        cd ${CLONE_DIR}
                        git reset --hard
                        git pull origin ${BRANCH}
                        """
                    } else {
                        echo "🚀 폴더가 없으므로 git clone 수행"
                        sh """
                        git clone -b ${BRANCH} ${REPO_URL} ${CLONE_DIR}
                        """
                    }
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