Polymer('dash-tsdb-query', {
         url: undefined,
       start: moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm:ss"),
         end: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        base: '/api/query',
      metric: undefined,
        tags: undefined,
        rate: false,
      aggrOp: "sym",
        dsmp: undefined,
      result: undefined,
     observe: {
                 start: 'validate',
                   end: 'validate',
                  base: 'validate',
                metric: 'validate',
                  tags: 'validate',
                  rate: 'validate',
                aggrOp: 'validate',
                  dsmp: 'validate'
              },
  endChanged: function(oldv,newv){
                console.log(oldv);
              },
    validate: function(oldv,newv){
                var args = new Array();
                var terms = new Array(); 
  
                args.push("start=" + parseInt(this.start.valueOf()));
                args.push("end=" + parseInt(this.end.valueOf()));
  
                terms[0] = this.aggrOp ;
                if(this.rate){
                  terms.push("rate") 
                };

                if(this.dsmp != undefined){
                  terms.push(this.dsmp);
                };

                // metric
                terms.push(this.metric);
    
                //tags
                var tagstr = "";
                if(this.tags.length > 0){
                  tagstr = "{" + this.tags.join(",") + "}";
                };

                args.push("m=" + terms.join(":") + tagstr);
 
                this.url =  this.base + "?" + args.join("&");
              },
     gotData: function(ev,resp){
                this.result = resp.response;
              },
     created: function(){
                this.tags = [];
                this.result = [];
              },
       ready: function(){
                this.rate = true;
                this.tags = ["jello"];
              }
});

