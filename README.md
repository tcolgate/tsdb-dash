This is a pure JavaScript implelemtation of a dashboard for 
opentsdb.

We make use of
  jQuery
  simple-dtpicker
  flot 
  moment

A TSDB tree is needed on the server side.

It can be created as follows....

<code sh>
curl -X POST 'http://localhost:4242/api/tree?name=DashByHosts'
curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=1&order=0&type=TAGK&field=dc&description=Location'
curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=2&order=0&type=TAGK&field=host&description=Host'
curl -X POST 'http://localhost:4242/api/tree/rule?treeid=1&level=3&order=0&type=METRIC&description=Metric'
curl -X PUT 'http://localhost:4242/api/tree?treeid=1&strict_match=true'
curl -X PUT 'http://localhost:4242/api/tree?treeid=1&enabled=true'
</code>

It shoudl look as follows

<code json>
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
</code>
