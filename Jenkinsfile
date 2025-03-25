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

        stage('Blue-Green Deploy') {
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

                            echo "🔍 현재 실행 중인 백엔드 컨테이너 확인"
                            CURRENT_BACKEND=\$(docker ps --format '{{.Names}}' | grep backend-blue || true)
                            
                            if [ "\$CURRENT_BACKEND" == "backend-blue" ]; then
                                NEW_BACKEND="backend-green"
                                OLD_BACKEND="backend-blue"
                            else
                                NEW_BACKEND="backend-blue"
                                OLD_BACKEND="backend-green"
                            fi

                            echo "🚀 새 컨테이너 (\$NEW_BACKEND) 배포 시작"
                            docker-compose up -d --no-deps --force-recreate \$NEW_BACKEND
                            
                            echo "⏳ 5초 대기 (안정화 시간)"
                            sleep 5

                            echo "🔄 Nginx 트래픽 \$NEW_BACKEND 으로 전환"
                            docker exec -it nginx nginx -s reload

                            echo "🛑 이전 컨테이너 (\$OLD_BACKEND) 종료"
                            docker-compose down \$OLD_BACKEND

                            echo "✅ Blue-Green 배포 완료!"
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
