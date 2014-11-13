/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */

function nvd3(w, h, guides, el, data, spec, cb) {
  var svg = d3.select(el)
  var padding = 3;
  var width = w - padding;
  var height = h - padding;

  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  nv.addGraph(function() {
    var chart

    if (spec.stack){
      chart = nv.models.stackedAreaChart()
               .showControls(true)    
    } else {
      chart = nv.models.lineChart()
    }

    chart.margin({left: 80})  //Adjust chart margins to give the x-axis some breathing room.
         .interpolate("basis")           // <=== THERE IT IS!
         .useInteractiveGuideline(guides)  //We want nice looking tooltips and a guideline!
         .tooltips(guides)  //We want nice looking tooltips and a guideline!
         .transitionDuration(350)  //how fast do you want the lines to transition?
         .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
         .showYAxis(true)        //Show the y-axis
         .showXAxis(true)        //Show the x-axis

    chart.xAxis     //Chart x-axis settings
        .tickFormat(function(d) { return d3.time.format('%X')(new Date(d))})

    chart.xScale(d3.time.scale());

    chart.yAxis     //Chart y-axis settings
        .axisLabel(spec.units)
        .tickFormat(d3.format(spec.format));

    if (spec.log) {
      chart.yScale(d3.scale.log());
    }

    svg    //Select the <svg> element you want to render the chart in.   
        .style({ 'max-width': width, 'max-height': height })
        .datum(data)         //Populate the <svg> element with chart data...
        .call(chart);        //Finally, render the chart!

    return chart;
  },cb);
}

Polymer({
    width: 600,
   height: 400,
   guides: false,
     spec: undefined,
     name: undefined,
     data: undefined,
    chart: undefined,
   series: undefined,
  observe: {
             spec: "render",
             name: "render",
             data: "render"
           },
   render: function(){

             this.series = [];
             var d, ds, dps, dp, s, v, vs, t; 
             var cur, min, max, sum, avg, lag;
             var di, ddi;
             var colors = d3.scale.category10()
             var coli = 0

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
                     colour = colors(coli);
                     coli++
     
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

                     if (ds.hasOwnProperty("color")){
                       colour = ds.color;
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
                     s.colour = colour;
      
                     this.series.push(s);
                   }
                 };
               }
             }

 
             if(ds.hasOwnProperty("log") && ds.log){
             }

             var nvspec = []
             for (s in this.series) {
               if(this.series.hasOwnProperty(s)){
                 nvspec.push({
                   key: this.series[s].label,
                   values: this.series[s].data,
                   color: this.series[s].colour,
                 })
               }
             }

             var that = this
             callback = function(chart){
               // We'll take a reference to the nvd3
               // chart so that we can update it externally
               that.chart = chart
             }

             nvd3(this.width, this.height, this.guides, this.$.plot, nvspec, this.spec, callback);
           },
   intPlotSelect: function(ev, rngs){
             this.fire("plot-select",{event: ev, ranges: rngs});
           },
   created: function(){
             this.series = [];
             this.chart = {};
             this.tags = [];
           },
    ready: function() {
           }
});
