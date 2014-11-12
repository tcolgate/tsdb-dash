Polymer({
       start_time: undefined,
         end_time: undefined,
         hosttree: undefined,
             tags: undefined,
          observe: {
                     "groups": "updateGroups",
                      "htree": "updateGroups"
                   },
  hosttreeChanged: function(oldv,newv){
                     this.tags = [ "host=" + newv.displayName ]
                   },
          created: function(){
                     this.group = {}
                     this.atree = {};
                     this.htree = {};
                     this.activeGroups = [];
                   },
            ready: function(){
                   }
});
