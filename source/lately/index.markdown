---
layout: page
title: "Lately"
date: 2012-12-28 23:19
updated: 2013-04-24 19:40
comments: true
footer: true
---

{% include post/date.html %}

* Table of Contents
{:toc}

This page lists some of the things I've been up to lately, updated {{ updated }}.

### Currently Working On

* An audio player, though it'll ultimately be used for something else other than general audio playback. I'm decoding audio frames using [ffmpeg](http://www.ffmpeg.org/)'s libavcodec, libavformat, libavutil, and libswresample. Playback is currently done using [PulseAudio](http://www.freedesktop.org/wiki/Software/PulseAudio) although I intend to switch to a cross-platform library like [PortAudio](http://www.portaudio.com/). It works with any format/container/codec supported by ffmpeg. Source will be up soon.

### Planning to Work On

* A disruption instagib mod for the now-open source Jedi Academy. This will be the spiritual successor to [The Instagib Project](/work#the-instagib-project), which was an attempt at creating a standalone instagib game. Ultimately I found myself really missing many things from the Jedi Outcast and Jedi Academy games, primarily force powers which were a form of built-in "hacks," mainly force sight which allowed one to view other players' glow through walls and dodge shots in "Matrix style," and force speed which greatly increased someones movement speed (**+** bunny hopping meant insanely fast speeds).

	I'm following the development of [OpenJK](https://github.com/Razish/OpenJK) which appears to be the canonical distribution of patched and optimized Jedi Outcast/Academy -- similar to [ioquake3](http://ioquake3.org/) which I used for The Instagib Project. Once the project matures a bit, I'll begin development of an instagib mod and hopefully try to revive the instagib scene in these games, which have always left me wanting in games ever since it died down many years ago.

### Currently Reading

* [The Art of Debugging with GDB, DDD, and Eclipse](http://amzn.com/1593271743): Another great book by No Starch Press, publishers of TLPI (mentioned below). I unfortunately never really spent the time to really understand how to use debuggers, in this case [GDB](http://www.gnu.org/software/gdb/). I knew enough to get by, but it always seemed a little archaic or very complicated, instead opting for so-called "printf debugging," in which one simply adds a bunch of print statements to find the source of various problems. This, I've come to realize, is an exercise in masochism. Really learning the various tools available to one through a debugger is enlightening.
* [The Linux Programming Inteface](http://amzn.com/1593272200): This book is amazing. It concerns the userspace API of Linux. It probably should be named "The POSIX Programming Inteface" because although it focuses on Linux, it's always very clear about which topics apply to which standards, treating Linux-specific funcitonality more like edge-cases within the POSIX ecosystem. This is perhaps a reasonable approach, considering that Linux is not POSIX compliant. The reverse approach would probably lessen the scope of material of which the majority probably applies to many other systems anyways, not just Linux. It's one of my favorite books currently on my shelf.
	* Currently on Chapter 38: Writing Secure Privileged Programs

### Currently Studying

* [Machine Learning](https://class.coursera.org/ml-2012-002/lecture/index): Having completed the edX UC Berkeley [CS 188](http://edx.org/ai) class on Artificial Intelligence, I'm now going through the [Machine Learning](https://class.coursera.org/ml-2012-002/lecture/index) class by Stanford on coursera. My goal is to apply Machine Learning concepts to Digital Signal Processing, such as for [onset detection](http://www.cs.usc.edu/research/08-895.pdf).
* [Parallel Programming with GPUs](https://www.udacity.com/course/cs344): I'm dedicating myself to the [Introduction to Parallel Programming](https://www.udacity.com/course/cs344) class on [udacity](https://www.udacity.com). It teaches GPGPU programming using [CUDA](http://en.wikipedia.org/wiki/CUDA).

*[GPGPU]: General Purpose GPU
