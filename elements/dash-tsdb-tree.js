Polymer({
    tree_id: undefined,
  branch_id: undefined,
  resultChanged: function(oldv,newv){
               this.fire("tree-result",newv);
             },
  gotBranch: function(ev,resp){
               this.result = resp.response;
             },
    created: function(){
               this.result = {};
             },
      ready: function() {
             }
});
