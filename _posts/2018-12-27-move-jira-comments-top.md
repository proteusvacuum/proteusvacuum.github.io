---
layout: post
title:  "How to move the JIRA new comments box above other comments"
date:   2018-12-27
tag: code
---

# How to move the JIRA new comments box above other comments

We recently migrated to JIRA from FogBugz to track our work and bugs at [Dimagi](https://www.dimagi.com). One thing that I immediately was frustrated by was the fact that to add a new comment to an issue, you had to scroll all the way to the end of the discussion - even if the comments were sorted with the newest comment first.

I wrote a very simple Tampermonkey / Greasemonkey userscript to move the comments box to the top. 

```js
// ==UserScript==
// @name         JIRA top comments box
// @namespace    dimagi
// @version      0.1
// @description  Moves the JIRA comments box to the top
// @author       Farid Rener
// @match        https://*.atlassian.net/browse/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var issuePanel = document.getElementsByClassName('issuePanelWrapper')[0],
        commentsNode = document.getElementById('addcomment');
    issuePanel.parentNode.insertBefore(commentsNode, issuePanel);
})();
```

If you already have [Tampermonkey](https://tampermonkey.net/) installed, you can click [here](https://github.com/dimagi/commcarehq-scripts/raw/master/browser-scripts/jira_top_comments.user.js) to install it automatically. 

It looks like this:

![image](/assets/images/JIRA-comment.png)
