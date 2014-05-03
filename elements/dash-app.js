Polymer('dash-app', {
         routeStr: "test",
            route: undefined,
  routeStrChanged: function (oldv,newv) {
                     this.route = newv.split("/");
                   },
     routeChanged: function (oldv,newv) {
                     this.routeStr = newv.join("/");
                   },
            ready: function () {
                      this.route = new Array();
                   }
});
