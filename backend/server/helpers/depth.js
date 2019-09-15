const exec = require("child_process").exec


/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}


async function getDepth(filePath) {
    return sh(`cd ../monodepth2/ && python test_simple.py --image_path ${filePath} --model_name mono+stereo_640x192`)
}

module.exports = {
    getDepth: getDepth
}