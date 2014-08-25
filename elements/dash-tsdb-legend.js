Polymer('dash-tsdb-legend', {
     spec: undefined,
   series: undefined,
    chart: undefined,
     open: false,
  setOpen: function(){
             this.open = true;
           },
  unsetOpen: function(){
             this.open = false;
           },
  observe: {
             spec: "render",
             series: "render"
           },
   render: function(){
           },
   created: function(){
             this.spec = {};
             this.series = {};
             this.chart = {};
           }
});
