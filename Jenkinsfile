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

                sh '''
                # Tải docker-compose (v2) về workspace nếu chưa có (vì server không có sẵn lệnh docker-compose)
                if [ ! -f ./docker-compose ]; then
                    echo "Đang tải docker-compose..."
                    curl -sSL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 -o docker-compose
                    chmod +x docker-compose
                fi

                # Đảm bảo container Jenkins được kết nối vào network của dự án để gọi được API
                docker network connect vga-store-testing_vga-network vga_jenkins || true

                # Kiểm tra xem các container chính (backend và db) có đang hoạt động sẵn hay không
                backend_running=$(docker ps --filter "name=vga_backend" --filter "status=running" -q)
                db_running=$(docker ps --filter "name=vga_db" --filter "status=running" -q)

                if [ -n "$backend_running" ] && [ -n "$db_running" ]; then
                    echo "⚡ Phát hiện các container (Backend & DB) đã hoạt động sẵn!"
                    echo "⚡ BỎ QUA các bước build lại từ đầu."
                    echo "🧹 Đang dọn dẹp Database (Wipe DB) để tránh lỗi trùng lặp dữ liệu (Email is already in use)..."
                    
                    # Tắt và xóa nhanh container db và backend
                    ./docker-compose -p vga-store-testing rm -f -s db backend
                    
                    # Xóa sạch data cũ của Database
                    docker run --rm -v vga-store-testing_pgdata:/dbdata alpine sh -c "rm -rf /dbdata/*"
                    
                    # Khởi động lại db và backend (không dùng --build) để hệ thống chạy SQL init tự động
                    ./docker-compose -p vga-store-testing up -d db backend
                else
                    echo "⚠️ Phát hiện hệ thống chưa chạy hoặc đang bị tắt. Tiến hành dựng mới..."
                    
                    # "BẮN TỈA": Chỉ tắt và dọn dẹp các app, TUYỆT ĐỐI để Jenkins được sống
                    ./docker-compose -p vga-store-testing rm -f -s db backend admin-frontend user-frontend
                    
                    # Xóa sạch data cũ của Database để đảm bảo môi trường test luôn mới tinh (Fresh DB)
                    docker run --rm -v vga-store-testing_pgdata:/dbdata alpine sh -c "rm -rf /dbdata/*"

                    # Khởi tạo lại App
                    ./docker-compose -p vga-store-testing up -d --build db backend admin-frontend user-frontend

                    # Kết nối lại mạng
                    docker network connect vga-store-testing_vga-network vga_jenkins || true
                fi
                '''

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
                    sh '''#!/bin/bash
                    # Xóa file lỗi cũ nếu có
                    rm -f ../error_reason*.txt
                    failed=0

                    # Tạo script Node.js siêu ngắn để bóc tách chính xác Testcase nào lỗi từ file JSON
                    cat << 'EOF' > parse_errors.js
const fs = require('fs');
const path = require('path');
const testFile = process.argv[2];
const jsonName = process.argv[3];

try {
  const baseName = path.basename(testFile);
  const outName = '../error_reason_' + baseName.replace(/\\s+/g, '_') + '.txt';
  const data = JSON.parse(fs.readFileSync(jsonName));
  let hasError = false;

  data.run.executions.forEach(exec => {
    if (exec.assertions) {
      const failedAsserts = exec.assertions.filter(a => a.error);
      if (failedAsserts.length > 0) {
        if (!hasError) {
          fs.appendFileSync(outName, '❌ FILE: ' + testFile + '\\n\\n');
          hasError = true;
        }

        const iteration = exec.cursor ? (exec.cursor.iteration + 1) : 1;
        
        let reqUrl = '';
        if (exec.request && exec.request.url) {
          if (typeof exec.request.url === 'string') {
            reqUrl = exec.request.url;
          } else if (exec.request.url.raw) {
            reqUrl = exec.request.url.raw;
          } else {
            const proto = exec.request.url.protocol || 'http';
            const host = Array.isArray(exec.request.url.host) ? exec.request.url.host.join('.') : (exec.request.url.host || '');
            const port = exec.request.url.port ? ':' + exec.request.url.port : '';
            const pathStr = Array.isArray(exec.request.url.path) ? exec.request.url.path.join('/') : (exec.request.url.path || '');
            reqUrl = proto + '://' + host + port + '/' + pathStr;
          }
        }
        
        const method = exec.request ? exec.request.method : 'N/A';
        
        let reqBody = '';
        if (exec.request && exec.request.body && exec.request.body.raw) {
          reqBody = exec.request.body.raw;
          try {
            const parsed = JSON.parse(reqBody);
            reqBody = JSON.stringify(parsed, null, 2);
          } catch (e) {}
          if (reqBody.length > 300) {
            reqBody = reqBody.substring(0, 300) + '... [TRUNCATED]';
          }
        }

        const statusCode = exec.response ? exec.response.code : 'N/A';
        let respBody = '';
        if (exec.response && exec.response.stream) {
          try {
            if (exec.response.stream.type === 'Buffer' && Array.isArray(exec.response.stream.data)) {
              respBody = Buffer.from(exec.response.stream.data).toString('utf8');
            } else if (Buffer.isBuffer(exec.response.stream)) {
              respBody = exec.response.stream.toString('utf8');
            } else if (typeof exec.response.stream === 'string') {
              respBody = exec.response.stream;
            }
          } catch (e) {
            respBody = '[Error parsing response: ' + e.message + ']';
          }
        }
        if (respBody) {
          try {
            const parsed = JSON.parse(respBody);
            respBody = JSON.stringify(parsed, null, 2);
          } catch (e) {}
          if (respBody.length > 300) {
            respBody = respBody.substring(0, 300) + '... [TRUNCATED]';
          }
        }

        fs.appendFileSync(outName, '  - Request: ' + method + ' ' + reqUrl + ' (Iteration: ' + iteration + ')\\n');
        if (reqBody) {
          fs.appendFileSync(outName, '    Request Body:\\n' + reqBody.split('\\n').map(l => '      ' + l).join('\\n') + '\\n');
        }
        fs.appendFileSync(outName, '    Response Status: ' + statusCode + '\\n');
        if (respBody) {
          fs.appendFileSync(outName, '    Response Body:\\n' + respBody.split('\\n').map(l => '      ' + l).join('\\n') + '\\n');
        }

        failedAsserts.forEach(assert => {
          const assertName = assert.assertion || 'Unnamed assertion';
          const errMsg = assert.error.message.replace(/[\\r\\n]+/g, ' ');
          fs.appendFileSync(outName, '    * Failure: ' + assertName + '\\n      Error details: ' + errMsg + '\\n');
        });
        fs.appendFileSync(outName, '\\n' + '='.repeat(50) + '\\n\\n');
      }
    }
  });
} catch (e) {
  const baseName = path.basename(testFile);
  const outName = '../error_reason_' + baseName.replace(/\\s+/g, '_') + '.txt';
  fs.appendFileSync(outName, '❌ FILE: ' + testFile + '\\n  - Lỗi không xác định (xem log Jenkins): ' + e.message + '\\n\\n');
}
EOF

                    # Quét tất cả các file có đuôi .postman_collection.json trong các thư mục con
                    while read -r test_file; do
                        dir_name=$(dirname "$test_file")
                        base_test_name=$(basename "$test_file")
                        
                        # Tìm tất cả file CSV trong cùng thư mục đó
                        csv_files=("$dir_name"/*.csv)
                        csv_count=0
                        
                        # Kiểm tra xem có file CSV nào không (dùng [ -f ] kiểm tra phần tử đầu tiên)
                        if [ -f "${csv_files[0]}" ]; then
                            for csv_file in "${csv_files[@]}"; do
                                csv_count=$((csv_count+1))
                                base_csv_name=$(basename "$csv_file")
                                json_report_name="report-${base_test_name}-${base_csv_name}.json"
                                echo "=================================================="
                                echo "▶️ ĐANG CHẠY KỊCH BẢN: $test_file"
                                echo "📊 Dữ liệu: $base_csv_name"
                                echo "=================================================="

                                docker run --rm \
                                    --network vga-store-testing_vga-network \
                                    --volumes-from vga_jenkins \
                                    -w "$(pwd)" \
                                    postman/newman run "$test_file" \
                                    -d "$csv_file" \
                                    -e "postman/env/VGA_Store_Environment.postman_environment.json" \
                                    --export-environment "postman/env/VGA_Store_Environment.postman_environment.json" \
                                    --env-var "baseUrl=http://backend:8080" \
                                    --color off --disable-unicode \
                                    --reporters cli,junit,json \
                                    --reporter-junit-export "report-${base_test_name}-${base_csv_name}.xml" \
                                    --reporter-json-export "$json_report_name" > newman_log.txt 2>&1 || {
                                        node parse_errors.js "$test_file" "$json_report_name"
                                        failed=1
                                    }
                                cat newman_log.txt
                            done
                        fi

                        # Nếu không có file CSV nào, chạy kịch bản 1 lần không có data
                        if [ "$csv_count" -eq 0 ]; then
                            json_report_name="report-${base_test_name}.json"
                            echo "=================================================="
                            echo "▶️ ĐANG CHẠY KỊCH BẢN: $test_file"
                            echo "⚠️ Không tìm thấy file CSV, chạy không có dữ liệu."
                            echo "=================================================="

                            docker run --rm \
                                --network vga-store-testing_vga-network \
                                --volumes-from vga_jenkins \
                                -w "$(pwd)" \
                                postman/newman run "$test_file" \
                                -e "postman/env/VGA_Store_Environment.postman_environment.json" \
                                --export-environment "postman/env/VGA_Store_Environment.postman_environment.json" \
                                --env-var "baseUrl=http://backend:8080" \
                                --color off --disable-unicode \
                                --reporters cli,junit,json \
                                --reporter-junit-export "report-${base_test_name}.xml" \
                                --reporter-json-export "$json_report_name" > newman_log.txt 2>&1 || {
                                    node parse_errors.js "$test_file" "$json_report_name"
                                    failed=1
                                }
                            cat newman_log.txt
                        fi
                    done < <(find . -name "*.postman_collection.json" | sort)

                    # Nếu có bất kỳ file nào failed thì đánh sập pipeline
                    if [ $failed -eq 1 ]; then
                        exit 1
                    fi
                    '''
                }
            }
        }

        stage('Run UI Tests (CodeceptJS)') {
            agent {
                docker {
                    // Sử dụng image Playwright của Microsoft đã có sẵn các trình duyệt Chrome/Firefox
                    image 'mcr.microsoft.com/playwright:v1.44.0-jammy'
                    reuseNode true
                    args '--ipc=host --network vga-store-testing_vga-network --add-host=host.docker.internal:host-gateway'
                }
            }
            environment {
                HEADLESS = 'true'
                FE_URL = 'http://host.docker.internal:5173'
                USER_FE_URL = 'http://host.docker.internal:5173'
                ADMIN_FE_URL = 'http://host.docker.internal:5174'
                BACKEND_URL = 'http://host.docker.internal:8080'
            }
            steps {
                dir('automation') {
                    echo 'Đang chạy UI Test tự động bằng CodeceptJS bên trong Docker Container...'
                    // Xóa thư mục node_modules cũ để cài lại bản chuẩn trên Linux
                    sh 'rm -rf node_modules'
                    sh 'npm install'
                    sh 'npx playwright install chromium'
                    sh '''#!/bin/bash
                    set +e
                    failed=0

                    while read -r test_file; do
                        safe_name=$(echo "$test_file" | sed 's#^./##; s#[/\\ ]#_#g; s#[^A-Za-z0-9_.-]#_#g')
                        log_file="codecept_${safe_name}.log"
                        error_file="../error_reason_UI_${safe_name}.txt"

                        echo "===== Chạy UI module: $test_file ====="
                        npx codeceptjs run "$test_file" --steps 2>&1 | tee "$log_file"
                        ui_status=${PIPESTATUS[0]}

                        if [ "$ui_status" -ne 0 ]; then
                            failed=1
                            {
                                echo "❌ FILE: $test_file"
                                echo "  - Testcase: Lỗi tại bước test giao diện (CodeceptJS)"
                                echo ""
                                echo "===== Các testcase lỗi ====="
                                grep -E "^[[:space:]]*[0-9]+\\) |-- FAILURES:|FAILURES|Failed tests|Error |TimeoutError|AssertionError|ElementNotFound|expected web application" "$log_file" | tail -n 120 || true
                                echo ""
                                echo "===== Log cuối của CodeceptJS ====="
                                tail -n 180 "$log_file"
                            } > "$error_file"
                        fi
                    done < <(find ./E2E/modules -name "*_test.js" | sort)

                    if [ "$failed" -ne 0 ]; then
                        exit 1
                    fi
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Ối, Test thất bại rồi! Đang gọi API tự động tạo ticket Bug trên Jira...'
            script {
                def branchName = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                if (branchName == "HEAD") {
                    branchName = env.GIT_BRANCH ?: "Unknown Branch"
                }

                def findExistingBug = { bugSummary ->
                    def escapedSummary = bugSummary.replace('\\', '\\\\').replace('"', '\\"')
                    def jql = "project = ${JIRA_PROJECT_KEY} AND issuetype = Bug AND summary ~ \"${escapedSummary}\" ORDER BY created DESC"
                    writeFile file: 'jira_search_jql.txt', text: jql

                    def searchResponse = sh(script: '''
                    curl -s -u "$JIRA_USER:$JIRA_TOKEN" \
                    --get \
                    --data-urlencode "jql=$(cat jira_search_jql.txt)" \
                    --data-urlencode "maxResults=10" \
                    --data-urlencode "fields=summary,status,created" \
                    "$JIRA_URL/rest/api/2/search"
                    ''', returnStdout: true).trim()

                    def parsed = new groovy.json.JsonSlurperClassic().parseText(searchResponse ?: '{"issues":[]}')
                    def issues = parsed.issues ?: []
                    return issues.find { it.fields?.summary == bugSummary }
                }

                def addJiraComment = { issueKey, commentText ->
                    def commentPayload = groovy.json.JsonOutput.toJson([body: commentText])
                    writeFile file: "jira_comment_${issueKey}.json", text: commentPayload

                    sh(script: '''
                    curl -s -X POST -u "$JIRA_USER:$JIRA_TOKEN" \
                    -H "Content-Type: application/json" \
                    -d @jira_comment_''' + issueKey + '''.json \
                    "$JIRA_URL/rest/api/2/issue/''' + issueKey + '''/comment"
                    ''')
                }

                def extractEmail = { authorText ->
                    def matcher = (authorText ?: '') =~ /<([^>]+)>/
                    return matcher.find() ? matcher.group(1).trim() : ''
                }

                def findJiraUserByEmail = { email ->
                    if (!email) {
                        return null
                    }

                    def userResponse = sh(script: '''
                    curl -s -u "$JIRA_USER:$JIRA_TOKEN" \
                    --get \
                    --data-urlencode "query=''' + email + '''" \
                    "$JIRA_URL/rest/api/2/user/search"
                    ''', returnStdout: true).trim()

                    def users = new groovy.json.JsonSlurperClassic().parseText(userResponse ?: '[]')
                    return users.find { it.emailAddress == email } ?: users.find { it.accountId }
                }

                def assignJiraIssue = { issueKey, jiraUser ->
                    if (!issueKey || !jiraUser?.accountId) {
                        return
                    }

                    def assignPayload = groovy.json.JsonOutput.toJson([accountId: jiraUser.accountId])
                    writeFile file: "jira_assign_${issueKey}.json", text: assignPayload

                    sh(script: '''
                    curl -s -X PUT -u "$JIRA_USER:$JIRA_TOKEN" \
                    -H "Content-Type: application/json" \
                    -d @jira_assign_''' + issueKey + '''.json \
                    "$JIRA_URL/rest/api/2/issue/''' + issueKey + '''/assignee"
                    ''')
                }

                def createOrUpdateJiraBug = { int index, String bugSummary, String summaryTitle, String bugDescriptionNew, String errorReason, String culprit ->
                    def existingBug = findExistingBug(bugSummary)
                    def culpritEmail = extractEmail(culprit)
                    def jiraAssignee = findJiraUserByEmail(culpritEmail)

                    if (existingBug) {
                        def issueKey = existingBug.key
                        def statusName = existingBug.fields?.status?.name ?: 'Unknown'
                        def statusCategory = existingBug.fields?.status?.statusCategory?.key ?: 'unknown'
                        def recurrenceState = statusCategory == 'done' ? 'LOI CU DA DONE NHUNG TAI PHAT' : 'LOI CU DANG MO'
                        def assigneeText = jiraAssignee?.accountId ? "${jiraAssignee.displayName ?: culprit} (${culpritEmail})" : "Khong tim thay user Jira theo email ${culpritEmail ?: 'Unknown'}"
                        def commentText = "Trang thai loi: ${recurrenceState}.\n\nJenkins phat hien lai loi nay trong Build #${env.BUILD_NUMBER}.\n\n**Trang thai Jira hien tai:** ${statusName}\n\n**Nguoi phu trach theo commit:** ${assigneeText}\n\n**Nhanh:** ${branchName}\n\n**Chi tiet lan tai phat:**\n{code}\n${errorReason}\n{code}"
                        addJiraComment(issueKey, commentText)
                        assignJiraIssue(issueKey, jiraAssignee)
                        echo "Loi cu: da ton tai Jira ${issueKey} (${statusName}) cho '${summaryTitle}'. Da them comment thay vi tao ticket moi."
                        return issueKey
                    }

                    def issueFields = [
                        project    : [key: "${JIRA_PROJECT_KEY}"],
                        summary    : bugSummary,
                        description: bugDescriptionNew,
                        issuetype  : [name: 'Bug']
                    ]

                    def payload = groovy.json.JsonOutput.toJson([
                        fields: issueFields
                    ])

                    writeFile file: "jira_payload_${index}.json", text: payload

                    def createResponse = sh(script: '''
                    curl -s -X POST -u "$JIRA_USER:$JIRA_TOKEN" \
                    -H "Content-Type: application/json" \
                    -d @jira_payload_''' + index + '''.json \
                    "$JIRA_URL/rest/api/2/issue/"
                    ''', returnStdout: true).trim()

                    def created = new groovy.json.JsonSlurperClassic().parseText(createResponse ?: '{}')
                    echo "Loi moi: da tao Jira ticket ${created.key ?: '(khong doc duoc key)'} cho '${summaryTitle}'"
                    assignJiraIssue(created.key, jiraAssignee)
                    if (!jiraAssignee?.accountId) {
                        echo "Khong gan duoc assignee vi khong tim thay Jira user theo email commit: ${culpritEmail ?: 'Unknown'}"
                    }
                    return created.key
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

                        def bugSummary = "[Bug Tự Động] ${summaryTitle}"
                        def bugDescription = "Trang thai loi: LOI MOI.\n\nHe thong CI/CD Jenkins vua quet va chua thay Jira Bug dang mo nao trung loi nay.\n\n**1. Nhanh bi loi (Branch):** ${branchName}\n\n**2. Cac Testcase rot & Ly do loi:**\n{code}\n${errorReason}\n{code}\n\n**3. Thu pham tinh nghi (Nguoi sua file cuoi):** ${culprit}\n\n**4. Xem them:** Vui long kiem tra man hinh Jenkins Console (Build #${env.BUILD_NUMBER}) de biet toan bo qua trinh chay."
                        createOrUpdateJiraBug(i, bugSummary, summaryTitle, bugDescription, errorReason, culprit)
                    }
                } else {
                    // Nếu pipeline sập nhưng không có file lỗi (ví dụ sập do build docker lỗi)
                    def culprit = sh(script: "git log -1 --pretty=format:'%an <%ae>'", returnStdout: true).trim()
                    def summaryTitle = "Lỗi Build/Deploy Môi trường Server"
                    def errorReason = "Lỗi khởi động môi trường Server (Pipeline sập trước khi kịp chạy Test). Vui lòng kiểm tra log Jenkins."

                    def bugSummary = "[Bug Tự Động] ${summaryTitle}"
                    def bugDescription = "Trang thai loi: LOI MOI.\n\nHe thong CI/CD Jenkins vua quet va chua thay Jira Bug dang mo nao trung loi nay.\n\n**1. Nhanh bi loi (Branch):** ${branchName}\n\n**2. Ly do loi:**\n{code}\n${errorReason}\n{code}\n\n**3. Thu pham tinh nghi:** ${culprit}\n\n**4. Xem them:** Vui long kiem tra man hinh Jenkins Console (Build #${env.BUILD_NUMBER}) de biet toan bo qua trinh chay."
                    createOrUpdateJiraBug(0, bugSummary, summaryTitle, bugDescription, errorReason, culprit)
                }
            }
        }
        success {
            echo '🎉 Tuyệt vời! Mọi test case đều pass và Deploy thành công.'
        }
    }
}

