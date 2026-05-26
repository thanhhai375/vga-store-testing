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
options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Đang lấy code mới nhất từ Github...'
            }
        }
      // BƯỚC 1: DỌN DẸP VÀ BẬT SERVER LÊN TRƯỚC
        stage('Deploy to Server (Docker)') {
            steps {
                echo '🚀 Đang tiến hành Deploy lên Server thực tế...'

                // "BẮN TỈA": Chỉ tắt và dọn dẹp các app, TUYỆT ĐỐI để Jenkins được sống
                sh 'docker-compose -p vga-store-testing rm -f -s db backend admin-frontend user-frontend'

                // Khởi tạo lại App
                sh 'docker-compose -p vga-store-testing up -d --build db backend admin-frontend user-frontend'

                echo '✅ Triển khai thành công! Đang đợi Backend (Spring Boot) khởi động hoàn tất...'
                
                sh '''
                echo "⏳ Bắt đầu Health Check..."
                max_attempts=30
                attempt=0
                
                # Chờ tối đa 60 giây (30 lần x 2s)
                while [ $attempt -lt $max_attempts ]; do
                    # Gọi thử vào backend (trong cùng Docker network). 
                    # Nếu server đã bật sẽ trả về một mã HTTP (vd: 200, 401, 403, 405...). 
                    # Nếu server chưa bật hoặc bị lỗi, curl sẽ thất bại và gán giá trị "000".
                    http_code=$(curl -s -o /dev/null -w "%{http_code}" http://backend:8080/api/orders || echo "000")
                    
                    if [ "$http_code" != "000" ]; then
                        echo "✅ Backend đã sẵn sàng phản hồi! (Mã trạng thái HTTP: $http_code)"
                        break
                    fi
                    
                    echo "⏳ Backend đang khởi động, vui lòng chờ... (Thử lần $((attempt+1))/$max_attempts)"
                    sleep 2
                    attempt=$((attempt+1))
                done

                if [ $attempt -eq $max_attempts ]; then
                    echo "❌ QUÁ THỜI GIAN! Backend không thể khởi động sau 60 giây. Đánh rớt Pipeline!"
                    exit 1
                fi
                '''
            }
        }
        stage('Run API Tests (Newman/Postman)') {
            steps {
                dir('automation') {
                    echo 'Đang chạy API Test tự động cho TỪNG FILE RIÊNG LẺ...'
                    sh '''
                    # Xóa file lỗi cũ nếu có
                    rm -f ../error_reason.txt
                    failed=0

                    # Quét tất cả các file có đuôi .json trong thư mục postman
                    for test_file in postman/*.json; do
                        echo "=================================================="
                        echo "▶️ ĐANG CHẠY KỊCH BẢN: $test_file"
                        echo "=================================================="

                        # Chạy newman, tắt màu để dễ grep, lưu output ra file tạm
                        docker run --rm \\
                            --network vga-store-testing_vga-network \\
                            --volumes-from vga_jenkins \\
                            -w $(pwd) \\
                            postman/newman run "$test_file" \\
                            --color off --disable-unicode \\
                            --reporters cli,junit \\
                            --reporter-junit-export "report-$(basename "$test_file").xml" \\
                            --env-var "baseUrl=http://backend:8080" \\
                            --env-var "baseurl=http://backend:8080" > newman_log.txt 2>&1 || {
                            
                                echo "❌ PHÁT HIỆN LỖI TẠI FILE: $test_file" >> ../error_reason.txt
                                echo "Chi tiết các Test Case bị FAILED:" >> ../error_reason.txt
                                
                                # Newman có in ra 1 bảng lỗi ở cuối, chữ "failure         detail". Ta sẽ trích xuất 30 dòng sau nó.
                                grep -A 30 "failure         detail" newman_log.txt | grep -v "^$" >> ../error_reason.txt || echo "- Lỗi không xác định (xem log Jenkins)" >> ../error_reason.txt
                                echo "---------------------------------------" >> ../error_reason.txt
                                echo "" >> ../error_reason.txt
                                
                                failed=1
                            }
                        
                        # In log ra console của Jenkins
                        cat newman_log.txt
                    done

                    # Nếu có bất kỳ file nào failed thì đánh sập pipeline
                    if [ $failed -eq 1 ]; then
                        exit 1
                    fi
                    '''
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
                def summaryTitle = "Lỗi hệ thống hoặc lỗi Cài đặt môi trường"
                if (fileExists('error_reason.txt')) {
                    errorReason = readFile('error_reason.txt').trim()
                    // Lấy dòng đầu tiên làm tiêu đề cho Jira (để không bị lỗi multi-line ở Summary)
                    summaryTitle = errorReason.split('\\n')[0].take(200)
                    
                    // Xử lý xuống dòng (escapes) cho JSON
                    errorReason = errorReason.replaceAll('\\n', '\\\\n').replaceAll('"', '\\\\"')
                }

                def bugSummary = "[Bug Tự Động] ${summaryTitle}"
                def bugDescription = "Hệ thống CI/CD Jenkins vừa quét và phát hiện lỗi mới.\\n\\n**1. Nhánh bị lỗi (Branch):** ${branchName}\\n\\n**2. Chi tiết lỗi (Log):**\\n{code}\\n${errorReason}\\n{code}\\n\\n**3. Thủ phạm tình nghi (Người code):** ${culprit}\\n\\n**4. Cách xem chi tiết mã lỗi:** Vui lòng bấm vào đường link này để xem Nhật ký chạy test của Jenkins: [Xem Console Output](${env.BUILD_URL}console)"

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