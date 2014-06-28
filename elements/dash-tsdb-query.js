Polymer('dash-tsdb-query', {
        base: '/api/query',
        rate: false,
    rateCtrl: undefined,
      aggrOp: "sum",
       start: undefined,
         end: undefined,
      metric: undefined,
        tags: undefined,
        dsmp: undefined,
         lag: 0,
         url: undefined,
      result: undefined,
        dsid: undefined,
     observe: {
                 start: 'validate',
                   end: 'validate',
                  base: 'validate',
                metric: 'validate',
                  tags: 'validate',
                  rate: 'validate',
              rateCtrl: 'validate',
                aggrOp: 'validate',
                  dsmp: 'validate',
                   lag: 'validate'
              },
    validate: function(){
                var args = [];
                var terms = []; 
  
                if(this.start === undefined ||
                   this.end === undefined ||
                   this.metric === undefined
                ){
                  return;
                }

                // TODO
                // This isn't perfect. Ideally the start/end would be adjust for 
                // the lag before the query was setup so we wouldn't need to know
                // about it here, but doing it in the dataset makes the propagation
                // of the date chnages a little harder. Being lazy
                args.push("start=" + (parseInt(this.start.valueOf(),10) - (this.lag * 1000)));
                args.push("end=" + (parseInt(this.end.valueOf(),10) - (this.lag * 1000)));
  
                terms[0] = this.aggrOp ;

                if(this.rate){
                  if(this.rateCtrl){
                    terms.push("rate{" + this.rateCtrl + "}");
                  } else {
                    terms.push("rate");
                  }
                }

                if(this.dsmp){
                  terms.push(this.dsmp);
                }

                // metric
                terms.push(this.metric);

                //tags
                var tagstr = "";
                if(this.tags.length > 0){
                  tagstr = "{" + this.tags.join(",") + "}";
                }

                args.push("m=" + terms.join(":") + tagstr);
 
                this.url =  this.base + "?" + args.join("&");
              },
     gotData: function(ev,resp){
                this.result = resp.response;
                this.fire('query-result', this.result);
              },
       ready: function(){
                this.tags = [];
                this.result = [];
              }
});

