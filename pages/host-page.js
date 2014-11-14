Polymer({
       start_time: undefined,
         end_time: undefined,
             host: "",
        hostsTree: undefined,
         hostData: undefined,
          observe: {
                hostsTree: "update",
                     host: "update",
                   },
           update: function () {
                     console.log(this.host)
                     this.hostData = {}
                     if(this.hostsTree.hasOwnProperty('branches')){
                       for(branch in this.hostsTree['branches']) {
                         if(this.hostsTree['branches'].hasOwnProperty(branch)){
                           if(this.hostsTree['branches'][branch].hasOwnProperty('displayName')){
                             if(this.hostsTree['branches'][branch]['displayName'] === this.host){
                               this.hostData = this.hostsTree['branches'][branch]
                               console.log(this.hostData)
                             }
                           }
                         }
                       }
                     }
                   },
          created: function () {
                     this.hostsTree = {}
                     this.hostData = {}
                   },
            ready: function () {
                   }
});
