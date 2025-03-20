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

                
        stage('Deploy (Backend & MySQL)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    withCredentials([
                        string(credentialsId: 'MySQL-Root-Credentials', variable: 'MYSQL_ROOT_CRED')
                    ]) {
                        script {
                            def rootInfo = MYSQL_ROOT_CRED.split(':')
                            def mysqlRootUser = rootInfo[0]  // root
                            def mysqlRootPass = rootInfo[1]  // ssafyd105

                            sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@j12d105.p.ssafy.io <<- EOF
                            cd /home/ubuntu/j12d105

                            echo "🛑 기존 백엔드 및 MySQL 컨테이너 중단 & 삭제"
                            docker-compose down

                            echo "🚀 최신 백엔드 이미지 가져오기"
                            docker pull ${DOCKER_HUB_ID}/${IMAGE_NAME}:latest

                            echo "🚀 환경 변수 설정 후 컨테이너 실행"
                            MYSQL_ROOT_PASSWORD="${mysqlRootPass}" docker-compose up -d

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
