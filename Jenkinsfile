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
                    withCredentials([usernamePassword(credentialsId: 'GitLab-dlawoduf15-AccessToken', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        def repo_url = REPO_URL.replace("https://", "https://${env.GIT_USER}:${env.GIT_TOKEN}@")

                        if (fileExists("${CLONE_DIR}/.git")) {
                            echo "✅ 기존 폴더 존재: ${CLONE_DIR}, pull 수행"
                            sh """
                            cd ${CLONE_DIR}
                            git remote set-url origin ${repo_url}
                            git fetch origin
                            git checkout ${BRANCH}
                            git pull origin ${BRANCH}
                            """
                        } else {
                            echo "🚀 폴더가 없으므로 git clone 수행"
                            sh "git clone --depth=1 -b ${BRANCH} ${repo_url} ${CLONE_DIR}"
                        }
                    }
                }
            }
        }

        stage('Setup Node & Install Dependencies') {
            steps {
                script {
                    sh "curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -"
                    sh "apt-get update && apt-get install -y nodejs"
                    sh "npm install -g pnpm@${PNPM_VERSION}"
                    sh "cd frontend && pnpm install"
                }
            }
        }

        stage('Build') {
            steps {
                sh 'cd frontend && pnpm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}"
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                    sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:80 ${IMAGE_NAME}:latest"
                }
            }
        }
    }
}
