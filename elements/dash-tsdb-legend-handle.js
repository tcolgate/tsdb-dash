Polymer({
   series: undefined,
 seriesId: 0,
    chart: undefined,
  enabled: true,
toggleSeries: function(){
             this.enabled = ! this.enabled

             var state = this.chart.state()

             state.disabled[this.seriesId] = ! this.enabled
             this.chart.dispatch.changeState(state);
             this.chart.update()
           },
   created: function(){
             this.series = {};
             this.chart = {};
           },
    ready: function() {
           }
});
