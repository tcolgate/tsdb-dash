Polymer('dash-tsdb-plot', {
    width: 600,
   height: 400,
     spec: undefined,
     name: undefined,
     data: undefined,
  observe: {
             spec: "render",
             name: "render",
             data: "render"
           },
   render: function(){

             var series = [];
             var d, ds, dps, dp, s, v, vs, t; 
             var cur, min, max, sum, avg;
             var di, ddi;

             var ticks;

             var transform = function(x){return x;};

             var tickformatter = 
               (function(fmt,lgb){
                 return function (val) {
                   var ret = gprintf(fmt,lgb,'.',val);
                   return ret;
                 };
               })(this.spec.format,this.spec.logbase);


             console.log("plotdata: ", this.data);
             for(di in this.data){
               if(this.data.hasOwnProperty(di)){
                 for(ddi in this.data[di]){
                   if(this.data[di].hasOwnProperty(ddi)){
                     s = {};
                     vs = [];
                     d = this.data[di][ddi];
                     ds = this.spec.dss[di];
                     dps = d.dps;
                     cur = 0;
                     min = 1/0;
                     max = 0;
                     sum = 0;
     
                     if (!this.spec.ytag){
                       if (ds.hasOwnProperty("label")){
                         s.label = ds.label;
                       } else {
                         s.label = d.metric;
                       }
                     } else {
                       if (ds.hasOwnProperty("labelmap")){
                         if (ds.labelmap.hasOwnProperty(d.tags[this.spec.ytag])){
                           s.label = ds.labelmap[d.tags[this.spec.ytag]];
                         } else {
                           s.label = d.tags[this.spec.ytag];
                         }
                       } else {
                         s.label = d.tags[this.spec.ytag];
                       }
                     }

                     for (t in dps) {
                       if(dps.hasOwnProperty(t)){
                         v = [];
                         dp = dps[t];
                         v[0] = parseInt(t,10) * 1000 ;
                         v[1] = dp;
                         cur = dp;
                         if(dp < min){min = dp;};
                         if(dp > max){max = dp;};
                         sum += dp;
       
                         vs.push(v);
                       }
                     }
                     avg = sum / vs.length;
       
                     s.data = vs;
                     s.cur = cur;
                     s.min = min;
                     s.max = max;
                     s.sum = sum;
                     s.avg = avg;
      
                     s.label = s.label
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',cur) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',min) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',avg) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',max) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',sum) + "</td></tr><tr>"; 

                     series.push(s);
                   }
                 };
               }
             }

 
             if(ds.hasOwnProperty("log") && ds.log){
               transform = 
                 (function(lgb){
                   return function(v){return Math.log(v) / Math.log(lgb);};
                 })(ds.logbase);
               ticks = 
                 (function(lgb,tkf){
                   return function(axis) {
                     var res = [];
                     var mx = Math.ceil(Math.log(axis.max) / Math.log(lgb));
                     var i = 0;
                     var vl, txt;

                     do {
                       vl  = Math.pow(lgb,i);
                       txt = tkf(vl, axis);
                       res.push([vl,txt]);
                       ++i;
                     } while (i < mx);
 
                     return res;
                   };})(ds.logbase,tickformatter);
             }

             var leg = { show: true, position: "sw" };
             leg.container = this.$.legend;
             leg.noColumns = 6;

             var flotspec = {
               xaxis: { mode: "time", show: true },
             
               yaxes: [{
                 position: 'left',
                   axisLabel: ds.ylabel,
                   color: "#00000000",
                   transform: transform,
                   ticks: ticks,
                   tickFormatter: tickformatter
               }],

               grid: { hoverable: true, autoHighlight: false },
               legend: leg,
               selection: { mode: "x" },
               series: {
                 stack: ds.stack,
                 lines: { fill: ds.fill, show: true , lineWidth: ds.linewidth},
                 shadowSize: 0
               }
             };

             $.plot(
               this.$.plot,
               series,
               flotspec
             );

             $(this.$.plot).bind("plotselected", this.intPlotSelect.bind(this));

             /*
             if(that.onselect){
               this.$.plot.bind("plotselected", that.onselect);
             }
              */
             
             /*

             //this.$.legend 
             //t.allgraphs[gid].legend['container'] = legcont;
             //that.allgraphs[gid].legend['noColumns'] = 6;
 
 
            $.plot(
               this.$.plot,
               this.data,
               {
                 xaxis: { mode: "time", show: true },
               
                 yaxes: [{
                     position: 'left',
                     axisLabel: this.spec.ylabel,
                     color: "#00000000",
                     transform: transform,
                     ticks: ticks,
                     tickFormatter: tickformatter
                 }],
                 grid: { hoverable: true, autoHighlight: false },
                 legend: this.legend,
                 selection: { mode: "x" },
                 series: {
                   stack: this.soec.soec.stack,
                   lines: { fill: this.spec.fill, show: true , lineWidth: this.spec.linewidth},
                   shadowSize: 0
                 }
               }
             );
 
             // Populate the table columns
             var table = this.legend.children()[0];
             var row = table.insertRow(0);
             //unused var cell1 = row.insertCell(0);
             //vunused ar cell2 = row.insertCell(1);
             var cell3 = row.insertCell(2);
             var cell4 = row.insertCell(3);
             var cell5 = row.insertCell(4);
             var cell6 = row.insertCell(5);
             var cell7 = row.insertCell(6);
             cell3.innerHTML = "cur";
             cell4.innerHTML = "min";
             cell5.innerHTML = "avg";
             cell6.innerHTML = "max";
             cell7.innerHTML = "sum";

             
             */

           },
   intPlotSelect: function(ev, rngs){
             this.fire("plot-select",{event: ev, ranges: rngs});
           },
    ready: function(){
             this.tags = [];
           }
});
