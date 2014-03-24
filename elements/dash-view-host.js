Polymer('dash-view-host', {
         host: undefined,
         spec: undefined,
         data: undefined,
  hostChanged: function(oldv,newv){
                 this.tags = [];
                 this.tags.push("host=" + newv);
               }
});
