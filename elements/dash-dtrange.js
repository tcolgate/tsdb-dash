Polymer('dash-dtrange', {
       end: moment(new Date()),
     start: moment(new Date()).subtract('days',1),
     valid: true,
   observe: {
              start: "validate",
                end: "validate"
            },
  validate: function(oldv,newv){
              console.log(this.start.valueOf());
              console.log(this.end.valueOf());
              if( 
                  this.start <= this.end 
              ){
                this.valid = true
                this.$.start_input.valid = true;
                this.$.end_input.valid = true;
              } else {
                this.valid = false;
                this.$.start_input.valid = false;
                this.$.end_input.valid = false;
              }
            }
});
