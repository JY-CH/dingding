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

        stage('Deploy (Blue-Green Deployment)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    withCredentials([
                        string(credentialsId: 'MySQL-Username', variable: 'MYSQL_USERNAME'),
                        string(credentialsId: 'MySQL-Password', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'REDIS_PASSWORD', variable: 'REDIS_PASSWORD')
                    ]) {
                        script {
                            sh '''
                            ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                            cd /home/ubuntu/j12d105

                            # 현재 실행 중인 백엔드 컨테이너 확인a
                            CURRENT_BACKEND_1=$(docker ps --format '{{.Names}}' | grep -E '^backend-[1-4]$' | head -n 1)
                            CURRENT_BACKEND_2=$(docker ps --format '{{.Names}}' | grep -E '^backend-[1-4]$' | head -n 2 | tail -n 1)

                            # 새로운 백엔드 컨테이너 결정
                            if [ -z "$CURRENT_BACKEND_1" ] || [ -z "$CURRENT_BACKEND_2" ]; then
                                NEW_BACKEND_1="backend-1"
                                NEW_BACKEND_2="backend-2"
                            elif [ "$CURRENT_BACKEND_1" == "backend-1" ] && [ "$CURRENT_BACKEND_2" == "backend-2" ]; then
                                NEW_BACKEND_1="backend-3"
                                NEW_BACKEND_2="backend-4"
                            elif [ "$CURRENT_BACKEND_1" == "backend-3" ] && [ "$CURRENT_BACKEND_2" == "backend-4" ]; then
                                NEW_BACKEND_1="backend-1"
                                NEW_BACKEND_2="backend-2"
                            else
                                NEW_BACKEND_1="backend-1"
                                NEW_BACKEND_2="backend-2"
                            fi

                            echo "🚀 새로운 컨테이너: $NEW_BACKEND_1, $NEW_BACKEND_2"

                            # 이미지 풀
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            docker-compose pull $NEW_BACKEND_1 $NEW_BACKEND_2

                            # 새 컨테이너 실행
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            docker-compose up -d --force-recreate $NEW_BACKEND_1 $NEW_BACKEND_2

                            # 10초 대기 후 상태 확인
                            sleep 10

                            # 컨테이너 상태 확인
                            docker ps
                            docker-compose ps

                            # Nginx 설정 업데이트
                            if [ -n "$CURRENT_BACKEND_1" ] && [ -n "$CURRENT_BACKEND_2" ]; then
                                sudo sed -i "s/$CURRENT_BACKEND_1/$NEW_BACKEND_1/g" /home/ubuntu/j12d105/nginx/nginx.conf
                                sudo sed -i "s/$CURRENT_BACKEND_2/$NEW_BACKEND_2/g" /home/ubuntu/j12d105/nginx/nginx.conf
                                sudo systemctl restart nginx
                                
                                # 이전 컨테이너 중지 및 삭제
                                docker stop "$CURRENT_BACKEND_1" "$CURRENT_BACKEND_2"
                                docker rm "$CURRENT_BACKEND_1" "$CURRENT_BACKEND_2"
                            fi

                            echo "✅ 배포 완료!"
                            exit 0
                            EOF
                            '''
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment Successful!"
            
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Name = Author_ID.substring(1)

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
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Name = Author_ID.substring(1)

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