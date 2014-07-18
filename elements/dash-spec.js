Polymer('dash-spec', {
   specName: undefined,
       spec: undefined, 
    gotSpec: function(ev,resp){
               var data = resp.response;
               var s = {
                     "title": "",
                     "units": "",
                      "fill": 0,
                 "linewidth": 1,
                       "log": false,
                   "logbase": 10,
                    "format": "%.2s%c",
                     "stack": false,
                       "dss": [],
                      "ytag": undefined,
                  "grouptag": undefined
               };

               var dsi,ds,alltags;
               for(dsi in data.dss){
                 if(data.dss.hasOwnProperty(dsi)){
                   ds = data.dss[dsi];
                   if(!ds.hasOwnProperty("rate")){
                     ds.rate = false;
                   };
                   if(!ds.hasOwnProperty("rateCtrl")){
                     ds.rateCtrl = false;
                   };
                   alltags = this.globaltags;
                   if(ds.hasOwnProperty("tags")){
                     ds.tags = alltags.concat(ds.tags);
                   } else {
                     ds.tags = alltags;
                   }
                 }
               };

               s.title = data.title;
               s.dss = data.dss;

               if(data.units){
                 s.units = data.units;
               }

               if(data.fill){
                 s.fill = data.fill;
               }

               if(data.linewidth){
                 s.linewidth = data.linewidth;
               }

               if(data.log){
                 s.log = data.log;
               }

               if(data.logbase){
                 s.logbase = data.logbase;
               }

               if(data.format){
                 s.format = data.format;
               }

               if(data.grouptag){
                 s.grouptag = data.grouptag;
               }

               if(data.ytag){
                 s.ytag = data.ytag;
               }

               if(data.stack){
                 s.stack = data.stack;
               }

               this.spec = s;
             },
    changed: function(){
               this.globaltags = [];
             }
});
