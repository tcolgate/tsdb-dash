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
  gotDsResult: function(ev){
                 var data = ev.detail;
                 var gtag = undefined;
                 var resmap = new Array();
                 var dssi = ev.srcElement.attributes.dsi.value;

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
                   resmap[t][dssi] = data[di];
                 };

                 for(ri in resmap){
                   var ent = new Object();
                   ent.name = ri;
                   ent.data = resmap[ri][dssi];
                   var found = false;

                   for( rs in this.resultset ){
                     if(this.resultset[rs].name === ent.name){
                       found = true;
                       this.resultset[rs].data[dssi] = ent.data;
                       break;
                     };
                   };

                   if(!found){
                     var n = new Object();
                     n.name = ent.name;
                     n.data = new Array();
                     n.data[dssi] = ent.data;
                     this.resultset.push(n);
                   };
                 };
               },
        ready: function(){
                 this.tags = [];
                 this.resultset = new Array();
               }
});
