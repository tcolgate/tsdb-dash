Polymer('dash-tsdb-dataset', {
         spec: undefined,
          end: undefined,
        start: undefined,
      samples: undefined,
     grouptag: undefined,
      observe: {
                     spec: "validate",
                      end: "validate",
                    start: "validate",
                  samples: "validate",
                 grouptag: "validate"
               },
     validate: function(){

                 var dsi,ds;
                 var tperpix;

                 var alltags = [];
                 if(this.spec.hasOwnProperty("tags")){
                   alltags = this.spec.tags;
                 }
                 if(this.spec.hasOwnProperty("grouptag") && this.spec.grouptag){
                   alltags.push(this.spec.grouptag + "=*");
                 }

                 for(dsi in this.spec.dss){
                   if(this.spec.dss.hasOwnProperty(dsi)){
                     ds = this.spec.dss[dsi];
                     if(!ds.hasOwnProperty("rate")){
                       ds.rate = false;
                     }
      
                     if(ds.hasOwnProperty("tags")){
                       ds.tags = alltags.concat(ds.tags);
                     } else {
                       ds.tags = alltags;
                     };

                     if(!ds.hasOwnProperty("aggrOp")){
                       ds.aggrOp = "sum";
                     };

                     if(!ds.hasOwnProperty("dsmpOp")){
                       ds.dsmpOp = "sum";
                     };
                     
                     tperpix = Math.ceil(((this.end.valueOf() - this.start.valueOf()) / this.samples) / 1000);
                     if (tperpix < 15) {
                       tperpix = 15;
                     };
                     ds.dsmp = "" + tperpix + "s-" + ds.dsmpOp
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
                     if(!resmap[t].hasOwnProperty(dssi)){
                       resmap[t][dssi] = [];
                     }
                     resmap[t][dssi].push(data[di]);
                   }
                 }
                 console.log("data: ",data);
                 console.log("resmap: ",resmap);

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
                 console.log("resultset: ",this.resultset);
               },
      created: function(){
                 this.tags = [];
                 this.resultset = [];
               }
});
