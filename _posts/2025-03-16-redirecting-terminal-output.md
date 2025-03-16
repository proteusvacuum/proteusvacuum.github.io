---
layout: post
title: Redirecting Terminal Output
date: 2025-03-16
tags:
  - recurse
  - til
---
While reading about trying to get [Rust to run in a REPL](https://github.com/sigmaSd/IRust?tab=readme-ov-file#faq), I learned that you can send messages between terminals by redirecting to `/dev/pts/{num}`. 

For example:
```bash
echo "hello from 1" 1>/dev/pts/2
```

Will print "hello from 1" to your second open terminal.

![](/assets/images/output.gif)

You can use this to redirect stderr to a different open terminal if, for example, you have a lot of stdout messages being printed in your original terminal window, or if you are running a TUI application.