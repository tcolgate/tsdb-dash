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
                   if(this.spec.hasOwnProperty("grouptag")){
                     alltags.push(this.spec.grouptag + "=*");
                   };
                   if(ds.hasOwnProperty("tags")){
                     ds['tags'] = alltags.concat(ds['tags']);
                   } else {
                     ds['tags'] = alltags;
                   }
                 };

                 this.specData = this.spec;
               },
    gotResult: function(ev){
                 var data = ev.detail;
                 var gtag = undefined;
                 var resmap = new Array();

                 if(this.spec.hasOwnProperty("grouptag")){
                   gtag = this.spec.grouptag;
                 };

                 for( di in data){
                   var t = "";
                   if( gtag != undefined ){
                     t = data[di].tags[gtag];
                   };
                   if(!resmap.hasOwnProperty(t)){
                     resmap[t] = new Array();
                   };
                   resmap[t].push(data[di]);
                 };

                 for(ri in resmap){
                   var entry = new Array();
                   entry.name = ri;
                   entry.data = resmap[ri];
                   var found = false;

                   for(rs in this.resultset){
                     if(this.resultset[rs].name === entry.name){
                       found = true;
                       this.resultset[rs].data.concat(entry.data);
                       break;
                     }
                   };
                   if(!found){
                     this.resultset.push(entry);
                   };
                 };
               },
        ready: function(){
                 this.tags = [];
                 this.resultset = new Array();
               }
});
