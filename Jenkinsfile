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

                // Xóa file log lỗi cũ để tránh bị báo cáo sai nếu sập sớm
                sh 'rm -f error_reason*.txt'

                // "BẮN TỈA": Chỉ tắt và dọn dẹp các app, TUYỆT ĐỐI để Jenkins được sống
                sh 'docker compose -p vga-store-testing rm -f -s db backend admin-frontend user-frontend'
                
                // Xóa sạch data cũ của Database để đảm bảo môi trường test luôn mới tinh (Fresh DB)
                sh 'docker run --rm -v vga-store-testing_pgdata:/dbdata alpine sh -c "rm -rf /dbdata/*"'

                // Khởi tạo lại App
                sh 'docker compose -p vga-store-testing up -d --build db backend admin-frontend user-frontend'

                echo '✅ Triển khai thành công! Đang đợi Backend (Spring Boot) khởi động hoàn tất...'

                sh '''
                echo "⏳ Bắt đầu Health Check..."
                max_attempts=30
                attempt=0

                # Chờ tối đa 60 giây (30 lần x 2s)
                while [ $attempt -lt $max_attempts ]; do
                    # Gọi thử vào backend (trong cùng Docker network).
                    # Nếu server đã bật sẽ trả về một mã HTTP (vd: 200, 401, 403, 405...).
                    http_code=$(curl -s -o /dev/null -w "%{http_code}" http://backend:8080/api/orders || true)

                    if [ "$http_code" = "200" ] || [ "$http_code" = "401" ] || [ "$http_code" = "403" ] || [ "$http_code" = "405" ]; then
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
                    rm -f ../error_reason*.txt
                    failed=0

                    # Quét tất cả các file có đuôi .postman_collection.json trong các thư mục con của postman
                    for test_file in postman/*/*.postman_collection.json; do
                        echo "=================================================="
                        echo "▶️ ĐANG CHẠY KỊCH BẢN: $test_file"
                        echo "=================================================="

                        # Chạy newman VÀ nạp thêm file Environment vào (như chạy trên máy tính)
                        docker run --rm \
                            --network vga-store-testing_vga-network \
                            --volumes-from vga_jenkins \
                            -w $(pwd) \
                            postman/newman run "$test_file" \
                            -e "postman/env/VGA_Store_Environment.postman_environment.json" \
                            --export-environment "postman/env/VGA_Store_Environment.postman_environment.json" \
                            --env-var "baseUrl=http://backend:8080" \
                            --color off --disable-unicode \
                            --reporters cli,junit,json \
                            --reporter-junit-export "report-$(basename "$test_file").xml" \
                            --reporter-json-export "report-$(basename "$test_file").json" > newman_log.txt 2>&1 || {

                                # Tạo script Node.js siêu ngắn để bóc tách chính xác Testcase nào lỗi từ file JSON
                                cat << 'EOF' > parse_errors.js
const fs = require('fs');
const testFile = process.argv[2];
try {
  const baseName = require('path').basename(testFile);
  const jsonName = 'report-' + baseName + '.json';
  const outName = '../error_reason_' + baseName.replace(/\s+/g, '_') + '.txt';
  const data = JSON.parse(fs.readFileSync(jsonName));
  let hasError = false;
  data.run.executions.forEach(exec => {
    if (exec.assertions) {
      exec.assertions.forEach(assert => {
        if (assert.error) {
          if (!hasError) {
             fs.appendFileSync(outName, '❌ FILE: ' + testFile + '\n');
             hasError = true;
          }
          const errMsg = assert.error.message.replace(/\r?\n/g, ' ');
          fs.appendFileSync(outName, '  - Testcase: ' + exec.item.name + '\n    Lỗi: ' + errMsg + '\n\n');
        }
      });
    }
  });
} catch (e) {
  const baseName = require('path').basename(testFile);
  const outName = '../error_reason_' + baseName.replace(/\s+/g, '_') + '.txt';
  fs.appendFileSync(outName, '❌ FILE: ' + testFile + '\n  - Lỗi không xác định (xem log Jenkins): ' + e.message + '\n\n');
}
EOF
                                node parse_errors.js "$test_file"

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
                def branchName = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                if (branchName == "HEAD") {
                    branchName = env.GIT_BRANCH ?: "Unknown Branch"
                }

                // Tìm tất cả các file lỗi được sinh ra
                def errorFilesStr = sh(script: "ls error_reason_*.txt 2>/dev/null || true", returnStdout: true).trim()

                if (errorFilesStr) {
                    def errorFiles = errorFilesStr.split('\n')
                    for (int i = 0; i < errorFiles.length; i++) {
                        def file = errorFiles[i].trim()
                        if (!file) continue
                        
                        def errorReason = readFile(file).trim()
                        def lines = errorReason.split('\n')
                        def summaryTitle = lines[0].take(200).replace('"', "'")
                        def culprit = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()

                        // Lấy tên file bị lỗi và người sửa cuối
                        def fileLine = lines.find { it.startsWith('❌ FILE: ') }
                        if (fileLine) {
                            def failedFile = fileLine.replace('❌ FILE: ', '').trim()
                            def fileAuthor = sh(script: "git log -1 --pretty=format:'%an <%ae>' -- \"automation/${failedFile}\"", returnStdout: true).trim()
                            if (fileAuthor) {
                                culprit = fileAuthor
                            }
                        }

                        // CÔNG THỨC LÀM SẠCH CHUẨN JSON
                        errorReason = errorReason.replace('\\', '\\\\')
                                                 .replace('"', '\\"')
                                                 .replace('\t', '    ')
                                                 .replace('\r', '')
                                                 .replace('\n', '\\n')

                        def bugSummary = "[Bug Tự Động] ${summaryTitle}"
                        def bugDescription = "Hệ thống CI/CD Jenkins vừa quét và phát hiện lỗi mới.\\n\\n**1. Nhánh bị lỗi (Branch):** ${branchName}\\n\\n**2. Các Testcase rớt & Lý do lỗi:**\\n{code}\\n${errorReason}\\n{code}\\n\\n**3. Thủ phạm tình nghi (Người sửa file cuối):** ${culprit}\\n\\n**4. Xem thêm:** Vui lòng kiểm tra màn hình Jenkins Console (Build #${env.BUILD_NUMBER}) để biết toàn bộ quá trình chạy."

                        def payload = """
                        {
                            "fields": {
                                "project": { "key": "${JIRA_PROJECT_KEY}" },
                                "summary": "${bugSummary}",
                                "description": "${bugDescription}",
                                "issuetype": { "name": "Bug" }
                            }
                        }
                        """

                        writeFile file: "jira_payload_${i}.json", text: payload

                        sh """
                        curl -s -X POST -u "${JIRA_USER}:${JIRA_TOKEN}" \\
                        -H "Content-Type: application/json" \\
                        -d @jira_payload_${i}.json \\
                        ${JIRA_URL}/rest/api/2/issue/
                        """
                        echo "✅ Đã tạo Jira ticket cho file ${file}"
                    }
                } else {
                    // Nếu pipeline sập nhưng không có file lỗi (ví dụ sập do build docker lỗi)
                    def culprit = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()
                    def summaryTitle = "Lỗi Build/Deploy Môi trường Server"
                    def errorReason = "Lỗi khởi động môi trường Server (Pipeline sập trước khi kịp chạy Test). Vui lòng kiểm tra log Jenkins."

                    def bugSummary = "[Bug Tự Động] ${summaryTitle}"
                    def bugDescription = "Hệ thống CI/CD Jenkins vừa quét và phát hiện lỗi.\\n\\n**1. Nhánh bị lỗi (Branch):** ${branchName}\\n\\n**2. Lý do lỗi:**\\n{code}\\n${errorReason}\\n{code}\\n\\n**3. Thủ phạm tình nghi:** ${culprit}\\n\\n**4. Xem thêm:** Vui lòng kiểm tra màn hình Jenkins Console (Build #${env.BUILD_NUMBER}) để biết toàn bộ quá trình chạy."

                    def payload = """
                    {
                        "fields": {
                            "project": { "key": "${JIRA_PROJECT_KEY}" },
                            "summary": "${bugSummary}",
                            "description": "${bugDescription}",
                            "issuetype": { "name": "Bug" }
                        }
                    }
                    """

                    writeFile file: 'jira_payload.json', text: payload

                    sh """
                    curl -s -X POST -u "${JIRA_USER}:${JIRA_TOKEN}" \\
                    -H "Content-Type: application/json" \\
                    -d @jira_payload.json \\
                    ${JIRA_URL}/rest/api/2/issue/
                    """
                }
            }
        }
        success {
            echo '🎉 Tuyệt vời! Mọi test case đều pass và Deploy thành công.'
        }
    }
}