Polymer('dash-app', {
         routeStr: undefined,
            route: undefined,
  routeStrChanged: function (oldv,newv) {
                     this.route = newv.split("/");
                   },
     routeChanged: function (oldv,newv) {
                     this.routeStr = newv.join("/");
                   },
          created: function () {
                      this.route = new Array();
                   }
});
