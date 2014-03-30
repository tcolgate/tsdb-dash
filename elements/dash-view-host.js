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
               },
 updateGroups: function(oldv,newv){
                 console.log("oldv:",oldv,"newv",newv);
                 var l, g, ag, leaf, displayName, match, isActive;
                 console.log("htree: ", this.htree);
                 if(! this.htree.leaves){
                   return
                 };
                 var leaves = this.htree.leaves;
                 console.log("leaves: ", leaves);
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
                       console.log("Unmatched metric: " + displayName);
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
