Polymer('dash-tsdb-tree', {
    tree_id: 1,
  gotBranch: function(ev,resp){
               this.result = resp.response;
             },
    created: function(){
               this.result = {};
             }
});
