# Overview <img src="https://github.com/bew030/hocus-focus/blob/master/extension_images/Wand.png" align="right" height="45"><img src="https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/challenge_photos/000/551/956/datas/full_width.png" align="right" height="45">
_Created by Sebastian Dogaru ([sdogaru@ucsd.edu](sdogaru@ucsd.edu)), Bernard Wong ([bew030@ucsd.edu](bew030@ucsd.edu)), and Neil Tengbumroong ([ntengbum@ucsd.edu](ntengbum@ucsd.edu))_

Hocus Focus is a Google Chrome extension project we made during the SD Hacks 2019 Annual Hackathon. We chose to create something that would help students and wanted to learn more about web applications and extensions, which led us to the idea of creating a study tool that would be easily accessible and minimal at the same time. No one on our team had any previous experience coding with JavaScript, and very limited knowledge of web APIs, HTML, and CSS. The overall coding time was about 36 hours and we are aiming to add this extension to the Chrome marketplace.

The project utilizes Google Chrome's extension API which include storing and retrieving data in its storage cloud, running in the background while the popup is not present, and tab and browsing permissions. The extension's pop up displays information on the timer, study time, and navigation to the settings page. It is contained by its [html file](https://github.com/bew030/hocus-focus/blob/master/popup.html), styled by its [css file](https://github.com/bew030/hocus-focus/blob/master/popup.css), and operated by its [javascript file](https://github.com/bew030/hocus-focus/blob/master/popup.js). The settings/options page contains the website blacklist manager, interactive To-Do List, and additional writing about the chrome extension. It is also contained by its [html file](https://github.com/bew030/hocus-focus/blob/master/options.html), styled by its [css file](https://github.com/bew030/hocus-focus/blob/master/options.css), and operated by its [javascript file](https://github.com/bew030/hocus-focus/blob/master/options.js). The background script is contained in a [javascript file](https://github.com/bew030/hocus-focus/blob/master/background.js) and allows for the timer and other features to be run even while the popup is closed. 

Primary features of Hocus Focus that improve productivity include:
- __A Website Blacklisting Feature__: Adding and removing of specified URLs on top of a given list of URLs that are disallowed by the extension, resulting in an immediately closed tab when the user tries to access it

<p align="center">
	<img src="https://github.com/bew030/hocus-focus/blob/master/readme_images%20/Screen%20Shot%202019-10-27%20at%205.28.16%20AM.png" width=400/>
</p>

- __An Interactive To-Do List__: An interactive to-do list that logs tasks specified by the user in Chrome storage, making it accessible even after the browser is closed

<p align="center">
	<img src="https://github.com/bew030/hocus-focus/blob/master/readme_images%20/Screen%20Shot%202019-10-27%20at%205.28.21%20AM.png" width=400/>
</p>

- __A Performance Stopwatch__: A timer that logs amount of time studied and aggregates this study, activated by a switch that will also prevent the user from accessing time-wasting sites

<p align="center">
	<img src="https://github.com/bew030/hocus-focus/blob/master/readme_images%20/Screen%20Shot%202019-10-27%20at%205.28.40%20AM.png" width=100/>
</p>

We'd like to give a big thank you to SD Hacks and all the sponsors for giving us this amazing opportunity. Please feel free to download and try the extension and if you have any feedback, issues or questions feel free to leave an issue or reach out to any of us by email. 

# Badges 
[![GitHub issues](https://img.shields.io/github/issues/bew030/hocus-focus?color=purple)](https://github.com/bew030/hocus-focus/issues)
[![GitHub forks](https://img.shields.io/github/forks/bew030/hocus-focus?color=orange)](https://github.com/bew030/hocus-focus/network)
[![GitHub stars](https://img.shields.io/github/stars/bew030/hocus-focus)](https://github.com/bew030/hocus-focus/stargazers)
[![HitCount](http://hits.dwyl.io/bew030/hocus-focus.svg)](http://hits.dwyl.io/bew030/hocus-focus)
