Polymer('dash-tsdb-tree', {
    tree_id: 1,
  gotBranch: function(ev,resp){
               console.log("got here");
               console.log(resp);
               this.leaves = resp.response.leaves;
               this.branches = resp.response.branches;
             },
      ready: function(){
               this.leaves = [];
               this.branches = [];
             }
});
