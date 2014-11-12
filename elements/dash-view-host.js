Polymer({
   start_time: undefined,
     end_time: undefined,
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
 plotSelected: function(ev,evdata){
                 this.start_time = moment(evdata.ranges.xaxis.from)
                 this.end_time = moment(evdata.ranges.xaxis.to)
               },
  hostChanged: function(oldv,newv){
                 this.tags = [ "host=" + newv.displayName ]
               },
 updateGroups: function(oldv,newv){
                 var l, g, ag, leaf, displayName, match, isActive;

                 this.activeGroups = [];

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
                     if (match === false){
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
               },
        ready: function(){
               }
});
