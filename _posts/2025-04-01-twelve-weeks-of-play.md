---
layout: post
title: Twelve weeks of play
date: 2025-04-01
tags: recurse
---
I just finished my three month stint at the [Recurse Center](https://www.recurse.com) (RC), which I can safely say was one of the most personally fulfilling and joyful experiences I've had in a long time. RC is a place where you work at the edge of your abilities, pair program with some extremely smart and caring people, take time for personal introspection and share your knowledge with each other by "learning generously". 

I [joined RC]({% post_url 2025-01-05-recurse %}) to try and more intentionally work on things that spark a sense of wonder and joy. I wanted to better understand what it means to be a programmer, but also what it means to share my successes and failures with others. I wanted to see what it would feel like to emulate my children and view the world through a "beginners mind". 

I spent most of the retreat working from my home in rural Quebec, but I was fortunate to be able to visit the hub for the first and last weeks of my batch. I think this was the right balance for me, as I was able to fully concentrate on the work I was doing, but also got to make some real connections with my other batch mates. RC makes it very easy for this hybrid set-up, and for that I am very grateful. 

In January when I started this journey I had made some very specific goals for my time at RC. While I didn't end up working on these exact things, the spirit of them lived through the work I *did* do. Thanks to the wonderful people in my batch who pushed and encouraged me! 

Here is a non-exhaustive list of the things I worked on, vaguely in the order of how proud I am of each project. I hope to write more about each one, and will link to my documentation as I go. 

# Robotics
Towards the end of my batch, I built an [SO-ARM100](https://github.com/TheRobotStudio/SO-ARM100), and had a ton of fun getting it to do different things with the help of many other recursers. 

The SO-ARM100 is a pair of robot arms. One is a "leader" which has an end effector that can be held by a human hand. The other is the "follower" whose end effector is a pincer. 

Normally, you would set it up such that the leader controls the follower (for example, to train an imitation learning algorithm), but that felt a little constraining to me. I decided to play with how the leader could be used as an input device to the computer, and how the follower could just do anything I asked it to, when asked nicely.

To do this, I re-wrote the [SDK](https://github.com/proteusvacuum/feetech-servo-rs/tree/main) for the motors in Rust which allowed me to do all manner of fun things.

- Got the follower arm to play the piano. The other neural networks in my household had a blast:

	<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/h6EogDTjiHE?si=5ufRZYJK5bdWMOMg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

	<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/wJ3EiZsR4sY?si=47V1IOfBjSoxUFjJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

- Used the leader arm as an input device for a MIDI instrument
- Connected both the leader and follower arm to websockets
	- Used the leader arm as an input device for a 3D torus and a really cool [Perlin-Lissajous-Poisson](https://codepen.io/rwhaling/pen/ZYERPdY) demo
	- Connected the leader and follower arms together over a network so the leader arm could control the follower remotely.
	- You can also do all three of these things at once!

		<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/chnH9EnOcE0?si=-LjW7WKwbGdsvjqk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

- Using the LeRobot framework, I learned how to create a [dataset](https://huggingface.co/spaces/lerobot/visualize_dataset?dataset=provac%2Fso100_test&episode=1) and train it remotely using GPUs from [Lightning.ai](https://lightning.ai/farid/). 

# Rust

One of my batch goals was to get a more in-depth knowledge of C++. After reading the third chapter of Stroustrup's "A tour of C++", which introduces a module system which I just couldn't get working after a few hours of trying to re-compile the C++ standard library, I decided that I might get more joy out of learning a more modern language with fewer warts. 

I jumped head-first into learning rust, and *really* enjoyed it. The tooling was a joy to use, and the community seems full of interesting and kind people.

Most of my batch coding time was spent writing Rust.

- Wrote an [SDK for the STS3215](https://github.com/proteusvacuum/feetech-servo-rs/tree/main) servo motor in Rust (for use in the SO-ARM100, above)
- Wrote a [neural network from scratch](https://github.com/proteusvacuum/rust-neural-network), with no dependencies
	- I learned that there is a reason that no one writes gradient descent by hand...
- Completed the [Codecrafters Git Challenge](https://github.com/proteusvacuum/codecrafters-git-rust)
	- Less than 10% of people who attempt this succeed; I'm proud of this!
- Completed the base stages of the [Codecrafters Redis Challenge](https://github.com/proteusvacuum/codecrafters-redis-rust)
- Tried to get Rust to run on the [Arduino Uno R4]({% post_url 2025-01-21-impossible-day %})
	- I didn't succeed, but I learned a ton about ELF files and rust's hardware abstraction layer crates.
- Got a stepper motor working on the Arduino Uno R3 in Rust
- Started but dropped writing a "scroll distance tracker" and a "what clothes should I wear based on the weather" app.
- Built [Tic-Tac-Toe](https://github.com/proteusvacuum/recurse/tree/main/tictactoe) in Rust
- Read the Brown version of the [Rust book](https://rust-book.cs.brown.edu/)
- Attended the weekly rust learning group, where we mob programmed and discussed the chapters in the book. 

I'm now going to focus on learning more embedded and async rust as it was a real joy to work on.

# Machine Learning / AI

One of my batch goals was to understand how machine learning works at a deeper level.

- I took the fast.ai [deep learning course](https://course.fast.ai/), and participated in a study group around this
- Wrote a neural network from scratch with no dependencies, in Rust.
	- This was part of "Impossible Day", where you spend a day trying to tackle a problem that is impossible for you. I took more than one day, but managed to get my neural network to work with the MNIST numbers dataset. 
- Trained [a model to identify mushrooms](https://huggingface.co/spaces/provac/mushrooms)
	- This was based on a custom dataset I created from iNaturalist. Some of my [contributions to iNaturalist](https://www.inaturalist.org/observations?user_id=provac&verifiable=any&iconic_taxa=Fungi) were part of the dataset, which made this even more fun. 
- I tried out "Vibe Coding", and built a bilingual phoneme-based learning to read [app](https://faridrener.com/phonemes/). 
	- I didn't write a single line of code to make that exist, but did have many arguments with Claude about the best phonemes to include. 

# Misc

- I designed and built an [ISS tracker](https://github.com/proteusvacuum/arduino-orbital-tracker), which runs on an Arduino and points at the ISS as it flies around the earth. 
- I made a contribution to MITM proxy, after I found a bug in how they were handling escaped characters. The [Issue](https://github.com/mitmproxy/mitmproxy/issues/7517), and my subsequent [PR](https://github.com/mitmproxy/mitmproxy/pull/7520).
- I solved 35 leetcode-style problems in both Rust and Python. I think I even ended up having fun doing them by the end!

# Presentations
I gave four presentations. Two of these were remote, and two were while I was in the hub in person. They were fun, and people had great things to say!

- First forays into WebAssembly
- Tracking the International Space Station with an Arduino ([slides](https://docs.google.com/presentation/d/1eSMNbq3xha7Dn_MWOG8YcZIRLGK4tG6EqDDPEWFavR4/edit#slide=id.p))
- Building a Lego sorting robot 
- Writing the Feetech motor SDK in Rust

# Pairing Sessions

I participated in probably 20 pairing sessions with other recursers. Here is a list of some of the things I worked on:

- [Million things](https://github.com/proteusvacuum/recurse/blob/main/million-things.py)
- [Mastermind](https://github.com/proteusvacuum/recurse/blob/main/mastermind.py) 
- [Ratatui widget](https://github.com/nkaradzhov/ratatui-multiselect-list)
- A smoothing function for giving out a fair number of bittorrent peers
- Rock Paper Scissors in Rust
- Added positive affirmations to the Dynamic display on the RC 5th floor
- Getting Elm to print out a shuffled list of random integers
- Worked on adding multiplayer support to an online Azul game
- Async programming with maelstrom in Rust (4 times!)
- Codecrafters Shell implementation in Rust
- Fixing a bug with implicit returns in a toy C compiler
- Getting strings out of CodeMirror in [Roodle](https://roodlegame.com/)
- Fixing the ordering of blocks in a Rust blockchain implementation
- "Vibe coded" an app to add things to a Tesco shopping basket
- Made 3D printable QR codes in P5.js, as part of [QR Show](https://qrshow.nyc/)
- 2 leetcode problems

# Reflections

In all I had a great time, learned a lot, and met a lot of excellent people! 