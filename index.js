#!/usr/bin/env node

"use strict";

var cp = require("child_process");
var vpnc = require("vpnc");
var chalk = require("chalk");
var config = require("./vpn.json");
var log = console.log;

var sql = "select top 1 * from metdat.dbo.phrsc_table2 order by tmstamp asc";

function disconnect() {
    vpnc.disconnect(function (err, code) {
        if (err) {
            log("Error disconnecting VPN:", err);
        } else {
            log("VPN", chalk.yellow("disconnected [" + code + "]"));
        }
    });
}

function connect() {
    vpnc.connect(config, function (err, code) {
        if (err) {
            log("Error connecting VPN:", err);
        } else {

            // did we connect to the VPN successfully?
            // (check for tun0, tun1, etc. using ifconfig)
            cp.exec("ifconfig tun", function (err, stdout) {
                if (err) {
                    log(chalk.red.bold("Unable to connect to VPN"));
                    disconnect();
                }
                log("VPN", chalk.cyan("connected [" + code + "]"));
                log(chalk.green(stdout));
                disconnect();
            });
        }
    });
}

vpnc.available(function (err, version) {
    if (err) {
        log("vpnc unavailable:", err);
    } else {
        log("Found vpnc:", chalk.gray(JSON.stringify(version, null, 2)));
        connect();
    }
});

process.on("exit", function () { disconnect(); });
