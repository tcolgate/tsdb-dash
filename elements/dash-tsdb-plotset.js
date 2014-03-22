Polymer('dash-tsdb-plotset', {
    width: 600,
   height: 400,
     spec: undefined,
      end: undefined,
    start: undefined,
  gotSpec: function(ev,resp){
             var data = resp.response;

             for(dsi in data.dss){
               var ds = data.dss[dsi];
               if(ds.hasOwnProperty("rate")){
                 ds['rate'] = false;
               };

               var alltags = this.tags;
               if(ds.hasOwnProperty("tags")){
                 ds['tags'] = alltags.concat(ds['tags']);
               } else {
                 ds['tags'] = alltags;
               }
             };

             this.specData = data;
           },
    ready: function(){
             this.tags = [];
           }
});
