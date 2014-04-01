Polymer('dash-app', {
     gotTrees: function(ev,resp){
                 this.trees = resp.response;
               },
    gotGroups: function(ev,resp){
                 this.groups = resp.response;
               },
       router: null,

        ready: function () {
                 this.trees = [];
                 this.groups = [];
                 setTimeout((function () {
                   this.router = this.shadowRoot.querySelector('sr-router');
                   this.routerReady();
                 }).bind(this));
               },

  routerReady: function () {
                 this.init();
               },
 
         init: function () {
               }
});
