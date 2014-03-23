Polymer('dash-tsdb-plotset', {
    width: 600,
   height: 400,
     spec: undefined,
      end: undefined,
    start: undefined,
resultsChanged: function(oldv,newv){ console.log("plotset",newv)},
  created: function(){
             this.results = new Array();
           }
});
