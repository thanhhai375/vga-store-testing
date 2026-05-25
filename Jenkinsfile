pipeline {
    agent any
    tools {
        nodejs 'NodeJS_20'
    }
    environment {
        JIRA_URL = 'https://nguyenthanhhai375.atlassian.net'
        JIRA_USER = 'haint8672@ut.edu.vn'
        JIRA_TOKEN = credentials('JIRA_API_TOKEN')
        JIRA_PROJECT_KEY = 'KCPM'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Đang lấy code mới nhất từ Github...'
            }
        }
        stage('Deploy to Server (Docker)') {
            steps {
                echo '🚀 Đang tiến hành Deploy lên Server thực tế...'

                sh 'docker-compose -p vga-store-testing up -d --build db backend admin-frontend user-frontend'

                echo '✅ Triển khai thành công! Đang đợi Backend (Spring Boot) khởi động hoàn tất...'

                // Dừng 15 giây để đảm bảo Backend đã cắm vào DB và mở port 8080 thành công
                sleep(time: 15, unit: 'SECONDS')
            }
        }

        // BƯỚC 2: SAU KHI SERVER CHẠY THÌ MỚI BẮN TEST API
        stage('Run API Tests (Newman/Postman)') {
            steps {
                dir('automation') {
                    echo 'Đang chạy API Test tự động vào Backend vừa dựng...'
                    sh 'npm install -g newman'
                    sh 'newman run postman/vga-store-api.postman_collection.json || { echo "LỖI TẠI BƯỚC TEST API (POSTMAN)" > ../error_reason.txt; exit 1; }'
                }
            }
        }

        /* // TẠM THỜI TẮT UI TEST THEO YÊU CẦU ĐỂ FIX SAU
        stage('Run UI Tests (Cypress)') {
            agent {
                docker {
                    image 'cypress/included:15.15.0'
                    reuseNode true
                    args '--ipc=host --network vga-network'
                }
            }
            steps {
                dir('automation') {
                    echo 'Đang chạy UI Test tự động bằng Cypress bên trong Docker Container...'
                    sh 'npm install'
                    sh 'cypress run || { echo "LỖI TẠI BƯỚC TEST GIAO DIỆN (CYPRESS)" > ../error_reason.txt; exit 1; }'
                }
            }
        }
        */
    }

    post {
        failure {
            echo '❌ Ối, Test thất bại rồi! Đang gọi API tự động tạo ticket Bug trên Jira...'
            script {
                def culprit = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()
                def branchName = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                if (branchName == "HEAD") {
                    branchName = env.GIT_BRANCH ?: "Unknown Branch"
                }

                def errorReason = "Lỗi hệ thống hoặc lỗi Cài đặt môi trường"
                if (fileExists('error_reason.txt')) {
                    errorReason = readFile('error_reason.txt').trim()
                }

                def bugSummary = "[Bug Tự Động] Hệ thống phát hiện ${errorReason}"
                def bugDescription = "Hệ thống CI/CD Jenkins vừa quét và phát hiện lỗi mới.\\n\\n**1. Nhánh bị lỗi (Branch):** ${branchName}\\n\\n**2. Khu vực xảy ra lỗi:** ${errorReason}\\n\\n**3. Thủ phạm tình nghi (Người code):** ${culprit}\\n\\n**4. Cách xem chi tiết mã lỗi:** Vui lòng bấm vào đường link này để xem Nhật ký chạy test của Jenkins: [Xem Console Output](${env.BUILD_URL}console)"

                def payload = """
                {
                    "fields": {
                        "project": { "key": "${JIRA_PROJECT_KEY}" },
                        "summary": "${bugSummary}",
                        "description": {
                            "type": "doc",
                            "version": 1,
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "text": "${bugDescription}",
                                            "type": "text"
                                        }
                                    ]
                                }
                            ]
                        },
                        "issuetype": { "name": "Bug" }
                    }
                }
                """

                writeFile file: 'jira_payload.json', text: payload

                sh """
                curl -s -X POST -u "${JIRA_USER}:${JIRA_TOKEN}" \\
                -H "Content-Type: application/json" \\
                -d @jira_payload.json \\
                ${JIRA_URL}/rest/api/3/issue/
                """
            }
        }
        success {
            echo '🎉 Tuyệt vời! Mọi test case đều pass và Deploy thành công.'
        }
    }
}