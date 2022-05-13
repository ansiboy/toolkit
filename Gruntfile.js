
const webpack_es6 = require('./webpack.config.js');

let webpack_es6_min = Object.assign({}, webpack_es6, {
    output: Object.assign({}, webpack_es6.output, { filename: "index.min.js" }),
    mode: 'production',
})

let webpack_es5 = Object.assign({}, webpack_es6, {
    entry: __dirname + "/out-es5/index.js",
    output: Object.assign({}, webpack_es6.output, { filename: "index.es5.js" }),
})

let webpack_es5_min = Object.assign({}, webpack_es5, {
    output: Object.assign({}, webpack_es6.output, { filename: "index.es5.min.js" }),
    mode: 'production',
})

function modifyVersion() {
    const package = require("./package.json");

    let version = package.version || "1.0.0";
    let arr = version.split(".");
    arr[arr.length - 1] = (Number.parseInt(arr[arr.length - 1]) + 1).toString();
    version = arr.join(".");
    package.version = version;

    const fs = require('fs');
    let data = JSON.stringify(package, null, 4);
    fs.writeFileSync("package.json", data, "utf8");
};
modifyVersion();


module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: [
                    ['@babel/preset-env', {
                        targets: {
                            "chrome": "58",
                            "ie": "11"
                        }
                    }],
                ],
                plugins: [
                    ["@babel/plugin-proposal-class-properties"]
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'out',
                    src: ['**/*.js'],
                    dest: 'out-es5/'
                }]
            }
        },
        shell: {
            src: {
                command: `tsc -p src`
            }
        },
        webpack: {
            es6: webpack_es6,
            es6_min: webpack_es6_min,
            es5: webpack_es5,
            es5_min: webpack_es5_min,
        },
    })

    grunt.registerTask('default', ['shell', 'babel', 'webpack']);
}