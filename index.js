#!/usr/bin/env node
/**
 * Connect to ORST_VPN3K using vpnc.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var vpnc = require("vpnc");
var db = require("mssql");
var log = console.log;

function stringify(o) {
    if (o !== undefined && o !== null) {
        if (o.constructor === Object || o.constructor === Array) {
            return JSON.stringify(o, null, 2);
        } else {
            return o.toString();
        }
    }
}

function is_function(f) {
    return Object.prototype.toString.call(f) === "[object Function]";
}

var vpn = {

    config: {},

    vpnc: vpnc,

    db: db,

    disconnect: function () {
        this.vpnc.disconnect(function (err, code) {
            if (err) {
                console.error("Error disconnecting VPN:", err);
            } else {
                if (this.config.debug) log("VPN disconnected [" + code + "]");
            }
        });
    },

    connect: function (cb) {
        var self = this;
        this.vpnc.available(function (err, version) {
            if (err) {
                if (is_function(cb)) {
                    return cb(err);
                } else {
                    return console.error("vpnc unavailable:", err);
                }
            }
            if (self.config.debug) log("Found vpnc:", stringify(version));
            self.vpnc.connect(self.config.vpn, function (err, code) {
                if (self.config.debug) log("VPN connected [" + code + "]");
                if (err) {
                    if (is_function(cb)) {
                        return cb(err);
                    } else {
                        return console.error("Error connecting VPN:", err);
                    }
                }
                if (is_function(cb)) {
                    try {
                        cb();
                    } catch (ex) {
                        cb(ex);
                    }
                }
            });
        });
    },

    // connect to vpn, connect to database, run a single query, disconnect
    db_query: function (query, cb) {
        var self = this;

        try {
            this.connect(function () {

                // connect to MSSQL database
                var conn = new db.Connection(self.config.db, function (err) {
                    if (err) throw err;

                    // query database and fetch results
                    conn.request().query(query, function (err, results) {
                        if (err) throw err;

                        if (is_function(cb)) {
                            if (self.config.debug) log(stringify(results));
                            cb(null, results);
                        } else {
                            log("No callback provided, printing results...");
                            log(stringify(results));
                        }

                        // disconnect from vpn
                        self.disconnect();
                    });
                });

                conn.on("error", function (err) {
                    if (err) {
                        self.disconnect();
                        if (is_function(cb)) {
                            cb(err);
                        } else {
                            console.error("Database error:", err);
                        }
                    }
                });

            });

        } catch (ex) {
            if (is_function(cb)) {
                cb(ex);
            } else {
                console.error("VPN connection error:", ex);
            }
        }
    }

};

process.on("exit", function (code) { if (code) vpn.disconnect(); });

module.exports = vpn;
