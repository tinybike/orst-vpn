#!/usr/bin/env node

"use strict";

var vpnc = require("vpnc");
var chalk = require("chalk");
var db = require("mssql");
var config = require("./config");
var log = console.log;

/* uncomment the next line to use sheldon.forestry.oregonstate.edu */
// config.db.server = "sheldon.forestry.oregonstate.edu";

function stringify(o) {
    if (o !== undefined && o !== null) {
        if (o.constructor === Object || o.constructor === Array) {
            return JSON.stringify(o, null, 2);
        } else {
            return o.toString();
        }
    }
}

var vpn = {

    doStuff: function () {
        var self = this;
    
        /* insert commands you want to carry out while connected to the vpn here */

        var conn = new db.Connection(config.db, function (err) {
            if (err) throw err;

            /* insert sql queries here! */

            var query = "SELECT TOP 1 * FROM metdat.dbo.phrsc_table2 ORDER BY tmstamp ASC";
            var request = conn.request();
            request.query(query, function (err, recordset) {
                if (err) throw err;
                log(chalk.cyan(stringify(recordset)));
                self.disconnect();
            });
        });

        conn.on("error", function (err) {
            if (err) log("Database error:", err);
        });
    },

    disconnect: function () {
        vpnc.disconnect(function (err, code) {
            if (err) {
                log("Error disconnecting VPN:", err);
            } else {
                log("VPN", chalk.yellow("disconnected [" + code + "]"));
                // uncomment next line to quit Node automatically on disconnect
                // process.exit(0);
            }
        });
    },

    connect: function () {
        var self = this;
        vpnc.connect(config.vpn, function (err, code) {
            if (err) {
                log("Error connecting VPN:", err);
            } else {
                try {
                    self.doStuff();
                } catch (ex) {
                    log("Couldn't do stuff. Are you connected to the VPN?");
                    self.disconnect();
                }
            }
        });
    }
};

vpnc.available(function (err, version) {
    if (err) {
        log("vpnc unavailable:", err);
    } else {
        log("Found vpnc:", chalk.gray(stringify(version)));
        vpn.connect();
    }
});

process.on("exit", function (code) { if (code) vpn.disconnect(); });

module.exports = vpn;
