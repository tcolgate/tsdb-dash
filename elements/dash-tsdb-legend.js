Polymer('dash-tsdb-legend', {
     spec: undefined,
     data: undefined,
    chart: undefined,
  observe: {
             spec: "render",
             data: "render"
           },
   render: function(){
           },
   created: function(){
             this.spec = {};
             this.data = {};
             this.chart = {};
           }
});
