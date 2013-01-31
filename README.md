opentsdb-dash
=============

This is the start of a project to have some prettier graphs.

The sample.html file contains the plumbing to create a web page that contains a nice graph for a given metric, with dropdowns to select from groups of servers.

The server definitions are located in json files which are loaded on demand. Everything can be hosted on the opentsdb server itself in the static root of opentsdb's built-in webserver as it's all javascript driven.

As it stands, you'll need to create one html file for each metric (editing the javascript to take into account the variables you'll want to extract). It's not currently very easy to use, just dropping it here as a starting point.

File would be dropped in /usr/share/opentsdb/static

Then hit http://localhost:4242/s/sample.html

Sample:

![alt text](https://github.com/marksteele/opentsdb-dash/raw/master/screenshot.png "Screenshot")
