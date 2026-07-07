const fs = require("fs");
const path = require("path");
const newman = require("newman");

const root = __dirname;
process.chdir(root);

const reportsDir = path.join(root, "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const collection = path.join(root, "postman", "VGA-AUTH-USER", "VGA-Store-Auth", "VGA Store Auth.postman_collection.json");
const environment = path.join(root, "postman", "env", "VGA_Store_Environment.postman_environment.json");

const runs = [
  {
    name: "REGISTER",
    folder: "Register",
    data: path.join(root, "postman", "VGA-AUTH-USER", "VGA-Store-Auth", "Register", "Auth_Register_Testcase.csv"),
    report: path.join(root, "reports", "auth-register-blackbox-newman.json"),
  },
  {
    name: "LOGIN",
    folder: "Login",
    data: path.join(root, "postman", "VGA-AUTH-USER", "VGA-Store-Auth", "Login", "Auth_Login_Testcase.csv"),
    report: path.join(root, "reports", "auth-login-blackbox-newman.json"),
  },
  {
    name: "GOOGLE LOGIN",
    folder: "Google Login (Mock)",
    data: path.join(root, "postman", "VGA-AUTH-USER", "VGA-Store-Auth", "Google-Login", "Auth_Google_Login_Testcase.csv"),
    report: path.join(root, "reports", "auth-google-login-blackbox-newman.json"),
  },
  {
    name: "CHANGE PASSWORD",
    folder: "ChangePassword",
    data: path.join(root, "postman", "VGA-AUTH-USER", "VGA-Store-Auth", "ChangePassword", "Auth_ChangePassword_Testcase.csv"),
    report: path.join(root, "reports", "auth-change-password-blackbox-newman.json"),
  },
];

function runNewman(run) {
  return new Promise((resolve) => {
    console.log("");
    console.log(`================ AUTH ${run.name} ================`);
    console.log("");

    newman.run(
      {
        collection,
        environment,
        iterationData: run.data,
        folder: run.folder,
        reporters: ["cli", "json"],
        reporter: {
          json: {
            export: run.report,
          },
        },
      },
      (error, summary) => {
        const failed =
          Boolean(error) ||
          (summary && summary.run && summary.run.failures && summary.run.failures.length > 0);

        if (error) {
          console.error(error);
        }

        resolve(failed);
      }
    );
  });
}

(async () => {
  const failedRuns = [];

  for (const run of runs) {
    const failed = await runNewman(run);
    if (failed) {
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
})();
