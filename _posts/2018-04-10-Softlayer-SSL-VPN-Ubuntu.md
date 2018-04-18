---
layout: post
title:  "Installing the MotionPro Softlayer SSL VPN client on Ubuntu with systemd"
date:   2018-04-10
tag: code
---

# Installing the MotionPro Softlayer SSL VPN client on Ubuntu with systemd

At [Dimagi](https://www.dimagi.com), we were having trouble installing Softlayer's VPN client using the instructions on their [site](https://knowledgelayer.softlayer.com/procedure/ssl-vpn-linux), as there were issues with systemd not having an `rc.local` file by default. 

When trying to install the client, we got the error `"Auto start script file was not found in system!"`. Using the MotionPro client provided by Softlayer constantly disconnected us when connected to wifi. You'll need to use the latest version of the client provided by ArrayNetworks instead of the one listed on Softlayer's site.

Here are the steps we took to install the latest version of the MotionPro client. I validated that this works on Ubuntu 17.10 and 16.04.

### Download the latest MotionPro client (the one that Softlayer provides is old and does not work)
```sh
$ wget https://support.arraynetworks.net/prx/001/http/supportportal.arraynetworks.net/downloads/motionpro/Linux/Ubuntu/20171228/MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh
$ chmod +x MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh
```

### Install the client
```sh
$ sudo ./MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh
```

### Enable rc.local if needed
```sh
# If you are using systemd, you might not have /etc/rc.local file, and you will get an error that says "Auto start script file was not found in system!"
# Make an empty one. systemd will know what to do with it
# <https://askubuntu\.com/a/919598>

$ printf '%s\n' '#!/bin/bash' 'exit 0' | sudo tee -a /etc/rc.local
$ sudo chmod +x /etc/rc.local

# Try installing again
$ sudo ./MotionPro_Linux_Ubuntu_x86-64_1.1.1.sh
```

### Open the client
```sh
$ MotionPro
```

Click "Profile" then "Add".
Fill out the settings as per your specific VPN setup.

### Verify everything worked.
```sh
$ ping www.google.com
$ ping {machine on your vpn}
```

Some of the Softlayer servers are flaky, so you can try accessing a different one [here](https://www.softlayer.com/VPN-Access).


### Uninstalling the MotionPro client on Ubuntu

```sh
$ cd /opt/MotionPro
$ sudo ./install.sh -u
```
