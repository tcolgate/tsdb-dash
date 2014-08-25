Polymer('dash-tsdb-legend-item', {
     spec: undefined,
   series: undefined,
 seriesId: 0,
    chart: undefined,
     open: false,
  enabled: true,
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

             console.log("toggle series id ", this.seriesId, this.chart.state().disabled)
           },
   render: function(){
           },
   created: function(){
             this.spec = {};
             this.series = {};
             this.chart = {};
           }
});
