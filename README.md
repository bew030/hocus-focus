# Overview
_Created by Sebastian Dogaru ([sdogaru@ucsd.edu](sdogaru@ucsd.edu)), Bernard Wong ([bew030@ucsd.edu](bew030@ucsd.edu)), and Neil Tengbumroong ([ntengbum@ucsd.edu](ntengbum@ucsd.edu))_

Hocus Focus is a Google Chrome extension project we made during the SD Hacks 2019 Annual Hackathon. We chose to create something that would help students and wanted to learn more about web applications and extensions, which led us to the idea of creating a study tool that would be easily accessible and minimal at the same time. No one on our team had any previous experience coding with JavaScript, and very limited knowledge of web APIs, HTML, and CSS. The overall coding time was about 36 hours and we are aiming to add this extension to the Chrome marketplace.

The project utilizes Google Chrome's extension API which include storing and retrieving data in its storage cloud, running in the background while the popup is not present, and tab and browsing permissions. The extension's popup is contained in popup.html, backed by popup.css for styling and popup.js for functionality. Options.html contains the full implementation of the program, including the website blacklist and to-do list. 

Primary features of Hocus Focus that improve productivity include:
- __A Website Blacklisting Feature__: Adding and removing of specified URLs on top of a given list of URLs that are disallowed by the extension, resulting in an immediately closed tab when the user tries to access it
- __An Interactive To-Do List__: An interactive to-do list that logs tasks specified by the user in Chrome storage, making it accessible even after the browser is closed
- __A Performance Stopwatch__: A timer that logs amount of time studied and aggregates this study, activated by a switch that will also prevent the user from accessing time-wasting sites

Created by Sebastian Dogaru, Bernard Wong, and Neil Tengbumroong
