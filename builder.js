// Copy manifest.json to dist
// Zip dist into wutever
const { copyFileSync, unlinkSync } = require("fs");
const { zip } = require("zip-a-folder");
const { version } = require("./package.json");

(async function () {
    copyFileSync(
        __dirname + "/manifest.json",
        __dirname + "/dist/manifest.json"
    );
    await zip(
        __dirname + "/dist",
        __dirname + `/release/CC GPA Clac ${version}.zip`
    );
    unlinkSync(__dirname + "/dist/manifest.json");
    console.log(
        `✔ Release ${version} made (${__dirname}/release/CC GPA Calc ${version}.zip)`
    );
})();
