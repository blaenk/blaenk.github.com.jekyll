---
layout: page
title: "Work"
date: 2012-12-29 00:58
sharing: true
footer: true
---

{::options parse_block_html="true" /}

This is an aggregation of the different work I've done in terms of open source contributions and projects.

## Contributions

#### rtorrent: Fix unportable signal disposition establishment for Solaris {#rtorrent}
{:.collapse}

<div class="collapsible">
The [rtorrent](http://libtorrent.rakshasa.no/) project makes use of signals for certain kinds of inter-thread communication. Certain users on [Solaris](http://en.wikipedia.org/wiki/Solaris_(operating_system)) reported that [rtorrent crashed](https://github.com/rakshasa/rtorrent/issues/51) as soon as signal `SIGUSR1` was delivered. Being an avid reader of the POSIX standards I was curious and felt that I might know what was wrong, figuring that correctly identifying and solving the problem would be a huge testament to the POSIX standards considering I had never used Solaris.

Some people in the issue figured that it must be a non-POSIX compliant implementation of `pthread_kill()` which was preventing the application from sending signals to specific threads. I didn't think this was the case, as Solaris' [manual page](http://docs.oracle.com/cd/E26502_01/html/E29034/pthread-kill-3c.html) for `pthread_kill()` claims that it's implemented as is intended. If it was indeed a non-compliant implementation, I figured someone else would've already encountered the issue and there would be some sort of note in the man page. In fact, Solaris is [fully POSIX-compliant](http://en.wikipedia.org/wiki/POSIX#Fully_POSIX-compliant) which is more than can be said of Linux, and yet Linux didn't exhibit this behavior.

Instead my suspicion was something else entirely. As soon as I recognized that clearly something signal-related was causing crashes on certain platforms in particular, I thought of the one glaring, well-known to be unportable system call: `signal()`. In fact, the Linux [man page](http://man7.org/linux/man-pages/man2/signal.2.html) for `signal()` says:

> The only portable use of `signal()` is to set a signal's disposition to `SIG_DFL` or `SIG_IGN`. The semantics when using `signal()` to establish a signal handler vary across systems (and POSIX.1 explicitly permits this variation); **do not use it for this purpose.**

The emphasis is theirs and goes to show how unpredictable the use of `signal()` could be. To complicate matters, the first line in the man page's notes section says:

> The effects of `signal()` in a multithreaded process are unspecified.

However, I believed that the problem lay in the possibility that Solaris provided different semantics for `signal()` from the semantics that Linux provided:

> In the original UNIX systems, when a handler that was established using `signal()` was invoked by the delivery of a signal, the disposition of the signal would be reset to `SIG_DFL`, and the system did not block delivery of further instances of the signal. [...] This was bad because the signal might be delivered again before the handler had a chance to reestablish itself.  Furthermore, rapid deliveries of the same signal could result in recursive invocations of the handler.

This behavior is known as [System V](http://en.wikipedia.org/wiki/UNIX_System_V) semantics. In other words, when a signal handler is established and then subsequently triggered, the signal disposition is reset to its default disposition, whatever that may be for the signal in question. If the handler isn't re-established, then a subsequent triggering of that signal will be handled based on the default disposition for that signal.

There is another behavior which is referred to as [BSD](http://en.wikipedia.org/wiki/Berkeley_Software_Distribution) semantics in which:

> the signal disposition is not reset, and further instances of the signal are blocked from being delivered while the handler is executing.  Furthermore, certain blocking system calls are automatically restarted if interrupted by a signal handler.

The situation on Linux is such that the kernel's `signal()` system call provides System V semantics. However, glibc 2 and later expose a wrapper function for `signal()` which instead delegates its work to the preferred -- for portability and flexiblity reasons -- system call [`sigaction()`](http://man7.org/linux/man-pages/man2/sigaction.2.html), called in such a way as to provide BSD semantics. This wrapper function is exposed if the `_BSD_SOURCE` [feature test macro](http://man7.org/linux/man-pages/man7/feature_test_macros.7.html) is defined, which it is by default.

Solaris doesn't have such a wrapper for `signal()`, instead exposing its bare, System V semantics system call with [`signal()`](http://docs.oracle.com/cd/E26502_01/html/E29034/signal-3c.html):

> `void (*signal(int sig, void (*disp)(int)))(int);`
> 
> If `signal()` is used, disp is the address of a signal handler, and sig is not `SIGILL`, `SIGTRAP`, or `SIGPWR`, the system first sets the signal's disposition to `SIG_DFL` before executing the signal handler.

This clearly states that the signal disposition is reset to its default disposition before executing the signal handler. Taking a look at the [default signal disposition table](http://docs.oracle.com/cd/E26502_01/html/E29033/signal.h-3head.html) for Solaris, we can see that `SIGUSR1`'s default disposition is to exit the application. Presumably, Solaris users were crashing upon the second delivery of `SIGUSR1` or any other signal established with `signal()` who's default disposition was to exit or abort (core dump).

My [patch](https://github.com/rakshasa/rtorrent/pull/127) simply consisted of switching out calls to `signal()` for purposes of establishing signal handlers with calls to `sigaction()`.
</div>

#### MPC-HC: Fix web UI seeking {#mpc-hc}
{:.collapse}

<div class="collapsible">
I was interested in modifying [MPC-HC](http://mpc-hc.org/) to allow people to watch things in sync with each other, i.e. pause when someone pauses, seek when someone seeks, etc. I pulled the source from github and began looking for a good way to implement this functionality. I found the source for the web UI component of MPC-HC, which essentially provides an interface for which a web UI can be developed to control MPC-HC. I figured I could make use of this and began testing it when a friend noticed that the seeking in the existing web UI didn't work. After finding the relevant code in the MPC-HC source I found that it was a simple problem of failing to URL decode the seek parameter sent from the web UI. I submitted a [patch](https://github.com/mpc-hc/mpc-hc/pull/38) which was ultimately merged in and pushed out in [version 1.6.6](http://mpc-hc.org/changelog/).
</div>

## Projects

#### Pulse Visualizer: Visualizer for PulseAudio in Haskell {#pulse-visualizer}
{:.collapse}

<div class="collapsible">
This was my first Haskell application (aside from exercise solutions to Haskell books). During my final semester of college in 2012, I wanted to do some Independent Study to round out full-time student status. A [professor](http://kevinwortman.com/) agreed to mentor me in two different independent studies: [digital signal processing](http://en.wikipedia.org/wiki/Digital_signal_processing) and [Haskell](http://en.wikipedia.org/wiki/Haskell_(programming_language)). At first I had intended on treating them separately with the goal of writing a music visualizer for iTunes for the DSP study and perhaps a web application for the Haskell study. My professor suggested I try and merge them to make it easier on myself and that is exactly what I did.

I had already gotten a barebones iTunes visualizer up and running with C, so I figured I would write some hooks with the [foreign function interface](http://en.wikipedia.org/wiki/Foreign_function_interface) to delegate most of the work to Haskell. The way of going about this was pretty messy however, as it involved (at the time, and most likely even now) compiling the Haskell code into dynamic link libraries because the Haskell code had to be compiled with gcc, who's symbols differed from the ones Visual Studio produced, which I wanted to use to take advantage of DirectX 11 and DirectCompute.

I managed to get something working, but it felt very messy and quite the abomination: Haskell to DLL with GCC on Windows linked with an iTunes Visualization Plugin DLL produced by MSVC which used DirectX 11. So I decided to instead look around for options to pursue on Linux, where Haskell development felt a lot more natural to me. After looking around for xmms, Banshee, or other bindings -- and finding them lacking, I figured I might as well create a visualizer for a more fundamental thing: [PulseAudio](http://en.wikipedia.org/wiki/PulseAudio) itself.

PulseAudio has a concept of sources (e.g. processes) and sinks (e.g. sound cards). Every sink also has a corresponding source known as a monitor, meaning that the audio going to the associated sink can be intercepted and read. I found a [binding for Haskell](http://hackage.haskell.org/package/pulse-simple) that seemed sufficient enough which allowed me to monitor all of the audio on the system. I then paired this up with OpenGL to draw a pretty basic "frequency bar" visualization. The major benefit of having written it for PulseAudio itself instead of a particular music player or even as a standalone application is that I could then play the audio anywhere, such as YouTube or Pandora, and watch it visualized in my application.

Source is available [on github](https://github.com/blaenk/pulse-visualizer).
</div>

#### Phoenix: Web Interface for rtorrent {#phoenix}
{:.collapse}

<div class="collapsible">
In 2008 I started to used [wTorrent](http://www.wtorrent-project.org/) as an interface to [rtorrent](http://libtorrent.rakshasa.no/). I began to modify it more and more to fit my needs (multi-user environment) and I eventually found myself fighting the existing code base. As a result, and to solidify my understanding of Ruby on Rails, I decided to develop an interface from scratch in Ruby on Rails. That interface was pretty heavy and a bit hackish, so I recently rewrote it, again in Ruby on Rails, to be a little bit lighter.

Even so, it still feels to me that Rails is a bit too heavy for something like this. I was originally developing the latest iteration of this interface with [node.js](http://nodejs.org/), [express.js](http://expressjs.com/), and [backbone.js](http://documentcloud.github.io/backbone/) on the front-end. I was taking too long using these frameworks so I ended up going back to Ruby on Rails. I believe this is in part due to the seeming neutrality of these frameworks, which don't impose upon you a file structure or specific software architecture (such as [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)), leaving you to devise these things on your own. As a result I kept getting distracted refining various aspects of the application.

So I went back to Ruby on Rails for this iteration of the interface. One way in which I compensated for this was avoiding the use of a heavy relational database management system such as [PostgreSQL](http://www.postgresql.org/), instead only using [SQLite](http://www.sqlite.org/) for user accounts and other minor things. Torrent metadata is stored as [Base64](http://en.wikipedia.org/wiki/Base64)-encoded [JSON](http://en.wikipedia.org/wiki/JSON) within torrents using the rtorrent [XML-RPC](http://en.wikipedia.org/wiki/XML-RPC) API. This way when torrents are removed, their pertinent data is also removed. It uses Coffeescript and bootstrap on the front-end.

This interface tends to be a sort of rite of passage for me when learning a language or framework. Perhaps in the future I may rewrite it yet again in something even lighter such as Ruby and [Sinatra](http://www.sinatrarb.com/), Python and [Flask](http://flask.pocoo.org/), or Haskell and [Scotty](http://www.ittc.ku.edu/csdl/fpg/software/scotty.html).
</div>

#### WP-reCAPTCHA: Official reCAPTCHA plug-in for WordPress {#wp-recaptcha}
{:.collapse}

<div class="collapsible">
Back in 2007 I found out about [reCAPTCHA](http://www.google.com/recaptcha), a project started at [Carnegie Mellon University](http://en.wikipedia.org/wiki/Carnegie_Mellon_University) in part by the original creator of the [CAPTCHA](http://en.wikipedia.org/wiki/CAPTCHA). I'd bet by now most people have used and are familiar with reCAPTCHA. CAPTCHAs generally consist of random letters and numbers to test if someone was a human or an automated program (usually with intent to spam). reCAPTCHA's innovation was to use actual words, words that had failed automatic digitizing when scanning mass amounts of books and using [Optical Character Recognition](http://en.wikipedia.org/wiki/Optical_character_recognition) software.

The consequence of this was that programs couldn't be written, using computer vision techniques, to simply read the image of the word, since industry-grade Optical Character Recognition software --presumably employing the most bleeding edge and sophisticated computer vision techniques -- had already failed to digitize the words. This way, two problems were solved with reCAPTCHA: it was foolproof against automated attacks and circumvention, and users came to realize that by solving reCAPTCHA challenges they were helping to digitize books and thus was not a waste of time as solving randomly generated CAPTCHAs was.

I also found out about a service they had called [MailHide](http://en.wikipedia.org/wiki/ReCAPTCHA#Derivative_projects) in which they would hide part of an email address away from spammers. The full email address could be retrieved by solving a reCAPTCHA challenge, effectively preventing automated programs from harvesting email addresses for the purposes of spamming them.

That same year (2007) I figured it would be neat to write a plugin for [WordPress](http://wordpress.org/) which automatically hid any email address in a WordPress site using the MailHide technique. It gained some attention, and the then lead engineer of reCAPTCHA, Ben Maurer, contacted me via email asking if I'd be interested in volunteering to work on the then official reCAPTCHA WordPress plugin, with MailHide integrated. I accepted and worked on the plugin for a few years over which it has gotten [over 400,000 downloads](http://wordpress.org/extend/plugins/wp-recaptcha/stats/).

reCAPTCHA was acquired by Google in 2009, and the original team seems to have largely left the project. I stopped using WordPress and as a result development of the plugin halted. The plugin is open source, however, and available [on github](http://github.com/blaenk/wp-recaptcha).
</div>

#### The Instagib Project: Standalone Instagib game based on Quake 3 engine (id Tech 3) {#the-instagib-project}
{:.collapse}

<div class="collapsible">
For the longest time, my favorite competitive game was a particular kind of instagib mod for the [Jedi Outcast](http://en.wikipedia.org/wiki/Star_Wars_Jedi_Knight_II:_Jedi_Outcast) (JO) and [Jedi Academy](http://en.wikipedia.org/wiki/Star_Wars_Jedi_Knight:_Jedi_Academy) (JA, the sequel) games called [disruption instagib](http://archives.thejediacademy.net/index.php/Disruption). I mainly played this on Jedi Outcast which was the older one of the two, because the server I preferred to play on in Jedi Academy shut down but one still existed in Jedi Outcast (somehow). Given that this was a pretty niche mod in a pretty old game (considering Jedi Academy had already been released), I wished to somehow make it available to more people.

Both of these games used the Quake 3 engine ([id Tech 3](http://en.wikipedia.org/wiki/Id_Tech_3)), so when the Quake 3 source code was released under the GPL and the source was cleaned up and optimized by the [ioquake3](http://ioquake3.org) project, I decided to try to port the mod and the feel of JO/JA into a standalone mod. The reason for wanting to make it into a standalone game was because although instagib mods have been around for a very long time for pretty much any game, they tend to be relegated to just that: mods. As a result, you have a variety of different flavors of instagib, who's play-style is determined by the game for which it is a mod. This is fine, but it has the effect of fragmenting the instagib community. As a result, there are usually few servers available.

So in 2006-2007 I decided to develop a standalone Instagib game. The game used art assets from the OpenArena project with custom UI and other assets designed by two of my friends. The game had team-colored rail shots and rail jumping was implemented, aside from traditional instagib mechanics. I had written a custom [NSIS](http://nsis.sourceforge.net/Main_Page) installer script to generate an installer binary for Windows. I also had Linux tarballs and Mac OS X application bundles. Aside from this, I had developed a build and deployment system with Python, which allowed people to have the latest versions of binaries and art assets.

 I ultimately abandoned the project as I became distracted by other projects. The source used to be on a self-hosted subversion server back when it was actively developed. I intend to push the source to github in the near future.

Recently, however -- as a result of Disney [shutting down](http://en.wikipedia.org/wiki/LucasArts#Acquisition_by_Disney_and_closure_of_the_development_arm) LucasArts -- [Raven Software](http://en.wikipedia.org/wiki/Raven_Software), the creators of Jedi Outcast and Jedi Academy, decided to release the source code to both games under the GPL. I look forward to developing a canonical disruption instagib mod again.
</div>

#### Musicaster: Homemade last.fm {#musicaster}
{:.collapse}

<div class="collapsible">
This was an application I wrote back in 2006-2007 which was a combination of client-side C# and server-side PHP. The application was basically similar to [last.fm](http://last.fm), in which a client-side application scans popular media players for the currently playing song and then transmitted to a server-side endpoint for aggregation. The client-side C# application was written with modularity in mind, so that one would simply implement an interface, generate a DLL, and place it in the same directory as the executable to add support for more players. I added such plugins for iTunes, Windows Media Player, and Winamp. Information about the currently playing song was then sent to an endpoint of the user's choosing. At the time I also wrote a WordPress plugin which displayed this information in a blog's description text (usually under the blog title/name).

After I had done all this, one of the friends I showed it to said, "Oh, so it's like last.fm?" I had never heard of last.fm before this and the whole time I had thought I had created something quite innovative.
</div>

#### MyPod: iPod music navigator and retriever {#mypod}
{:.collapse}

<div class="collapsible">
This was my first C# application which I wrote back in 2006-2007. I created it in response to an instance in which I wanted to back-up some of the music I had transferred to my iPod. The application understood the file structure of the iPod back then, which consisted of several nested directories each storing about four audio files with seemingly randomly generated names. MyPod simply walked this file structure and used [TagLib](http://taglib.github.io/) to expose the actual file information to the user in a data list. The user then specified which files they wanted to back up and were then transferred to a location and naming template (i.e. artist - title) of their choosing.
</div>