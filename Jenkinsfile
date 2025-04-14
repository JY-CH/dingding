<<<<<<< HEAD
=======
// backend jenkinsfile
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
pipeline {
    agent any

    environment {
<<<<<<< HEAD
        IMAGE_NAME = "frontend-app"
        CONTAINER_NAME = "nginx"
        GIT_CREDENTIALS = credentials('dlawoduf15')  // GitLab Credentials
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')  // Docker Hub Credentials
=======
        COMPOSE_FILE_PATH = "/home/ubuntu/j12d105/docker-compose.yml"
        IMAGE_NAME = "backend-server"
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
        DOCKER_HUB_ID = "jaeyeolyim"  // Docker Hub 아이디
        MATTERMOST_WEBHOOK_URL = 'https://meeting.ssafy.com/hooks/9xbbpnkbqfyo3nzxjrkaib8xbc'  // Mattermost Incoming Webhook URL
        MATTERMOST_CHANNEL = 'd105-jenkins-alarm'  // Mattermost 채널
    }

    stages {
        stage('Checkout') {
            steps {
<<<<<<< HEAD
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
                        docker build --build-arg VITE_BASE_URL=\$VITE_BASE_URL --build-arg VITE_BACKEND_URL=\$VITE_BACKEND_URL -t ${IMAGE_NAME} .
                        """
                    }

                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000 
                    echo "🚀 프론트 빌드 완료: ${duration}초 소요"
=======
                git branch: 'backend', url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D105.git', credentialsId: 'dlawoduf15'
            }
        }

        stage('Build JAR') {
            steps {
                script {
                    sh '''
                    chmod +x backend/gradlew
                    cd backend
                    ./gradlew clean build --exclude-task test
                    '''
                }
            }
        }
        stage('Copy application.yml') {
            steps {
                script {
                    sh '''
                    cp backend/src/main/resources/application.yml backend/build/libs/
                    '''
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🚀 Docker 이미지 빌드 시작!"
                    sh "docker build -t ${DOCKER_HUB_ID}/${IMAGE_NAME}:latest -f Dockerfile ."
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
<<<<<<< HEAD
                    echo "📦 Docker Hub 로그인 및 이미지 푸시"
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    docker tag frontend-app ${DOCKER_HUB_ID}/frontend-app:latest
                    docker push ${DOCKER_HUB_ID}/frontend-app:latest

=======
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push ${DOCKER_HUB_ID}/${IMAGE_NAME}:latest
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
                    docker logout
                    '''
                }
            }
        }

<<<<<<< HEAD
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
=======
        stage('Deploy (Backend-1, Backend-2, MySQL, Redis)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    withCredentials([
                        string(credentialsId: 'MySQL-Username', variable: 'MYSQL_USERNAME'),
                        string(credentialsId: 'MySQL-Password', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'REDIS_PASSWORD', variable: 'REDIS_PASSWORD'),
                        string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                        string(credentialsId: 'AWS_S3_ACCESS_KEY', variable: 'AWS_S3_ACCESS_KEY'),
                        string(credentialsId: 'AWS_S3_SECRET_KEY', variable: 'AWS_S3_SECRET_KEY'),
                    ]) {
                        script {
                            sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                            cd /home/ubuntu/j12d105

                            echo "🛑 기존 백엔드, MySQL, Redis 컨테이너 중단 & 삭제"
                            docker-compose down

                            echo "🚀 최신 백엔드 이미지 가져오기"
                            docker-compose pull backend-1 backend-2

                            echo "🚀 환경 변수 설정 후 컨테이너 실행"
                            export MYSQL_USERNAME="${MYSQL_USERNAME}"
                            export MYSQL_PASSWORD="${MYSQL_PASSWORD}"
                            export REDIS_PASSWORD="${REDIS_PASSWORD}"
                            export JWT_SECRET="${JWT_SECRET}"
                            export AWS_S3_ACCESS_KEY="${AWS_S3_ACCESS_KEY}" 
                            export AWS_S3_SECRET_KEY="${AWS_S3_SECRET_KEY}" 


                            echo "MYSQL_USERNAME=${MYSQL_USERNAME}" >> .env
                            echo "MYSQL_PASSWORD=${MYSQL_PASSWORD}" >> .env
                            echo "REDIS_PASSWORD=${REDIS_PASSWORD}" >> .env
                            echo "JWT_SECRET=${JWT_SECRET}" >> .env
                            echo "AWS_S3_ACCESS_KEY=${AWS_S3_ACCESS_KEY}" >> .env
                            echo "AWS_S3_SECRET_KEY=${AWS_S3_SECRET_KEY}" >> .env
                            

                            docker-compose down --remove-orphans
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            JWT_SECRET=${JWT_SECRET} \
                            AWS_S3_ACCESS_KEY=${AWS_S3_ACCESS_KEY} \
                            AWS_S3_SECRET_KEY=${AWS_S3_SECRET_KEY} \
                            docker-compose up -d --force-recreate

                            echo "✅ 배포 완료! 현재 컨테이너 상태:"
                            docker ps -a
                            exit 0
                            EOF
                            """
                        }
                    }
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
                }
            }
        }
    }
<<<<<<< HEAD

    post {
        success {
            echo '✅ Deployment Successful!'

=======
    post {
        success {
            echo "✅ Deployment Successful!"
            
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
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
<<<<<<< HEAD
            echo '❌ Deployment Failed.'
=======
            echo "❌ Deployment Failed."
>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
            
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
<<<<<<< HEAD
=======

>>>>>>> 27bf825d1561d80d61d11d8d43d59a7541df906f
