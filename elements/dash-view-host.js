Polymer('dash-view-host', {
         host: undefined,
         spec: undefined,
         data: undefined,
 plotSelected: function(ev,evdata){
                 var currdt = this.$.dtinput 
                 var new_start = moment(evdata.ranges.xaxis.from)
                 var new_end = moment(evdata.ranges.xaxis.to)
                 currdt.start = new_start;
                 currdt.end = new_end;
               },
  hostChanged: function(oldv,newv){
                 this.tags = [];
                 this.tags.push("host=" + newv);
               }
});
