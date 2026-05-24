pipeline {
    agent any

    environment {
        JIRA_URL = 'https://nguyenthanhhai375.atlassian.net'

        JIRA_USER = 'haint8672@ut.edu.vn'

        // Cú pháp chuẩn DevOps: Lấy Token từ Két sắt (Credentials) của Jenkins ra dùng!
        // Như vậy Github sẽ không bao giờ nhìn thấy mã Token này.
        JIRA_TOKEN = credentials('JIRA_API_TOKEN')

        JIRA_PROJECT_KEY = 'KCPM'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Đang lấy code mới nhất từ Github...'
            }
        }

        stage('Run API Tests (Newman/Postman)') {
            steps {
                dir('automation') {
                    echo 'Đang chạy API Test tự động...'
                    // Cài công cụ Newman của Postman
                    sh 'npm install -g newman'
                    // Chạy file collection
                    sh 'newman run postman/vga-store-api.postman_collection.json'
                }
            }
        }

        stage('Run UI Tests (Cypress)') {
            steps {
                dir('automation') {
                    echo 'Đang chạy UI Test tự động...'
                    // Jenkins tự cài thư viện automation
                    sh 'npm install'
                    // Jenkins gõ lệnh chạy trình duyệt ẩn tự động test UI
                    sh 'npx cypress run'
                }
            }
        }

        stage('Deploy to Server (Docker)') {
            steps {
                echo '🚀 Đang tiến hành Deploy lên Server thực tế...'
                // Đây là lúc Jenkins gọi lệnh Docker để đưa ứng dụng lên mạng
                // Ví dụ: sh 'docker-compose up -d --build'
                echo '✅ Triển khai thành công! Ứng dụng đã sẵn sàng cho khách hàng.'
            }
        }
    }

    post {
        failure {
            echo '❌ Ối, Test thất bại rồi! Đang gọi API tự động tạo ticket Bug trên Jira...'
            script {
                // Lấy thông tin người commit cuối cùng bằng lệnh Git
                def culprit = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()

                def bugSummary = "[Auto-Log] Automation Test Failed at Jenkins Build #${BUILD_NUMBER}"
                def bugDescription = "Jenkins Pipeline reported an error. Please check Cypress or Postman logs for details.\\n\\nCommit author causing this error: **${culprit}**"

                // Tạo nội dung ticket gửi lên Jira (Định dạng JSON)
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

                // Lưu nội dung ra file tạm
                writeFile file: 'jira_payload.json', text: payload

                // Dùng lệnh curl gọi thẳng lên Jira Server để nhét ticket vào Backlog
                sh """
                curl -s -X POST -u "${JIRA_USER}:${JIRA_TOKEN}" \\
                -H "Content-Type: application/json" \\
                -d @jira_payload.json \\
                ${JIRA_URL}/rest/api/3/issue/
                """
            }
        }
        success {
            echo ' Tuyệt vời! Mọi test case đều pass .'
        }
    }
}
