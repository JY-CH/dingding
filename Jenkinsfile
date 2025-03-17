pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"  // Docker 이미지 이름
        CONTAINER_NAME = "frontend"  // 컨테이너 이름
    }

    stages {
        stage('Checkout') {
            steps {
                // 리액트 프로젝트의 브랜치를 체크아웃합니다
                git branch: 'frontend', url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git', credentialsId: 'dlawoduf15'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지를 빌드합니다.
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

        stage('Deploy (Nginx and SSL)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io << 'EOF'

                    # EC2에서 작업할 경로로 이동
                    cd /home/ubuntu

                    # 기존 nginx, ssl 컨테이너 중단 및 삭제
                    echo "🛑 기존 nginx 및 ssl 컨테이너 중단 & 삭제"
                    docker-compose stop nginx ssl || true
                    docker-compose rm -f nginx ssl || true

                    # 불필요한 Docker 이미지 및 볼륨 삭제
                    echo "🗑️ 불필요한 Docker 이미지 및 볼륨 삭제"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    # nginx 및 ssl 컨테이너 다시 실행
                    echo "🚀 nginx + ssl 컨테이너 다시 실행"
                    docker-compose up -d --build nginx ssl

                    echo "✅ nginx + ssl + 프론트엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a

                    EOF
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
