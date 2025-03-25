pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/j12d105/docker-compose.yml"
        IMAGE_NAME = "backend-server"
        DOCKER_HUB_ID = "jaeyeolyim"  // Docker Hub 아이디
        MATTERMOST_WEBHOOK_URL = 'https://meeting.ssafy.com/hooks/9xbbpnkbqfyo3nzxjrkaib8xbc'  // Mattermost Incoming Webhook URL
        MATTERMOST_CHANNEL = 'd105-jenkins-alarm'  // Mattermost 채널
    }

    stages {
        stage('Checkout') {
            steps {
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

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🚀 Docker 이미지 빌드 시작!"
                    sh "docker build -t ${DOCKER_HUB_ID}/${IMAGE_NAME}:latest -f Dockerfile ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push ${DOCKER_HUB_ID}/${IMAGE_NAME}:latest
                    docker logout
                    '''
                }
            }
        }

        stage('Blue-Green Deployment') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    withCredentials([ 
                        string(credentialsId: 'MySQL-Username', variable: 'MYSQL_USERNAME'),
                        string(credentialsId: 'MySQL-Password', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'REDIS_PASSWORD', variable: 'REDIS_PASSWORD')
                    ]) {
                        script {
                            sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                            cd /home/ubuntu/j12d105

                            # 현재 실행 중인 백엔드 컨테이너 확인
                            CURRENT_BACKEND_1=\$(docker ps --format '{{.Names}}' | grep -E '^backend-[1-4]$' | head -n 1)
                            CURRENT_BACKEND_2=\$(docker ps --format '{{.Names}}' | grep -E '^backend-[1-4]$' | head -n 2 | tail -n 1)
                            echo "현재 실행 중인 컨테이너: \$CURRENT_BACKEND_1, \$CURRENT_BACKEND_2"
                            
                            # 새로운 백엔드 컨테이너 결정 (실행 중인 백엔드 컨테이너 상태에 따라)
                            if [ "\$CURRENT_BACKEND_1" == "backend-1" ] && [ "\$CURRENT_BACKEND_2" == "backend-2" ]; then
                                NEW_BACKEND_1="backend-3"
                                NEW_BACKEND_2="backend-4"
                            elif [ "\$CURRENT_BACKEND_1" == "backend-3" ] && [ "\$CURRENT_BACKEND_2" == "backend-4" ]; then
                                NEW_BACKEND_1="backend-1"
                                NEW_BACKEND_2="backend-2"
                            else
                                echo "현재 실행 중인 백엔드 컨테이너 상태가 예상과 다릅니다. 종료합니다."
                                exit 1
                            fi

                            echo "새롭게 배포할 컨테이너: \$NEW_BACKEND_1, \$NEW_BACKEND_2"

                            echo "🚀 최신 백엔드 이미지 가져오기"
                            docker-compose pull \$NEW_BACKEND_1 \$NEW_BACKEND_2

                            echo "🚀 새 컨테이너 실행"
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            docker-compose up -d --force-recreate \$NEW_BACKEND_1 \$NEW_BACKEND_2

                            echo "🛠️ 새 컨테이너 정상 작동 확인 중..."
                            sleep 10
                            HEALTHY_1=\$(docker inspect --format='{{.State.Health.Status}}' \$NEW_BACKEND_1)
                            HEALTHY_2=\$(docker inspect --format='{{.State.Health.Status}}' \$NEW_BACKEND_2)

                            if [ "\$HEALTHY_1" != "healthy" ] || [ "\$HEALTHY_2" != "healthy" ]; then
                                echo "❌ 새 컨테이너가 정상적으로 실행되지 않았습니다!"
                                exit 1
                            fi

                            echo "🔄 Nginx 트래픽을 새 컨테이너로 변경"
                            # nginx.conf 파일에서 backend-1, backend-2를 새로운 backend-3, backend-4로 변경
                            sudo sed -i "s/\$CURRENT_BACKEND_1/\$NEW_BACKEND_1/g" /home/ubuntu/j12d105/nginx/nginx.conf
                            sudo sed -i "s/\$CURRENT_BACKEND_2/\$NEW_BACKEND_2/g" /home/ubuntu/j12d105/nginx/nginx.conf
                            sudo systemctl restart nginx

                            echo "🗑️ 기존 컨테이너 종료 및 삭제"
                            # 기존 컨테이너 종료 후 삭제
                            docker stop \$CURRENT_BACKEND_1 && docker rm \$CURRENT_BACKEND_1
                            docker stop \$CURRENT_BACKEND_2 && docker rm \$CURRENT_BACKEND_2

                            echo "✅ 배포 완료! 현재 컨테이너 상태:"
                            docker ps -a
                            exit 0
                            EOF
                            """
                        }


                    }
                }
            }
        }

    }
    
    post {
        success {
            echo "✅ Deployment Successful!"
            
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
            echo "❌ Deployment Failed."
            
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
