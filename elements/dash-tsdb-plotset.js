Polymer('dash-tsdb-plotset', {
    width: 600,
     spec: undefined,
      end: undefined,
    start: undefined,
  observe: {
             "width": "prepare",
              "spec": "prepare",
               "end": "prepare",
             "start": "prepare",
           },
  prepare: function(){

           },
  created: function(){
             this.results = [];
           }
});
