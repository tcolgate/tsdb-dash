// 1. Load Polymer before any code that touches the DOM.
var script = document.createElement("script");
script.src = "/base/bower_components/platform/platform.js";
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("script");
script.src = "/base/bower_components/jquery/dist/jquery.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("script");
script.innerHTML = "jQuery.noConflict();";
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("script");
script.src = "/base/bower_components/polymer/polymer.js";
document.getElementsByTagName("head")[0].appendChild(script);

// 2. Load component(s)
var link = document.createElement("link");
link.rel = "import";
link.href = "/base/elements/dash-app.html";
document.getElementsByTagName("head")[0].appendChild(link);

link = document.createElement("link");
link.rel = "import";
link.href = "/base/elements/dash-view-host.html";
document.getElementsByTagName("head")[0].appendChild(link);

// Delay Jasmine specs until WebComponentsReady
beforeEach(function(){
  waitsFor(function(){
    if (typeof(CustomElements) == 'undefined') return false;
    return CustomElements.ready;
  });
});
