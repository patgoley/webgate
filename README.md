webgate is a simple tool that can block and unblock websites by editing your /etc/hosts file.

Installation:

`npm install -g webgate`

Usage:

`sudo webgate block twitter.com www.facebook.com`

`sudo webgate unblock twitter.com www.facebook.com`

webgate requires sudo to edit /etc/hosts. This also prevents tampering by non-sudoers.

You can list as many host arguments as you'd like.

Note:

This tool is easily circumvented by using a proxy server and is provided without warranty. I mainly use it to kill distractions.