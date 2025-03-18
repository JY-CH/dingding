pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"   // docker-compose.yml의 nginx.image와 동일하게
        CONTAINER_NAME = "nginx"
        GIT_CREDENTIALS = credentials('dlawoduf15')  // Jenkins Credentials ID
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'frontend', url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git', credentialsId: 'dlawoduf15'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()

                    sh """
                    docker build -t ${IMAGE_NAME} .
                    """

                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000 
                    echo "🚀 프론트 빌드 완료: ${duration}초 소요"
                }
            }
        }

        stage('Deploy (Nginx Only)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io << 'EOF'
                    
                    cd /home/ubuntu

                    echo "🛑 기존 nginx 컨테이너 중단 & 삭제"
                    docker-compose stop nginx || true
                    docker-compose rm -f nginx || true

                    echo "🗑️ 불필요한 Docker 이미지 및 볼륨 삭제"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    echo "🚀 nginx 컨테이너 다시 실행"
                    docker-compose up -d --build nginx

                    echo "✅ nginx + 프론트엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a
                    
                    '''
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
        }
    }
}
