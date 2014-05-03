Polymer('dash-view-host', {
         host: undefined,
         spec: undefined,
         data: undefined,
      observe: {
                 "groups": "updateGroups",
                  "htree": "updateGroups"
               },
    gotGroups: function(ev,resp){
                 var key;

                 this.groups = resp.response;
                 for(key in this.groups) {
                   if(this.groups.hasOwnProperty(key)){ 
                     this.groups[key]["regex"] = new RegExp(this.groups[key]["regex"]);
                   }
                 };
               },
    gotHTreeResult: function(ev,resp){
                 this.htree = resp;
               },
 plotSelected: (function(dtscope){
                 return function(ev,evdata){
                          console.log(dtscope)
                          var dt = dtscope.dtinput
                          var new_start = moment(evdata.ranges.xaxis.from)
                          var new_end = moment(evdata.ranges.xaxis.to)
                          dt.start = new_start;
                          dt.end = new_end;
                 }
               })(this.$),
  hostChanged: function(oldv,newv){
                 this.tags = [];
                 this.tags.push("host=" + newv);
               },
 updateGroups: function(oldv,newv){
                 var l, g, ag, leaf, displayName, match, isActive;
                 if(! this.htree.leaves){
                   return
                 };
                 var leaves = this.htree.leaves;
                 for (l in this.htree.leaves) {
                   if(leaves.hasOwnProperty(l)){ 
                     leaf = leaves[l];
                     displayName = leaf.displayName;
                     match = false;
                     for (g in this.groups) {
                       if(this.groups.hasOwnProperty(g)){ 
                         if (displayName.match(this.groups[g].regex)){
                           match = g;
                           break;
                         }
                       }
                     };
                     if (match == false){
                       continue
                     };

                     isActive = false;
                     for (ag in this.activeGroups){
                       if(this.activeGroups.hasOwnProperty(ag)){ 
                         if (this.groups[match].name === this.activeGroups[ag].name){
                           isActive = true;
                           break;
                         }
                       }
                     };
                     if (!isActive){
                       this.activeGroups.push(this.groups[match]);
                     };
                   };
                 };
               },
      created: function(){
                 this.groups = [];
                 this.atree = {};
                 this.htree = {};
                 this.activeGroups = [];
               }
});
