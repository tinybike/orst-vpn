#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var vpn = require("../");

vpn.config = require("./config");

describe("Query database over VPN", function () {

    var test = function (t) {
        it("run query: " + t.query, function (done) {
            vpn.db_query(t.query, function (err, results) {
                if (err) {
                    done(err);
                } else {
                    assert.isArray(results);
                    assert.strictEqual(results.length, t.expected);
                    assert.isObject(results[0]);
                    for (var k in results[0]) {
                        if (!results[0].hasOwnProperty(k)) continue;
                        assert.isString(k);
                        assert.isNotNull(results[0][k]);
                    }
                    done();
                }
            });
        });
    };

    test({
        query: "SELECT TOP 1 * FROM metdat.dbo.phrsc_table2 ORDER BY tmstamp ASC",
        expected: 1
    });

});
