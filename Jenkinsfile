pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/docker-compose.yml"
        IMAGE_NAME = "backend-server"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'backend', url: 'https://lab.ssafy.com/your_project/backend.git', credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build JAR') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()
                    sh '''
                    chmod +x backend/gradlew
                    cd backend
                    ./gradlew clean build --exclude-task test
                    '''
                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000
                    echo "🚀 백엔드 빌드 완료: ${duration}초 소요"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()
                    sh "docker build -t ${IMAGE_NAME} -f Dockerfile ."
                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000
                    echo "🚀 Docker 이미지 빌드 완료: ${duration}초 소요"
                }
            }
        }

        stage('Deploy (Backend Only)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io << 'EOF'
                
                    cd /home/ubuntu

                    echo "🛑 기존 백엔드 컨테이너 삭제"
                    docker stop backend || true
                    docker rm backend || true

                    echo "🗑️ 불필요한 Docker 이미지 및 볼륨 삭제"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    echo "🚀 backend-server.env 내용 확인"
                    cat /home/ubuntu/backend-server.env  # ✅ 환경 변수 확인

                    echo "🚀 백엔드 컨테이너 실행"
                    docker-compose up -d --build backend

                    echo "✅ 백엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a

                    EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Backend Deployment Successful!'
        }
        failure {
            echo '❌ Backend Deployment Failed.'
        }
    }
}
