pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/j12d105/docker-compose.yml"
        IMAGE_NAME = "backend-server"
        DOCKER_HUB_ID = "jaeyeolyim"
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

        stage('Blue-Green Deployment with Load Balancing') {
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

                            # 현재 실행 중인 백엔드 컨테이너 확인 (로드밸런싱)
                            CURRENT_BACKENDS=( $(docker ps --format '{{.Names}}' | grep 'backend-' | sort) )
                            echo "현재 실행 중인 컨테이너: \${CURRENT_BACKENDS[@]}"

                            # 새롭게 배포할 컨테이너 결정 (Blue-Green 방식)
                            if [[ "${CURRENT_BACKENDS[@]}" =~ "backend-1" ]]; then
                                NEW_BACKENDS=("backend-3" "backend-4")
                            else
                                NEW_BACKENDS=("backend-1" "backend-2")
                            fi
                            echo "새롭게 배포할 컨테이너: \${NEW_BACKENDS[@]}"

                            echo "🚀 최신 백엔드 이미지 가져오기"
                            docker-compose pull \${NEW_BACKENDS[@]}

                            echo "🚀 새 컨테이너 실행"
                            MYSQL_USERNAME=${MYSQL_USERNAME} \
                            MYSQL_PASSWORD=${MYSQL_PASSWORD} \
                            REDIS_PASSWORD=${REDIS_PASSWORD} \
                            docker-compose up -d --force-recreate \${NEW_BACKENDS[@]}

                            echo "🛠️ 새 컨테이너 정상 작동 확인 중..."
                            sleep 10
                            for backend in "${NEW_BACKENDS[@]}"; do
                                HEALTHY=\$(docker inspect --format='{{.State.Health.Status}}' \$backend)
                                if [ "\$HEALTHY" != "healthy" ]; then
                                    echo "❌ 컨테이너 \$backend 가 정상적으로 실행되지 않았습니다!"
                                    exit 1
                                fi
                            done

                            echo "🔄 Nginx 트래픽을 새 컨테이너로 변경"
                            sudo sed -i "s/${CURRENT_BACKENDS[0]}/${NEW_BACKENDS[0]}/g" /home/ubuntu/j12d105/nginx/nginx.conf
                            sudo sed -i "s/${CURRENT_BACKENDS[1]}/${NEW_BACKENDS[1]}/g" /home/ubuntu/j12d105/nginx/nginx.conf
                            sudo systemctl restart nginx

                            echo "🗑️ 기존 컨테이너 종료"
                            docker stop \${CURRENT_BACKENDS[@]} && docker rm \${CURRENT_BACKENDS[@]}

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