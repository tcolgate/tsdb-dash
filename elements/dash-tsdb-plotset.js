Polymer({
    width: 600,
   perpix: 2,
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
             this.spec = {}
             this.results = [];
           },
    ready: function() {
           }
});
