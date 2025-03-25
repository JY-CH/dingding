pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/j12d105/docker-compose.yml"
        IMAGE_NAME = "backend-server"
        DOCKER_HUB_ID = "jaeyeolyim"  // Docker Hub 아이디
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
                            CURRENT_BACKEND=\$(docker ps --format '{{.Names}}' | grep 'backend-' | head -n 1)
                            echo "현재 실행 중인 컨테이너: \$CURRENT_BACKEND"

                            # 새로운 백엔드 컨테이너 결정
                            if [ "\$CURRENT_BACKEND" == "backend-1" ]; then
                                NEW_BACKEND="backend-2"
                            else
                                NEW_BACKEND="backend-1"
                            fi
                            echo "새롭게 배포할 컨테이너: \$NEW_BACKEND"

                            echo "🚀 최신 백엔드 이미지 가져오기"
                            docker-compose pull \$NEW_BACKEND

                            echo "🚀 새 컨테이너 실행"
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            docker-compose up -d --force-recreate \$NEW_BACKEND

                            echo "🛠️ 새 컨테이너 정상 작동 확인 중..."
                            sleep 10
                            HEALTHY=\$(docker inspect --format='{{.State.Health.Status}}' \$NEW_BACKEND)
                            if [ "\$HEALTHY" != "healthy" ]; then
                                echo "❌ 새 컨테이너가 정상적으로 실행되지 않았습니다!"
                                exit 1
                            fi

                            echo "🔄 Nginx 트래픽을 새 컨테이너로 변경"
                            sudo sed -i "s/\$CURRENT_BACKEND/\$NEW_BACKEND/g" /home/ubuntu/j12d105/nginx/nginx.conf
                            sudo systemctl restart nginx

                            echo "🗑️ 기존 컨테이너 종료"
                            docker stop \$CURRENT_BACKEND && docker rm \$CURRENT_BACKEND

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
        }
        failure {
            echo "❌ Deployment Failed."
        }
    }
}
