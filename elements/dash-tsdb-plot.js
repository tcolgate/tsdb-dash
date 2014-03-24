Polymer('dash-tsdb-plot', {
    width: 600,
   height: 400,
     spec: undefined,
     data: undefined,
  observe: {
             spec: "render",
             data: "render"
           },
   render: function(){

     /*
            var dphash = query_data[s].dps;
            var series = new Array();
            var ds = that.dss[s]; 
            var dps =  new Array();
                  
            var cur = 0;
            var min = 1/0;
            var max = 0;
            var sum = 0;

            for (var key in dphash) {
              var item = new Array();
              var val  = dphash[key]
              item[0] = (lag + parseInt(key)) * 1000 ;
              item[1] = val;
              cur = val;
              if(val < min){min = val};
              if(val > max){max = val};
              sum += val;

              dps.push(item);
            };

            var avg = sum / dps.length;

            series['cur'] = cur;
            series['min'] = min;
            series['max'] = max;
            series['sum'] = sum;
            series['avg'] = avg;

            series['label'] = series['label'] 
              + "<td>" + gprintf(that.format,that.logbase,'.',cur) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',min) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',avg) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',max) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',sum) + "</td></tr><tr>"; 

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
