Polymer('dash-dtrange', {
    end: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  start: moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm:ss")
});
