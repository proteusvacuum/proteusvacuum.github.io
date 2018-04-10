---
layout: post
title:  "Installing the Softlayer SSL VPN client on Ubuntu with systemd"
date:   2018-04-10
tag: code
---

# Installing the Softlayer SSL VPN client on Ubuntu with systemd

At [Dimagi](https://www.dimagi.com), we were having trouble installing Softlayer's VPN client using the instructions on their [site](https://knowledgelayer.softlayer.com/procedure/ssl-vpn-linux), as there were issues with systemd not having an `rc.local` file by default. When trying to install the client, we got the error `"Auto start script file was not found in system!"`.

Here are the steps we took to install the latest version of the MotionPro client I validated works on Ubuntu 17.10 and 16.04.

```bash
# Download the latest MotionPro client

$ wget http://speedtest.dal05.softlayer.com/array/ArrayNetworksL3VPN_LINUX.zip
$ unzip ArrayNetworksL3VPN_LINUX.zip
$ chmod +x MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh

# Install the client
$ sudo ./MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh

# If you are using systemd, you might not have /etc/rc.local file, and you will get an error that says "Auto start script file was not found in system!"
# Make an empty one. systemd will know what to do with it
# https://askubuntu.com/a/919598

$ printf '%s\n' '#!/bin/bash' 'exit 0' | sudo tee -a /etc/rc.local
$ sudo chmod +x /etc/rc.local

# Try installing again
$ sudo ./MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh

# Open the client
$ MotionPro

Click "Profile" then "Add".
Fill out the settings as per your specific VPN setup.

Verify everything worked

$ ping www.google.com
$ ping {machine on your vpn}
```

