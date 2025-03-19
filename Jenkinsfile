pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/docker-compose.yml"
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
                    '''
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
                    sh "docker build -t ${IMAGE_NAME} -f Dockerfile ."
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
                    ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io << 'EOF'
                    
                    echo "🛑 기존 백엔드 컨테이너 삭제"
                    docker stop backend || true
                    docker rm backend || true

                    echo "🗑️ 불필요한 Docker 볼륨 정리"
                    docker volume prune -f || true

                    echo "📄 .env 파일 생성 (없으면 만들고, 있으면 유지)"
                    ENV_FILE="/home/ubuntu/j12d105/backend/backend-server.env"
                    if [ ! -f "$ENV_FILE" ]; then
                        echo "DB_HOST=db.example.com" > $ENV_FILE
                        echo "DB_PORT=3306" >> $ENV_FILE
                        echo "DB_USER=admin" >> $ENV_FILE
                        echo "DB_PASSWORD=secret" >> $ENV_FILE
                        echo "✅ .env 파일 생성 완료"
                    else
                        echo "✅ 기존 .env 파일 유지"
                    fi

                    echo "🚀 backend-server.env 내용 확인"
                    cat $ENV_FILE  # ✅ 환경 변수 확인

                    echo "🚀 백엔드 컨테이너 실행"
                    docker-compose up -d --build backend

                    echo "✅ 백엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a

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
