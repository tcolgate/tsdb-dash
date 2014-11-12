Polymer({
    end_in: undefined,
  start_in: undefined,
     valid: true,
autoUpdate: false,
  interval: undefined,
     delay: 3000,
            /* really noddy code, but good stuff broke in ways I don't understand
               with shared state for start and end */
   setHour: function(){
                this.start = moment(this.end - (60 * 60 * 1000))
            },
   setDay: function(){
                this.start = moment(this.end - (24 * 60 * 60 * 1000))
            },
   setWeek: function(){
                this.start = moment(this.end - (7 * 24 * 60 * 60 * 1000))
            },
  setMonth: function(){
                this.start = moment(this.end - (28 * 24 * 60 * 60 * 1000))
            },
   setYear: function(){
                this.start = moment(this.end - (365 * 24 * 60 * 60 * 1000))
            },
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
            },
   created: function(){
              this.interval = {}
              this.end_in = moment(new Date())
              this.start_in = moment(new Date()).subtract('days',1)
            },
autoUpdateChanged: function(){
              var that = this
              var updateTime = function (){
                var diff = that.end_in - that.start_in
                that.end_in = moment(new Date());
                start = that.end_in - diff
                that.start_in = moment(start)
              }
              if(this.autoUpdate){
                this.interval = setInterval(updateTime, this.delay);
              } else {
                if (this.interval) {
                  clearInterval(this.interval)
                }
                this.interval = undefined
              }
            } ,
     ready: function() {
              console.log(this)
            }
});
