Polymer('dash-dtpicker', {
   time_in: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      time: undefined,
   observe: {
              time_in: 'validate'
            },
  validate: function(oldv,newv){
              var newdate = moment(newv, "YYYY-MM-DD HH:mm:ss",true);
              if (newdate.isValid()){
                this.$.dtInput.style.background = "white";
                this.time = newdate;
              } else {
                this.$.dtInput.style.background = "#FFE4E1";
              }
            }
});
