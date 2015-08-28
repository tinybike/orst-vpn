#!/usr/bin/env python
"""A post-interview present for Fox :)"""
import os
import json
import subprocess
import pymssql
from contextlib import contextmanager

HERE = os.path.dirname(os.path.realpath(__file__))

def do_stuff(cursor):

    ######################
    # YOUR LOGIC HERE :) #
    ######################

    query = "SELECT TOP 1 * FROM metdat.dbo.phrsc_table2 ORDER BY tmstamp ASC"
    cursor.execute(query)
    for row in cursor:
        print row

def vpn_connect(config):

    # create properly formatted vpnc config file
    tempfile = os.path.join(HERE, "tempvpnc.conf")
    with open(tempfile, "w+") as f:
        print >> f, (
            "IPSec gateway %(IPSec_gateway)s\n"
            "IPSec ID %(IPSec_ID)s\n"
            "IPSec secret %(IPSec_secret)s\n"
            "IKE Authmode %(IKE_Authmode)s\n"
            "Xauth username %(Xauth_username)s\n"
            "Xauth password %(Xauth_password)s"
        ) % config

    # move config file to /etc/vpnc
    subprocess.check_call(["sudo", "mv", tempfile, "/etc/vpnc/"])
    subprocess.check_call(["sudo", "chown", "root:root", "/etc/vpnc/tempvpnc.conf"])
    subprocess.check_call(["sudo", "chmod", "600", "/etc/vpnc/tempvpnc.conf"])

    # connect to vpnc
    subprocess.check_call(["sudo", "vpnc", "tempvpnc"], env=os.environ)    

def vpn_disconnect():

    # disconnect from vpnc
    subprocess.check_call(["sudo", "vpnc-disconnect"])

    # remove the generated config file
    subprocess.check_call(["sudo", "rm", "/etc/vpnc/tempvpnc.conf"])

@contextmanager
def vpnc(config):
    vpn_connect(config)
    yield
    vpn_disconnect()

def main():
    with open(os.path.join(HERE, "config.json")) as configfile:
        config = json.load(configfile)
    with vpnc(config["vpn"]):
        db_params = {
            "server": config["db"]["server"] + ":" + config["db"]["port"],
            "user": config["db"]["user"],
            "password": config["db"]["password"],
            "database": config["db"]["database"],
        }
        with pymssql.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                do_stuff(cursor)

if __name__ == "__main__":
    main()
