$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
Set-Location $root

$reportsDir = Join-Path $root "reports"
if (-not (Test-Path -LiteralPath $reportsDir)) {
    New-Item -ItemType Directory -Path $reportsDir | Out-Null
}

$newman = Join-Path $root "node_modules\.bin\newman.cmd"
if (-not (Test-Path -LiteralPath $newman)) {
    $newman = "newman"
}

$collection = "postman/VGA-AUTH-USER/VGA-Store-Auth/VGA Store Auth.postman_collection.json"
$environment = "postman/env/VGA_Store_Environment.postman_environment.json"

$runs = @(
    @{
        Name = "REGISTER"
        Folder = "Register"
        Data = "postman/VGA-AUTH-USER/VGA-Store-Auth/Register/Auth_Register_Testcase.csv"
        Report = "reports/auth-register-blackbox-newman.json"
    },
    @{
        Name = "LOGIN"
        Folder = "Login"
        Data = "postman/VGA-AUTH-USER/VGA-Store-Auth/Login/Auth_Login_Testcase.csv"
        Report = "reports/auth-login-blackbox-newman.json"
    },
    @{
        Name = "GOOGLE LOGIN"
        Folder = "Google Login (Mock)"
        Data = "postman/VGA-AUTH-USER/VGA-Store-Auth/Google-Login/Auth_Google_Login_Testcase.csv"
        Report = "reports/auth-google-login-blackbox-newman.json"
    },
    @{
        Name = "CHANGE PASSWORD"
        Folder = "ChangePassword"
        Data = "postman/VGA-AUTH-USER/VGA-Store-Auth/ChangePassword/Auth_ChangePassword_Testcase.csv"
        Report = "reports/auth-change-password-blackbox-newman.json"
    }
)

$failedRuns = @()

foreach ($run in $runs) {
    Write-Host ""
    Write-Host "================ AUTH $($run.Name) ================"
    Write-Host ""

    & $newman run $collection `
        -e $environment `
        -d $run.Data `
        --folder $run.Folder `
        --reporters cli,json `
        --reporter-json-export $run.Report

    if ($LASTEXITCODE -ne 0) {
        $failedRuns += $run.Name
    }
}

if ($failedRuns.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed auth runs: $($failedRuns -join ', ')"
    exit 1
}

Write-Host ""
Write-Host "All auth Newman runs passed."
