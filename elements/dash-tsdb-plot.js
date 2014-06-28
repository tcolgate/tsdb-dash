/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */

function nvd3(el, data) {
  var svg = d3.select(el)
  var padding = 3;
  var width = parseInt(svg.style("width")) - padding;
  var height = parseInt(svg.style("height")) - padding;
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  nv.addGraph(function() {
    var chart = nv.models.lineChart()
            .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
            .interpolate("basis")           // <=== THERE IT IS!
            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
            .transitionDuration(350)  //how fast do you want the lines to transition?
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            .color(d3.scale.category10().range())

    chart.xAxis     //Chart x-axis settings
        .axisLabel('Time (ms)')
        .tickFormat(function(d) { return d3.time.format('%x')(new Date(d))})

    chart.xScale(d3.time.scale());

    chart.yAxis     //Chart y-axis settings
        .axisLabel('U')
        .tickFormat(d3.format('.2s'));

    svg    //Select the <svg> element you want to render the chart in.   
        .datum(data)         //Populate the <svg> element with chart data...
        .call(chart);        //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });
    return chart;
  });
}

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
             var cur, min, max, sum, avg, lag;
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

                     if (ds.hasOwnProperty("lag")){
                       lag = ds.lag;
                     } else {
                       lag = 0;
                     }

                     for (t in dps) {
                       if(dps.hasOwnProperty(t)){
                         dp = dps[t];
                         v = {
                           x: (lag + parseInt(t,10)) * 1000 ,
                           y: dp
                         };
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
      
                     /*
                     s.label = s.label
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',cur) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',min) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',avg) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',max) + "</td>"
                       + "<td>" + gprintf(this.spec.format,this.spec.logbase,'.',sum) + "</td></tr><tr>"; 
                      */

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

             /*
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
             */

             var nvspec = []
             for (s in series) {
               if(series.hasOwnProperty(s)){
                 console.log(s)
                 nvspec.push({
                   key: series[s].label,
                   values: series[s].data
                 })
               }
             }

             nvd3(this.$.plot, nvspec);
           },
   intPlotSelect: function(ev, rngs){
             this.fire("plot-select",{event: ev, ranges: rngs});
           },
    ready: function(){
             this.tags = [];
           }
});
