orst-vpn
========

[![npm version](https://badge.fury.io/js/orst-vpn.svg)](http://badge.fury.io/js/orst-vpn)

Connect to ORST_VPN3K (Cisco VPN) using vpnc on Node.js.

Installation
------------

First install `vpnc`.  On Linux:

    $ apt-get install vpnc

On OSX:

    $ brew install vpnc

Next, install `orst-vpn`:

    $ npm install orst-vpn

Usage
-----

```javascript
var vpn = require('orst-vpn');

// put your VPN and database settings here
vpn.config = {
    "vpn": {
        "IPSec_ID": "ORST_VPN3K",
        "IPSec_gateway": "sds.oregonstate.edu",
        "IPSec_secret": "GROUP_SECRET_HERE",
        "Xauth_username": "YOUR_USERNAME",
        "Xauth_password": "YOUR_PASSWORD",
        "IKE_Authmode": "psk",
        "IKE_DH_Group": "dh2",
        "DNSUpdate": "no",
        "NAT_Traversal_Mode": "force-natt",
        "Local_Port": 0,
        "Cisco_UDP_Encapsulation_Port": 0
    },
    "db": {
        "user": "YOUR_DB_USERNAME",
        "password": "YOUR_DB_PASSWORD",
        "server": "stewartia.forestry.oregonstate.edu",
        "database": "FSDBDATA",
        "port": "1433",
        "options": {
            "encrypt": false
        }
    }
};

var query = "SELECT TOP 1 * FROM metdat.dbo.phrsc_table2 ORDER BY tmstamp ASC";

vpn.db_query(query, function (results) {
    // do stuff with results of your database query
});
```

Tests
-----

To run tests, first edit `test/config_sample.json` so that it has your VPN's correct settings, then save it as `test/config.json`.

    $ npm test
