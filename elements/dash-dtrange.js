Polymer('dash-dtrange', {
    end_in: moment(new Date()),
  start_in: moment(new Date()).subtract('days',1),
     valid: true,
   observe: {
              start_in: "validate",
                end_in: "validate",
                 start: "update",
                   end: "update"
            },
    update: function(){
              this.start_in = this.start;
              this.end_in = this.end;
              if( 
                  this.start <= this.end 
              ){
                this.valid = true;
                this.$.start_input.valid = true;
                this.$.end_input.valid = true;
              } else {
                this.valid = false;
                this.$.start_input.valid = false;
                this.$.end_input.valid = false;
              }
            },
  validate: function(){
              if( 
                  this.start_in <= this.end_in 
              ){
                this.valid = true;
                this.$.start_input.valid = true;
                this.$.end_input.valid = true;
                this.start = this.start_in;
                this.end = this.end_in;
              } else {
                this.valid = false;
                this.$.start_input.valid = false;
                this.$.end_input.valid = false;
              }
            }
});
