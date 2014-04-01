Polymer('dash-tree', {
     gotTrees: function(ev,resp){
                 this.trees = resp.response;
               },
    gotGroups: function(ev,resp){
                 this.groups = resp.response;
               },

        ready: function () {
                 this.trees = [];
                 this.groups = [];
               }
});
