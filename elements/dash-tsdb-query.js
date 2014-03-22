Polymer('dash-tsdb-query', {
        base: '/api/query',
        rate: false,
      aggrOp: "sum",
       start: undefined,
         end: undefined,
      metric: undefined,
        tags: undefined,
        dsmp: undefined,
         url: undefined,
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
    validate: function(oldv,newv){
                var args = new Array();
                var terms = new Array(); 
  
                if(this.start == undefined ||
                   this.end == undefined ||
                   this.metric == undefined
                ){
                  return;
                };

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
                this.fire('result', this.result);
              },
       ready: function(){
                this.tags = [];
                this.result = [];
              }
});

