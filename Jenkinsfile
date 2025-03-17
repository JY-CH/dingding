pipeline {
    agent any

    environment {
        NODE_VERSION = "22"
        PNPM_VERSION = "10.4.1"
        IMAGE_NAME = "react-app"
        CONTAINER_NAME = "react-container"
        REPO_URL = "https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git"
        BRANCH = "frontend"
        CLONE_DIR = "frontend"
        DOCKER_REGISTRY = "lab.ssafy.com/s12-ai-image-sub1"
        APP_PORT = "8080"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dlawoduf15', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                        export GIT_USER=\${GIT_USER}
                        export GIT_TOKEN=\${GIT_TOKEN}

                        if [ -d "${CLONE_DIR}/.git" ]; then
                            echo "✅ 기존 폴더 존재: ${CLONE_DIR}, pull 수행"
                            cd ${CLONE_DIR}
                            git remote set-url origin https://\${GIT_USER}:\${GIT_TOKEN}@lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git
                            git fetch origin
                            git checkout ${BRANCH}
                            git pull origin ${BRANCH}
                        else
                            echo "🚀 폴더가 없으므로 git clone 수행"
                            git clone --depth=1 -b ${BRANCH} https://\${GIT_USER}:\${GIT_TOKEN}@lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git ${CLONE_DIR}
                        fi
                        """
                    }
                }
            }
        }

        stage('Setup Node & Install Dependencies') {
            steps {
                script {
                    sh """
                    sudo apt-get update && sudo apt-get install -y nodejs
                    sudo npm install -g pnpm@${PNPM_VERSION}
                    cd ${CLONE_DIR} && pnpm install
                    """
                }
            }
        }

        stage('Build') {
            steps {
                sh "cd ${CLONE_DIR} && pnpm run build"
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}
                    docker build -t ${IMAGE_NAME}:latest .
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
                    docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:80 ${IMAGE_NAME}:latest
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
            echo '❌ Deployment Failed! Debugging Info:'
            sh "docker ps -a || true"
            sh "docker logs --tail=100 ${CONTAINER_NAME} || true"
            sh "netstat -tulnp || true"
            sh "ps aux || true"
        }
    }
}
