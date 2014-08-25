Polymer('dash-tsdb-legend-item', {
     spec: undefined,
   series: undefined,
 seriesId: 0,
    chart: undefined,
     open: false,
  enabled: true,
      cur: "",
      min: "",
      avg: "",
      max: "",
      sum: "",
  observe: {
             spec: "render",
             series: "render"
           },
toggleSeries: function(){
             this.enabled = ! this.enabled

             var state = this.chart.state()

             state.disabled[this.seriesId] = ! this.enabled
             this.chart.dispatch.changeState(state);
             this.chart.update()
           },
   render: function(){
             if(this.spec.hasOwnProperty("format")){
               var formatter = d3.format(this.spec.format);
               if(this.series.hasOwnProperty("cur")){
                 this.cur = formatter(this.series.cur)
                 this.min = formatter(this.series.min)
                 this.avg = formatter(this.series.avg)
                 this.max = formatter(this.series.max)
                 this.sum = formatter(this.series.sum)
               }
             }
           },
   created: function(){
             this.spec = {};
             this.series = {};
             this.chart = {};
           }
});
