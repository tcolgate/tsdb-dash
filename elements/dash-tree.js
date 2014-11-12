Polymer({
     gotTrees: function(ev,resp){
                 this.trees = resp.response;
               },
    gotGroups: function(ev,resp){
                 this.groups = resp.response;
               },

      created: function () {
                 this.trees = [];
                 this.groups = [];
               },
        ready: function() {
               }
});
