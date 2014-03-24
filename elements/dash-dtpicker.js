Polymer('dash-dtpicker', {
           time: undefined,
         timeIn: undefined,
          valid: true,
  timeInChanged: function(oldv,newv){
                   var newdate = moment(newv, "YYYY-MM-DD HH:mm:ss",true);
                   if (newdate.isValid()){
                     this.time = newdate;
                     this.valid = true;
                   } else {
                     this.valid = false;
                   } 
                 },
    timeChanged: function(){
                   if(this.valid){
                     this.timeIn = this.time.format("YYYY-MM-DD HH:mm:ss");
                   }
                 },
   validChanged: function(){
                   if (this.valid){
                     this.$.dtInput.style.background = "white";
                   } else {
                     this.$.dtInput.style.background = "#FFE4E1";
                   }
                 },
          ready: function(){
                   this.time = moment(new Date());
                 }
});
