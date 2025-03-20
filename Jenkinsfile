pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
        CONTAINER_NAME = "nginx"
        GIT_CREDENTIALS = credentials('dlawoduf15')  // GitLab Credentials
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')  // Docker Hub Credentials
        DOCKER_HUB_ID = "jaeyeolyim"  // Docker Hub 아이디
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'frontend', url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git', credentialsId: 'dlawoduf15'
            }
        }
        stage('Check Git') {
            steps {
                sh 'git --version || echo "⚠️ Git을 찾을 수 없습니다."'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()

                    withCredentials([string(credentialsId: 'GitLab-SecretText-Accesstoken', variable: 'GIT_TOKEN')]) {
                        sh """
                        echo "🔐 GitLab Access Token을 .env 파일에 저장"
                        echo "GIT_CREDENTIALS=\$GIT_TOKEN" > .env

                        echo "🚀 Docker Image 빌드 시작"
                        docker build -t ${IMAGE_NAME} .
                        """
                    }

                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000 
                    echo "🚀 프론트 빌드 완료: ${duration}초 소요"
                }
            }
        }


        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "📦 Docker Hub 로그인 및 이미지 푸시"
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    docker tag frontend-app ${DOCKER_HUB_ID}/frontend-app:latest
                    docker push ${DOCKER_HUB_ID}/frontend-app:latest

                    docker logout
                    '''
                }
            }
        }


        stage('Deploy (Nginx Only)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                        cd /home/ubuntu/j12d105

                        echo "🛑 기존 nginx 컨테이너 중단 & 삭제"
                        docker-compose stop nginx || true
                        docker-compose rm -f nginx || true

                        echo "🚀 최신 프론트엔드 이미지 가져오기"
                        docker pull ${DOCKER_HUB_ID}/frontend-app:latest

                        echo "🚀 nginx 컨테이너 다시 실행"
                        docker-compose up -d --build nginx

                        echo "✅ nginx + 프론트엔드 배포 완료! 현재 컨테이너 상태:"
                        docker ps -a

                        exit 0
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
