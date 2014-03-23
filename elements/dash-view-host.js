Polymer('dash-view-host', {
         host: undefined,
         spec: undefined,
         data: undefined,
  hostChanged: function(oldv,newv){
                 this.tags=new Array();
                 this.tags.push("host=" + newv);
               },
        ready: function(){
               }
});
