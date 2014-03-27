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
            var di;

            for(di in this.data){
              if(this.data.hasOwnProperty(di)){
                s = {};
                vs = [];
                d = this.data[di];
                ds = this.spec.dss[di];
                dps = d.dps;
                cur = 0;
                min = 1/0;
                max = 0;
                sum = 0;

                s.label = this.name;
                for (t in dps) {
                  if(dps.hasOwnProperty(t)){
                    v = [];
                    dp = dps[t]
                    v[0] = parseInt(t,10) * 1000 ;
                    v[1] = dp;
                    cur = dp;
                    if(dp < min){min = dp};
                    if(dp > max){max = dp};
                    sum += dp;
  
                    vs.push(v);
                  }
                };
                avg = sum / vs.length;
  
                s['data'] = vs;
                s['cur'] = cur;
                s['min'] = min;
                s['max'] = max;
                s['sum'] = sum;
                s['avg'] = avg;
  
                /*
                s['label'] = s['label'] 
                  + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',cur) + "</td>"
                  + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',min) + "</td>"
                  + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',avg) + "</td>"
                  + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',max) + "</td>"
                  + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',sum) + "</td></tr><tr>"; 
                  */

                series.push(s);
              }
            };

            $.plot(
               this.$.plot,
               series,
               {
                 xaxis: { mode: "time", show: true }
               }
            );

            /*

             //this.$.legend 
             //t.allgraphs[gid].legend['container'] = legcont;
             //that.allgraphs[gid].legend['noColumns'] = 6;
 
             var ticks;
             var transform = function(x){return x;};
             var tickformatter = 
               (function(fmt,lgb){
                 return function (val,axis) {
                   var ret = gprintf(fmt,lgb,'.',val);
                   return ret;
                 };
               })(this.spec.format,this.spec.logbase);
 
             if(this.spec.hasOwnProperty("log") && this.spec.log){
               transform = 
                 (function(lgb){
                   return function(v){return Math.log(v+0.0001) / Math.log(lgb);};
                 })(this.spec.logbase);
               ticks = 
                 (function(lgb,tkf){
                   return function(axis) {
                     var res = [];
                     var max = Math.ceil(Math.log(axis.max) / Math.log(lgb));
                     var i = 0;
 
                     var v, txt;
                     do {
                       v   = Math.pow(lgb,i);
                       txt = tkf(v, axis);
                       res.push([v,txt]);
                       ++i;
                     } while (i < max);
 
                     return res;
                   };})(this.spec.logbase,tickformatter);
             }
 
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

             if(that.onselect){
               target.bind("plotselected", that.onselect);
             }
             */

           },
    ready: function(){
             this.tags = [];
           }
});
