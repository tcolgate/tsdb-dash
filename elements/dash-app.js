Polymer('dash-app', {
         routeStr: "test",
            route: undefined,
  routeStrChanged: function (oldv,newv) {
                     route = routeStr.split("/");
                   },
     routeChanged: function (oldv,newv) {
                     routeStr = route.join("/");
                   },
            ready: function () {
                      this.route = new Array();
                   }
});
