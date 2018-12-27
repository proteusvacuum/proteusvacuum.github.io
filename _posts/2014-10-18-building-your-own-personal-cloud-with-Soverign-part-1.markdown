---
layout: post
title:  "Building your own personal cloud with Sovereign"
date:   2014-10-18 21:23:48
tag: code
---

![piggies][1]

Google owns all my data. All my email is centralized through one Gmail account, I store a bunch of my stuff on Google Drive, I carry my Android phone around with me everywhere, I put all my thoughts, lists, notes, in Google Keep, I put all my events in my Google Calendar, the only chat service I use is Google Hangouts... 

While all of these products are pretty awesome, work well together, and have become something of a "standard", Google hasn't invented anything new. All of the services that Google offers are extensions of tools that already existed - Google has just integrated them, and put a nice UI on top of them (and has also started moving away from the open standards, further locking people in to their products). There are a bunch of F/OSS alternatives to the Google ecosystem, all of which work really well, are Free, and are constantly being developed by some amazing people. However, assembling and configuring a whole suite of tools like this would probably take months. Luckily, there are some awesome folks who have compiled an excellent set of Ansible playbooks, called [**Sovereign**][46] that does all the heavy lifting for you. This is a series of two posts which will outline how to set up this system on a cloud server (explaining what each part does), then how to set up all the software on your home machine to take advantage of it all.

This probably isn't NSA proof. Everything is encrypted, and if you do things right, will probably be quite immune to many types of attack, however, you know. 

Before setting up this project, I had never done any system adminstration past hosting a few wordpress or small web apps, so this was a learning experience. I'm pretty much of the philosophy that you need to break stuff in order to understand how it works, so, while following these instructions, try to keep breaking things to see what they do. There are a lot of great resources on the issues page of the github repository, that should be your first stopping point if you run into any problems.

These posts are basically meant as an additional "guide for dummies" to the already in-depth how-to written up on the Sovereign github page, [here][2].

Let me start by saying that you will end up paying ~$10 a month for server time, $10/year for a domain name and ~$100/year for a wildcard ssl certificate (I'll explain what all of this is later, this is also optional depending on how you want to use your server). This comes to about $20/month or 3.33 beers/month (@ $6/beer). I decided that was a pretty good deal to be in control of all of my data, and for services that I use every day, pretty much all day. Also, a great learning opportunity in sysadmin, etc. It took me about a week to get all set up. 

My assumptions here:

*   You are running on a Mac.
*   You have some experience with the terminal
*   You own a domain name

## Step 0. Read through the sovereign docs [HERE][3].

By using Sovereign, you will be getting a bunch of tools that you already use everyday along with a bunch of stuff you never knew you were missing. Email, Cloud storage, VPN, RSS Feed Reader, etc. There are a bunch of things that I don’t personally use (IRC bouncer, Tarsnap backups). 

## Step 1. Sign up for a VPS host

VPS stands for "Virtual Private Server". When you sign up for service at one of these, you are basically renting a computer at a datacenter somewhere. I chose Linode as they came highly recommended.  If you choose Linode, (and you find this writeup helpful), please use [this referral link ][41].

Select the Linode plan that you want. I selected the Linode 1024. Then select the location that is nearest to you.

Now click "Deploy a Linux distribution", and choose Debian 7.6 (you can actually choose whatever you want, but most of the packages we are using have been configured for Debian 7. There is also a lot more support in the github issues for Sovereign of people using Debian 7). Enter a root password. Choosing a good password is important. You may even wish to use the [diceware][42] method.

Now click "Boot". You now have a computer in the cloud, all to yourself! Rejoice!

## Step 2. SSH into your VPS to prepare it for Sovereign.

(Note, there are some things that you will be doing on your own computer. Make sure to remember when you are logged in to your remote box, and when you are working on your home machine.)

Click the "Remote Access" tab in Linode to get the IP address of your box. Open up a Terminal, and ssh into your box.

```bash
$ ssh root@your_ip
```
    

Now that we are logged in to our box, let's make sure we're all up to date.

```bash
# apt-get update && apt-get upgrade
```
    

We are going to add a new user to allow ansible to log in to our machine and install the things that it needs.

```bash
# useradd deploy
# passwd deploy
# mkdir /home/deploy
# mkdir /home/deploy/.ssh
# chmod 700 /home/deploy/.ssh
# chown deploy:deploy /home/deploy -R
```

Add your public key to this server so that ansible doesn't ask us for a password every time. Open a new Terminal window. **On your machine**, check if you have a public key

```bash
$ ls -al ~/.ssh
```
    

Make sure there is an id_rsa.pub. If there isn't, generate one by following [these instructions][43] (you don't need to do the github specific parts.) On your machine:

```bash
$ scp id_rsa.pub deploy@YOUR_VPS_IP_ADDRESS:~/.ssh/authorized_keys
```
    

(then enter the password that you gave the deploy user)

Back on the linode:

```bash
# chmod 400 /home/deploy/.ssh/authorized_keys
```
    

You can check that it worked by trying to ssh into your box with the deploy user (in a new terminal window) - you shouldn't be asked for a password.

Now, allow deploy to use passwordless sudo. On the linode:

```bash
# visudo
```
    

At the bottom of this file, add the line

```bash
deploy  ALL=(ALL) NOPASSWD: ALL
```
    

(Control-X to exit -- save your changes).

Rejoice more! Our server is all ready!

## Step 3. Download Sovereign & Ansible.

Make sure you have homebrew installed, then 

```bash
$ brew update
$ brew install ansible
```

Go clone or download the [github repository][2]. You will be editing a bunch of these files, and adding things to the `roles` folder of some of the utilities. 

Sovereign is a set of ansible playbooks, which basically runs a bunch of commands on your VPS to install, set up, and run the services you want. These tasks are a bunch of yaml files in the roles folder.

## Step 4. Get some certificates.

SSL certificates, in short, are what give your browser the little safety lock when you visit a secure website. After buying one, I feel like the system is completely broken.

The SSL certificate (on your server) tells a client's browser that they are indeed talking to the server that they think they are. These certificates are sold by certificate authorities (CA's). Your browser contains a list of CA's that it trusts to verify the identity of a server. The process to obtain a key is pretty simple: You generate a Certificate Signing Request (CSR), which contains information about your server (its URL, your email, etc.). The CA will then generate and sign a certificate saying that you are the owner of this server, and send it to you by email. You will pay them a lot of money for this.

The SSL certificate also acts as the public key to encrypt the data between your browser and your server. This is good, as it prevents anyone who intercepts your traffic from reading it. Learn more about public-key cryptography on [wikipedia][44].

You can choose to generate your own SSL certificate, however, any browser that visits your site will complain that it cannot be trusted. If you are going to be using your sovereign set-up purely for yourself, this isn't a problem (you'll just have to add a security exception to your browser to stop it from complaining). However, if you are going to be sending people to your site (e.g. sharing links through ownCloud, or whatever else), you may wish to buy a certificate. It is totally possible to generate your own to start out, then switch it with a signed / purchased certificate at a later date.

### 4a. Generate your own key
On your machine, navigate to the directory where you put sovereign

```bash
$ cd ~/sovereign-master
$ openssl req -nodes -newkey rsa:2048 -keyout roles/common/files/wildcard_private.key -out mycert.csr
```
You will be asked a bunch of questions, which you should answer.
When you are asked for your "Common Name", enter the domain name you will be pointing to your host. 

```bash
$ openssl x509 -req -days 365 -in mycert.csr -signkey roles/common/files/wildcard_private.key -out roles/common/files/wildcard_public_cert.crt
$ cp roles/common/files/wildcard_public_cert.crt roles/common/files/wildcard_ca.pem
```

### 4b. Go buy a key
You can also buy a key from somewhere. I'll let you figure that out. When you receive it,  place the certificate you receive in `roles/common/files/wildcard_public_cert.crt` and the combined certificate in `roles/common/files/wildcard_ca.pem`.

If you are sent a zip file with multiple keys, copy and paste the intermediate and root certificate into one file and save it as `roles/common/files/wildcard_ca.pem`. Make sure to put a line break between each certificate in this file. 

## 5. Set up all your usernames / passwords, etc.
Open `vars/user.yml` in a text editor. Fill out all the elements that read *TODO*. Don't change the things in {{}} as these are placeholders. If you don't know what something does, go read the sovereign readme before continuing.

To generate the password hashes for email and IRC, follow the instructions in the sovereign [readme][45]. These are important to get right, otherwise you won't be able to log in to your email. 

You will end up setting up a single main email address `main_user_name@domain.com`. 
You can add extra virtual email addresses that will get sent to your main address by adding to the `mail_virtual_aliases` section. Don't remove any of the virtual addresses that are already there, as they are used by different system processes to send you messages. 

### 5 a. Set up the hosts file
Open the file named `hosts` in the root directory. 
Delete the contents of that file, and replace it with the IP address of your VPS. In here, you are telling ansible which machine it should connect to and do its thing. 

# 6. Run it!
Once everything is to your liking, take a stab at running the playbooks:

```bash
$ ansible-playbook -i ./hosts site.yml
```

This might take a while! (~30 minutes the first time. You might also receive an email from Linode saying that there is a lot of disk activity, that's fine.) 

# 7. DNS! 

Go look at the sovereign [readme][45] again. Follow the instructions of adding each of the A records, the MX records, etc.

The important part is to set up DKIM and SPF properly, as these will help your emails pass spam tests. 

### 7 a. DKIM
ssh in to your server as root.

```bash
$ ssh root@your_ip
```
Now, copy the contents of `/etc/opendkim/keys/EXAMPLE.COM/default.txt`
The easiest way of doing this is:

```bash
# vim `/etc/opendkim/keys/EXAMPLE.COM/default.txt`
```

You will get something like: 

```
default._domainkey IN TXT "v=DKIM1; k=rsa; p=adslkfjacansdliacALKJ+Cbg0M97fADtn/VN79+n/zNh3/N/Cnalsdlkfjalkcnalskdc/cIPPKS/6sH8m5O7uLcCpb2ObMj2lav4NZ28GSOovt2nWbzL69aQIDAQAB" ; ----- DKIM key default for EXAMPLE.com
```

We are only interested in the parts between the quotation marks: 
```
v=DKIM1; k=rsa; p=adslkfjacansdliacALKJ+Cbg0M97fADtn/VN79+n/zNh3/N/Cnalsdlkfjalkcnalskdc/cIPPKS/6sH8m5O7uLcCpb2ObMj2lav4NZ28GSOovt2nWbzL69aQIDAQAB
```

Copy and paste that into a new TXT record in Linode's DNS manager. Give it the name default._domainkey.

### 7 b. SPF

Now, generate an SPF record. The easiest way I found of doing this is with [Microsoft's SPF record wizard][http://www.microsoft.com/mscorp/safety/content/technologies/senderid/wizard/default.aspx].

You will end up with something that looks like:

```
v=spf1 a mx ptr ip4:your_ip mx:mail.EXAMPLE.com ~all
```

Paste that into a new TXT record. You can leave the name blank. 

### 7 c. Reverse DNS
Go to your Linode dashboard. 
Remote Access -> Reverse DNS -> Enter your domain name and click save. 

In the next post, where I'll describe how to do client set up, we will make sure that this is all working well. 

# 8. 2-Factor Authentication! 
The playbooks install google-auth on your server, which gives you 2-factor authentication when you try to ssh in with the user you set up. 

First, go download a 2-factor mobile app. On my android, I use [FreeOTP][https://fedorahosted.org/freeotp/], which has both a android and iOS apps. 

Once the playbooks have finished running, you should find in /tmp/sovereign-google-auth-files (on your machine) a file with 5 codes that you can use. If these aren't here (which happened to me at some point), ssh in to your box

```bash
$ ssh deploy@your_ip
$ sudo nano /home/YOUR_USERNAME/.google-authenticator
```
You will see 5 2-factor codes there, which you will be able to use the next time you ssh in as your own user. Do that now.

```bash
$ ssh your_username@your_ip
```
enter one of the 2-factor codes, and then your password.

```bash
$ google-authenticator
```
Answer the questions. You should now see a QR code appear on the screen. Add this to FreeOTP. You will use this next time you want to ssh in to your server, to get new 2-FA codes. 

# 9. Go outside.

That's the server set-up done. In the next post, I'll describe how to get the client configuration all done. 

**NOTE! If you ever restart your server, you will have to run the playbooks again in order to mount the encrypted drive. If you don't, pretty much nothing will work, as the data each piece needs is encrypted!**


 [1]: https://blog.faridrener.com/wp-content/uploads/2014/09/Pigs.png
 [2]: https://github.com/al3x/sovereign
 [3]: https://github.com/al3x/sovereign/blob/master/README.textile
 [4]: https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
 [5]: http://dovecot.org/
 [6]: https://lucene.apache.org/solr/
 [7]: https://en.wikipedia.org/wiki/Post_Office_Protocol
 [8]: https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
 [9]: https://en.wikipedia.org/wiki/DNSBL
 [10]: http://www.roundcube.net/
 [11]: http://z-push.sourceforge.net/soswp/index.php?pages_id=1&t=home
 [12]: https://developer.mozilla.org/en-US/docs/Mozilla/Thunderbird/Autoconfiguration
 [13]: http://www.postgresql.org/
 [14]: http://dspam.sourceforge.net/
 [15]: http://postgrey.schweikert.ch/
 [16]: http://www.opendkim.org/
 [17]: http://www.arg0.net/encfs
 [18]: http://xmpp.org/
 [19]: http://prosody.im/
 [20]: http://owncloud.org/
 [21]: http://collectd.org/
 [22]: http://mosh.mit.edu
 [23]: http://htop.sourceforge.net
 [24]: http://www.fail2ban.org/
 [25]: http://rkhunter.sourceforge.net
 [26]: http://tools.ietf.org/html/rfc6238
 [27]: http://en.wikipedia.org/wiki/Google_Authenticator
 [28]: https://www.tarsnap.com/
 [29]: http://selfoss.aditu.de/
 [30]: https://en.wikipedia.org/wiki/CalDAV
 [31]: https://en.wikipedia.org/wiki/CardDAV
 [32]: http://openvpn.net/index.php/open-source.html
 [33]: http://wiki.znc.in/ZNC
 [34]: http://mmonit.com/monit/
 [35]: https://www.apache.org/
 [36]: https://wiki.ubuntu.com/UncomplicatedFirewall "ufw"
 [37]: http://newebe.org
 [38]: https://www.wallabag.org/
 [39]: http://git.zx2c4.com/cgit/about/
 [40]: https://github.com/sitaramc/gitolite
 [41]: https://www.linode.com/?r=fc552c9354892f62efe9dd3a4aa8024bcd9b6ca6
 [42]: http://world.std.com/~reinhold/diceware.html
 [43]: https://help.github.com/articles/generating-ssh-keys/
 [44]: https://en.wikipedia.org/wiki/Public-key_cryptography
 [45]: https://github.com/al3x/sovereign#4-configure-your-installation
 [46]: https://github.com/al3x/sovereign
