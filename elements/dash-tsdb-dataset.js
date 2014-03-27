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
     validate: function(){

                 var dsi,ds,alltags;
                 for(dsi in this.spec.dss){
                   if(this.spec.dss.hasOwnProperty(dsi)){
                     ds = this.spec.dss[dsi];
                     if(ds.hasOwnProperty("rate")){
                       ds.raterate = false;
                     }
      
                     alltags = this.tags;
                     if(this.spec.hasOwnProperty("grouptag")){
                       alltags.push(this.spec.grouptag + "=*");
                     }
                     if(ds.hasOwnProperty("tags")){
                       ds.tags = alltags.concat(ds.tags);
                     } else {
                       ds.tags = alltags;
                     }
                   }
                 }

                 this.specData = this.spec;
               },
  gotDsResult: function(ev){
                 var data = ev.detail;
                 var gtag;
                 var resmap = [];
                 var dssi = ev.srcElement.attributes.dsi.value;
                 var di, t;
                 var ri, ent,found,rs,n;

                 if(this.spec.hasOwnProperty("grouptag")){
                   gtag = this.spec.grouptag;
                 }

                 for( di in data){
                   if(data.hasOwnProperty(di)){
                     t = "";
                     if( gtag !== undefined ){
                       t = data[di].tags[gtag];
                     }
                     if(!resmap.hasOwnProperty(t)){
                       resmap[t] = [];
                     }
                     resmap[t][dssi] = data[di];
                   }
                 }

                 for(ri in resmap){
                   if(resmap.hasOwnProperty(ri)){
                     ent = {};
                     ent.name = ri;
                     ent.data = resmap[ri][dssi];
                     found = false;

                     for( rs in this.resultset ){
                       if(this.resultset.hasOwnProperty(rs)){
                         if(this.resultset[rs].name === ent.name){
                           found = true;
                           this.resultset[rs].data[dssi] = ent.data;
                           break;
                         }
                       }
                     }

                     if(!found){
                       n = {};
                       n.name = ent.name;
                       n.data = [];
                       n.data[dssi] = ent.data;
                       this.resultset.push(n);
                     }
                   }
                 }
               },
      created: function(){
                 this.tags = [];
                 this.resultset = [];
               }
});
