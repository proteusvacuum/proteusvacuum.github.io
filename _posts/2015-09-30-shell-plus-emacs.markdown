---
layout: post
title:  "How to run django shell in emacs"
date:   2015-09-30
tag: code
---

python-mode comes with a really nice python shell interpreter which you can send code snippets to using M-x python-shell-send-region. However, when working in a django project it would be even more useful to have this run in a django shell.

You can easily change the interpreter that the python shell interpreter uses in Emacs by adding the following snippet to your .emacs file:

```el
(setq python-shell-interpreter "python"
      python-shell-interpreter-args "-i /absolute/path/to/manage.py shell_plus")
```

Now when you invoke any of the python shell commands, it will open using the django shell. (In this case, I am using shell_plus from the [django_extensions](https://github.com/django-extensions/django-extensions) utility, you can also replace this with `shell` if you don't have that installed)

Now, you can send buffers, regions, files, etc. directly to the django shell right from emacs! Fun!

![image](/assets/images/emacs_python_shell.png)
