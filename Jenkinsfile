pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
        CONTAINER_NAME = "nginx"
        GIT_CREDENTIALS = credentials('dlawoduf15')  // GitLab Credentials
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')  // Docker Hub Credentials
        DOCKER_HUB_ID = "jaeyeolyim"  // Docker Hub 아이디
        MATTERMOST_WEBHOOK_URL = 'https://meeting.ssafy.com/hooks/9xbbpnkbqfyo3nzxjrkaib8xbc'  // Mattermost Incoming Webhook URL
        MATTERMOST_CHANNEL = 'd105-jenkins-alarm'  // Mattermost 채널
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'frontend', url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git', credentialsId: 'dlawoduf15'
                
                script {  
                    echo "현재 체크아웃 브랜치 확인"
                    sh 'git branch'
                }
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

                    withCredentials([string(credentialsId: 'GitLab-SecretText-Accesstoken', variable: 'GIT_TOKEN'), 
                    string(credentialsId: 'VITE_BACKEND_URL', variable: 'VITE_BACKEND_URL'),
                    string(credentialsId: 'VITE_BASE_URL', variable: 'VITE_BASE_URL')]) {
                        sh """
                        echo "🔐 GitLab Access Token을 .env 파일에 저장"
                        echo "GIT_CREDENTIALS=\$GIT_TOKEN" > .env
                        echo "VITE_BASE_URL=\$VITE_BASE_URL" >> .env
                        echo "VITE_BACKEND_URL=\$VITE_BACKEND_URL" >> .env
                        export VITE_BASE_URL=\$VITE_BASE_URL
                        export VITE_BACKEND_URL=\$VITE_BACKEND_URL

                        echo "🚀 Docker Image 빌드 시작"
                        docker build --build-arg VITE_BASE_URL=\$VITE_BASE_URL -t ${IMAGE_NAME} . 
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

            // GitLab 커밋 기록에서 배포한 사람의 GitLab 아이디 추출
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Name = Author_ID.substring(1)

                // Mattermost 알림 전송 (빌드 성공 시)
                mattermostSend(
                    color: 'good',
                    message: "${env.JOB_NAME}의 Jenkins ${env.BUILD_NUMBER}번째 빌드가 성공했습니다! \n배포한 사람: ${Name} ㅋㅋ좀치노 \n브랜치: ${env.GIT_BRANCH} \n(<${env.BUILD_URL}|상세 보기>)",
                    endpoint: "${env.MATTERMOST_WEBHOOK_URL}",
                    channel: "${env.MATTERMOST_CHANNEL}"
                )
            }
        }
        failure {
            echo '❌ Deployment Failed.'
            
            script {
                // GitLab 커밋 기록에서 배포한 사람의 GitLab 아이디 추출
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Name = Author_ID.substring(1)

                // Mattermost 알림 전송 (빌드 실패 시)
                mattermostSend(
                    color: 'danger',
                    message: "${env.JOB_NAME}의 Jenkins ${env.BUILD_NUMBER}번째 빌드가 실패했습니다. \n배포한 사람: ${Name} 뭐함? \n${env.GIT_BRANCH}에서 오류가 발생했습니다. \n(<${env.BUILD_URL}|상세 보기>)",
                    endpoint: "${env.MATTERMOST_WEBHOOK_URL}",
                    channel: "${env.MATTERMOST_CHANNEL}"
                )
            }
        }
    }
}
