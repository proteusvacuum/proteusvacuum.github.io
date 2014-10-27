---
layout: post
title:  "Converting Sony's OMA ATRAC3 files to MP3 (Mac OSX)"
date:   2014-07-13
tag: code
---

A few years ago, my friend undertook a project to document all of his grandmother's stories. This was a long process that took them months, and he ended up with hundreds of hours of audio.
Unfortunately he chose to record everything using a sony recorder, and he transferred everything in Sony's proprietary .oma ATRAC3+ format. This format has DRM protection, and sony locks the files to the computer that you first transfer them to (even if you recorded the file yourself!).
The computer my friend transferred all of these recordings to is now on its last legs, and he isn't able to send the OMA files to any of his family, as they aren't able to play them. He asked me to help him convert all of his files to mp3 so that the rest of his family would be able to access them.

The internet has not been very friendly with tutorials on how to do this, and up until January 2014, it was almost impossible. With this post, I hope to give you an easy step-by-step guide to converting your DRM'd OMA files to MP3 on a Mac (you can probably follow most of these instructions if you are on some flavour of linux, too, just using different packages). DRM is pretty dumb.

Most of these steps use the Terminal, but don't be daunted! I'm assuming an almost zero level of knowledge of the terminal.

## Step 1: Download the newest version of FFMPEG.
FFMPEG is an amazing open source multimedia framework that can among its many amazing virtues, also decode encrypted ATRAC3 files.

If you are running Snow Leopard and above, you can do that here (This file is hosted by ffmpegmac)
If you are running an older mac (Leopard and below), you can do that here

## Step 2: Unzip FFMPEG
In your downloads folder, double-click the file you just downloaded. It will unzip, and you will find a new file in your downloads folder called "ffmpeg".

## Step 3: Prepare your files.
Make a note of where all your OMA files are that you want to convert to MP3. For the benefits of this tutorial, lets put them in a folder on your Desktop called "recordings".
For ease, copy the ffmpeg file that is in your downloads folder into this same folder.

## Step 4: Open Terminal
Open a new Finder window, and go to "Applications", then find the folder called "Utilities". Double click on "Terminal". You will see a window that looks something like this.
Screen Shot 2014-07-13 at 11.42.15 AM

## Step 5: Navigate to the folder with your files in it
We are going to use the "cd" command to get to the folder with all of our OMA files in it. In this example, my files are on my Desktop in a folder called recordings. To get there type:

```
cd ~/Desktop/recordings
```

and hit enter.
Screen Shot 2014-07-13 at 11.45.58 AM
We've now moved into the folder called "recordings" on my Desktop. great!

Now let's see all of the files in that folder so that we can make sure everything went according to plan.
type: ls and hit enter. You will see a list of all the files in that folder, including the file ffmpeg which we copied there earlier. You can see I have one OMA file called "Car stories.oma".

Screen Shot 2014-07-13 at 12.20.24 PMStep 6: Convert your file
Let's start by converting one file. I'm going to convert "Car stories" to MP3.
To do this, we are going to tell ffmpeg to use "Car stories.oma" as an input, and output it to a file called "Car stories.mp3" using the libmp3lame encoder at the highest quality.

```
ffmpeg -i "Car stories.oma" -codec:a libmp3lame -qscale:a 0 "Car stories.mp3"
```

You will obviously replace "Car stories.oma" and "Car stories.mp3" for the name of one of your OMA files. Everything is case-sensitive here, and don't forget to include the quotation marks.

Type in the command above and hit enter.

If everything goes to plan you will see something like the following.

Screen Shot 2014-07-13 at 11.57.14 AM

You will see the "size=" and "time=" parts change as your file is converted to MP3. This might take a little while depending on how long the file is.

Step 7: Take a listen!
Back in finder again, navigate to the recordings folder. You will see a new file: "Car stories.mp3"! You can now play this in iTunes, or whatever media player you like. Don't exit the terminal quite yet.

Step 8: (Advanced) Batch convert files
This is all hunky dory, but my friend had hundreds of files to convert. Neither of us wanted to sit there and write the filename of each one, so I wrote a script to batch process the files.
First, download this file.
Move this file into the recordings folder along with all of your OMA recordings.

Next, we have to allow OSX to run this as an executable.
Back in your terminal, type the following:
chmod a+x batch_convert_oma.sh

Now, run batch_convert_oma.sh, by typing:
./batch_convert_oma.sh

This script finds all of the oma files in your current directory and outputs them as mp3. You might get a warning that one of the files already exists. You safely type "n" (no) for this, as we already converted this file.

You will now have to be patient, as it runs through all your files. When it is done, you will have a folder full of mp3 files!

I hope that was helpful for some people out there. I know my friend's family is quite excited to hear all the stories their grandmother had to tell!