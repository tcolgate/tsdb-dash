Polymer({
     spec: undefined,
   series: undefined,
    chart: undefined,
  summary: undefined,
     open: false,
  setOpen: function(){
             this.open = true;
           },
  unsetOpen: function(){
             this.open = false;
           },
toggleSeries: function(){
             this.enabled = ! this.enabled

             var state = this.chart.state()

             state.disabled[this.seriesId] = ! this.enabled
             this.chart.dispatch.changeState(state);
             this.chart.update()
           },
  observe: {
             spec: "render",
             series: "render"
           },
   render: function(){
             var s = {}
             var summary = [] 

             var formatter = function(x){return x};
             if(this.spec.hasOwnProperty("format")){
               formatter = d3.format(this.spec.format);
             } 

             for(key in this.series) {
               if(this.series.hasOwnProperty(key)){ 
                 s = this.series[key]
                 if(s.hasOwnProperty("cur")){
                   summary.push({
                    spec: this.spec,
                    sid: key,
                    series: s,
                    chart: this.chart,
                    enabled: true,
                    cur: formatter(s.cur),
                    min: formatter(s.min),
                    avg: formatter(s.avg),
                    max: formatter(s.max),
                    sum: formatter(s.sum),
                   })
                 }
               }
             }
             this.summary = summary 
           },
   created: function(){
             this.spec = {};
             this.series = {};
             this.chart = {};
             this.summary = [];
           },
    ready: function() {
           }
});
