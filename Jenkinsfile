pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/j12d105/docker-compose.yml"
        IMAGE_NAME = "backend-server"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🚀 코드 체크아웃 시작!"
                }
                git branch: 'backend', url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git', credentialsId: 'dlawoduf15'
                script {
                    echo "✅ 코드 체크아웃 완료!"
                }
            }
        }

        stage('Build JAR') {
            steps {
                script {
                    echo "🚀 백엔드 빌드 시작!"
                    def startTime = System.currentTimeMillis()
                    sh '''
                    chmod +x backend/gradlew
                    cd backend
                    ./gradlew clean build --exclude-task test
                    echo "🚀 빌드된 JAR 파일 확인"
                    ls -lh build/libs/
                    '''
                    sh "docker build -t backend-server -f Dockerfile ."
                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000
                    echo "✅ 백엔드 빌드 완료! (${duration}초 소요)"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🚀 Docker 이미지 빌드 시작!"
                    def startTime = System.currentTimeMillis()
                    sh "docker build -t ${IMAGE_NAME} -f Dockerfile ./backend"
                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000
                    echo "✅ Docker 이미지 빌드 완료! (${duration}초 소요)"
                }
            }
        }

        stage('Deploy (Backend Only)') {
            steps {
                script {
                    echo "🚀 백엔드 배포 시작!"
                }
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                    
                    echo "🛑 기존 백엔드 컨테이너 삭제"
                    docker stop backend || true
                    docker rm backend || true

                    echo "🗑️ 불필요한 Docker 볼륨 정리"
                    docker volume prune -f || true

                    echo "🚀 .env 파일이 필요하지 않으므로 생성하지 않음"
                    
                    echo "🚀 백엔드 컨테이너 실행 (DB 없이도 실행 가능)"
                    cd /home/ubuntu/j12d105
                    docker-compose up -d --build

                    echo "✅ 백엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a

                    exit 0
                EOF
                    '''
                }
                script {
                    echo "✅ 백엔드 배포 완료!"
                }
            }
        }
    }

    post {
        success {
            echo "🎉 전체 파이프라인 완료! ✅ Backend Deployment Successful!"
        }
        failure {
            echo "🔥 배포 실패! ❌ Backend Deployment Failed."
        }
    }
}
