const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = __dirname;
process.chdir(root);

const reportsDir = path.join(root, "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const collection = "postman/VGA-AUTH-USER/VGA-Store-Auth/VGA Store Auth.postman_collection.json";
const environment = "postman/env/VGA_Store_Environment.postman_environment.json";

const runs = [
  {
    name: "REGISTER",
    folder: "Register",
    data: "postman/VGA-AUTH-USER/VGA-Store-Auth/Register/Auth_Register_Testcase.csv",
    report: "reports/auth-register-blackbox-newman.json",
  },
  {
    name: "LOGIN",
    folder: "Login",
    data: "postman/VGA-AUTH-USER/VGA-Store-Auth/Login/Auth_Login_Testcase.csv",
    report: "reports/auth-login-blackbox-newman.json",
  },
  {
    name: "GOOGLE LOGIN",
    folder: "Google Login (Mock)",
    data: "postman/VGA-AUTH-USER/VGA-Store-Auth/Google-Login/Auth_Google_Login_Testcase.csv",
    report: "reports/auth-google-login-blackbox-newman.json",
  },
  {
    name: "CHANGE PASSWORD",
    folder: "ChangePassword",
    data: "postman/VGA-AUTH-USER/VGA-Store-Auth/ChangePassword/Auth_ChangePassword_Testcase.csv",
    report: "reports/auth-change-password-blackbox-newman.json",
  },
];

const failedRuns = [];
const newmanBin = process.platform === "win32" ? "newman.cmd" : "newman";

for (const run of runs) {
  console.log("");
  console.log(`================ AUTH ${run.name} ================`);
  console.log("");

  const result = spawnSync(
    newmanBin,
    [
      "run",
      collection,
      "-e",
      environment,
      "-d",
      run.data,
      "--folder",
      run.folder,
      "--reporters",
      "cli,json",
      "--reporter-json-export",
      run.report,
    ],
    { stdio: "inherit", shell: process.platform === "win32" }
  );

  if (result.status !== 0) {
    failedRuns.push(run.name);
  }
}

if (failedRuns.length > 0) {
  console.log("");
  console.log(`Failed auth runs: ${failedRuns.join(", ")}`);
  process.exit(1);
}

console.log("");
console.log("All auth Newman runs passed.");
