pipeline {
    agent any

    environment {
        NODE_VERSION = "22.12.0"
        PNPM_VERSION = "10.4.1"
        IMAGE_NAME = "react-app"
        CONTAINER_NAME = "react-container"
        REPO_URL = "https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git"
        BRANCH = "frontend"
        CLONE_DIR = "frontend"
        DOCKER_REGISTRY = "docker.io/myrepo" // Docker Hub or Private Registry
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'dlawoduf15')]) {
                        def repo_url = REPO_URL.replace("https://", "https://${GIT_ACCESS_TOKEN}@")

                        if (fileExists("${CLONE_DIR}/.git")) {
                            echo "✅ 기존 ${CLONE_DIR} 폴더 존재 - 최신 코드 가져오기"
                            sh """
                            cd ${CLONE_DIR}
                            git reset --hard
                            git pull ${repo_url} ${BRANCH}
                            """
                        } else {
                            echo "📂 폴더가 없으므로 git clone 실행"
                            sh """
                            git clone -b ${BRANCH} ${repo_url} ${CLONE_DIR}
                            """
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh """
                    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
                    apt-get install -y nodejs
                    npm install -g pnpm@${PNPM_VERSION}
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()

                    sh """
                    cd ${CLONE_DIR}
                    docker build -t ${IMAGE_NAME} .
                    """

                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000
                    echo "🚀 프론트 빌드 완료: ${duration}초 소요"
                }
            }
        }

        stage('Deploy (Nginx and SSL)') {
            steps {
                script {
                    sh """
                    cd ${CLONE_DIR}
                    pnpm install
                    pnpm run build
                    """
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh """
                    docker build -t ${IMAGE_NAME}:latest .
                    docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p 80:80 ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed.'
            sh "docker ps -a || true"
            sh "docker logs --tail=100 ${CONTAINER_NAME} || true"
        }
    }
}
