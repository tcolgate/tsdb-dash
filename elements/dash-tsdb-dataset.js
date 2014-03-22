Polymer('dash-tsdb-dataset', {
         spec: undefined,
          end: undefined,
        start: undefined,
     grouptag: undefined,
      observe: {
                     spec: "validate",
                      end: "validate",
                    start: "validate",
                 grouptag: "validate"
               },
     validate: function(oldv,newv){

                 for(dsi in this.spec.dss){
                   var ds = this.spec.dss[dsi];
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

                 this.specData = this.spec;
               },
    gotResult: function(ev){
                 console.log(ev);
                 this.results.push(ev);
               },
        ready: function(){
                 this.tags = [];
                 this.results = [];
               }
});
