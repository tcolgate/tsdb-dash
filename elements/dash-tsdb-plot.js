Polymer('dash-tsdb-plot', {
    width: 600,
   height: 400,
      end: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    start: moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm:ss"),
  gotSpec: function(ev,resp){
             this.spec = resp.response;
           },
    ready: function(){
             this.spec = undefined
           }
});
