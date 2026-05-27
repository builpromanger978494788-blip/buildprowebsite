const { execSync } = require('child_process');
try {
  console.log("Git add:");
  console.log(execSync('git add .').toString());
  console.log("Git commit:");
  try {
    console.log(execSync('git commit -m "update website cms features"').toString());
  } catch(e) {
    console.log(e.stdout.toString());
    console.log(e.stderr.toString());
  }
  console.log("Git push:");
  console.log(execSync('git push').toString());
} catch(e) {
  console.error("Error executing git:", e.message);
  if (e.stdout) console.log("STDOUT:", e.stdout.toString());
  if (e.stderr) console.error("STDERR:", e.stderr.toString());
}
