Polymer('dash-spec', {
  specNname: undefined,
       spec: undefined, 
    gotSpec: function(ev,resp){
               var data = resp.response;

               var dsi,ds,alltags;
               for(dsi in data.dss){
                 if(data.dss.hasOwnProperty(dsi)){
                   ds = data.dss[dsi];
                   if(ds.hasOwnProperty("rate")){
                     ds.rate = false;
                   }

                   alltags = this.globaltags;
                   if(ds.hasOwnProperty("tags")){
                     ds.tags = alltags.concat(ds.tags);
                   } else {
                     ds.tags = alltags;
                   }
                 }
               }
               this.spec = data;
             },
      ready: function(){
               this.globaltags = [];
             }
});
