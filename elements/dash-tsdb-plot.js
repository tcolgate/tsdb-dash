Polymer('dash-tsdb-plot', {
    width: 600,
   height: 400,
     spec: undefined,
     data: undefined,
  observe: {
             spec: "render",
             data: "render"
           },
   render: function(oldv,newv){
             console.log("node p ",this.$.plot);
             console.log("node l ",this.$.legend);

             var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

             // A null signifies separate line segments
             var d3 = [[0, 12], [7, 12], null, [7,     2.5], [12, 2.5]];
              
             $.plot(this.$.plot, [ d2, d3 ]);
                  
           },
    ready: function(){
             this.tags = [];
           }
});
