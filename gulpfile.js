"use strict";

var path = require("path");
var cp = require("child_process");
var gulp = require("gulp");

gulp.task("lint", function (cb) {
    cp.exec("jshint index.js && jshint test", function (err, stdout) {
        if (err) if (stdout) process.stdout.write(stdout);
        cb(err);
    });
});

gulp.task("build", function (cb) {
    cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js | "+
            "./node_modules/uglify-js/bin/uglifyjs > ./dist/orst-vpn.min.js",
            function (err, stdout) {
        if (err) throw err;
        if (stdout) process.stdout.write(stdout);
        cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js "+
                "> ./dist/orst-vpn.js",
                function (err, stdout) {
            if (err) throw err;
            if (stdout) process.stdout.write(stdout);
            cb();
        });
    });
});

gulp.task("default", ["lint", "build"]);
