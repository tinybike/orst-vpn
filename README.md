vpnc-orst-vpn3k
===============

Connect to ORST_VPN3K (Cisco VPN) using vpnc on Node.js.

Installation
------------

First install `vpnc`:

    $ apt-get install vpnc

On OSX use `brew install vpnc` instead.  Then clone this repository and navigate to the new directory and do:

    $ npm install

Next, replace the placeholder values in `config_sample.json` with your actual connection info and save the modified file as `config.json`.  Finally, type:

    $ node vpn.js

and watch in amazement as a sample query is run.  Huzzah!
