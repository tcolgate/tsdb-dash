Polymer('dash-app', {
         routeStr: undefined,
              cmd: undefined,
             args: undefined,
          observe: {
                      cmd: "update",
                     args: "update",
                   },
  routeStrChanged: function (oldv,newv) {
                     var l1 = newv.split("?");
                     this.cmd = l1[0];
                     if(l1[1]){
                       this.args = l1[1].split("&");
                     }else{
                       this.args = undefined
                     };
                   },
           update: function () {
                     var argStr = "";
                     if(this.args && this.args.length > 0){
                       argStr = "?" + this.args.join("&")
                     };

                     this.route = this.cmd + argStr;
                   },
          created: function () {
                   }
});
