// Copy manifest.json to dist
// Zip dist into wutever
const { copyFileSync, unlinkSync, readFileSync, writeFileSync } = require("fs");
const { zip } = require("zip-a-folder");
const { version } = require("./package.json");

(async function () {
    copyFileSync(
        __dirname + "/manifest.prod.json",
        __dirname + "/dist/manifest.json"
    );
    const devStr = readFileSync(__dirname + "/dist/index.js").toString();
    const fixedStr = devStr.replace(
        "const IS_DEV = true;",
        "const IS_DEV = false;"
    );
    writeFileSync(__dirname + "/dist/index.js", fixedStr);

    await zip(
        __dirname + "/dist",
        __dirname + `/release/CC GPA Calc ${version}.zip`
    );
    unlinkSync(__dirname + "/dist/manifest.json");
    writeFileSync(__dirname + "/dist/index.js", devStr);
    console.log(
        `✔ Release ${version} made (${__dirname}/release/CC GPA Calc ${version}.zip)`
    );
})();
