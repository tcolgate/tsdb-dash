Polymer({
          label: "",
         timeIn: "",
          valid: true,
        vaidate: function(value){
                   var newdate = moment(value, "YYYY-MM-DD HH:mm:ss",true);
                   if (newdate.isValid()){
                     return true;
                   } else {
                     return false;
                   } 
                 },
  timeInChanged: function(){
                   var newdate = moment(this.timeIn, "YYYY-MM-DD HH:mm:ss",true);
                   if (newdate.isValid()){
                     this.time = newdate;
                   }
                 },
    timeChanged: function(){
                   if(this.valid){
                     this.timeIn = this.time.format("YYYY-MM-DD HH:mm:ss");
                   }
                 },
        created: function(){
                   this.time = moment(new Date());
                 },
          ready: function() {
                 }
});
