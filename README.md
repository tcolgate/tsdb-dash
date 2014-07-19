This is a pure JavaScript implementation of a dashboard for 
OpenTSDB.

We make use of
  moment.js
  Polymer
  NVD3

## Install

To install, simply move this directory into the "static" directory of your
OpenTSDB install. You should then be able to access it at: http://tsdbhost:4242/s/dash/index.html. Alternatively
host it elsewhere, and make sure tsdb is configured to serve the appropriate CORS headers.

## Setup 

A TSDB tree is needed on the server side. Make sure you have tree processing enabled. I used the following settings:

```
tsd.core.meta.enable_realtime_uid = true
tsd.core.meta.enable_tracking = true
tsd.core.meta.enable_realtime_ts = true
tsd.core.tree.enable_processing = true
```

The tree can be created as follows:

```sh
curl -X POST 'http://localhost:4242/api/tree?name=DashByHosts'
#curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=1&order=0&type=TAGK&field=dc&description=Location'
curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=2&order=0&type=TAGK&field=host&description=Host'
curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=3&order=0&type=METRIC&description=Metric'
curl -X PUT 'http://localhost:4242/api/tree?treeid=1&strict_match=true'
curl -X PUT 'http://localhost:4242/api/tree?treeid=1&enabled=true'
```

It should look as follows

```json
{
   "treeId" : 1,
   "name" : "",
   "rules" : {
      "1" : {
         "0" : {
            "treeId" : 1,
            "customField" : "",
            "displayFormat" : "",
            "description" : "Location",
            "regexGroupIdx" : 0,
            "level" : 1,
            "regex" : "",
            "separator" : "",
            "notes" : "",
            "order" : 0,
            "type" : "TAGK",
            "field" : "dc"
         }
      },
      "3" : {
         "0" : {
            "treeId" : 1,
            "customField" : "",
            "displayFormat" : "",
            "description" : "Metric",
            "regexGroupIdx" : 0,
            "level" : 3,
            "regex" : "",
            "separator" : "",
            "notes" : "",
            "order" : 0,
            "type" : "METRIC",
            "field" : ""
         }
      },
      "2" : {
         "0" : {
            "treeId" : 1,
            "customField" : "",
            "displayFormat" : "",
            "description" : "Host",
            "regexGroupIdx" : 0,
            "level" : 2,
            "regex" : "",
            "separator" : "",
            "notes" : "",
            "order" : 0,
            "type" : "TAGK",
            "field" : "host"
         }
      }
   },
   "description" : "",
   "created" : 1390663587,
   "storeFailures" : false,
   "notes" : "",
   "strictMatch" : false,
   "enabled" : true
}
```

If you have had tsdb running with tree processing enabled, or have only just added the above tree, you
will probably need to do a a metasyc and treesync. The following should work, but can take quite a while

```
# /usr/share/opentsdb/bin/tsdb metasync
# /usr/share/opentsdb/bin/tsdb treesync
```
