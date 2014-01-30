function plotchart(div,opts) {
  var plot,
      onHostfileChange,
      onHostfileLoadSuccess,
      createDataTable,
      onHostChange;

  var ylabel = null;
  if(opts.hasOwnProperty("units")){
    ylabel = opts['units'];
  }
  var ytag = null;
  if(opts.hasOwnProperty("ytag")){
    ytag = opts['ytag'];
  }

  var stack = false;
  if(opts.hasOwnProperty("stack")){
    stack = opts['stack'];
  }

  var fill = 0;
  if(opts.hasOwnProperty("fill")){
    fill = opts['fill'];
  }

  var linewidth = 0;
  if(opts.hasOwnProperty("linewidth")){
    linewidth = opts['linewidth'];
  }

  var dss = opts["dss"];

  var i = 0;
  var proms = [];

  var globaltags = new Array();
  $.each(opts["tags"],function(k,v){globaltags.push(k + "=" + v)});

  for(dsi in dss){
    var ds = dss[dsi]; 
    var args = new Array();
    var terms = new Array();
    var tags = globaltags;

    var start = opts["start"]
    var end = opts["end"]

    // We might want to add a lag factor to the time
    // to do "24 hours ago" 
    args.push("start=" + start);
    args.push("end=" + end);

    // Agg
    terms[0] = "sum" ;

    //rate
    var rate = false;
    if(ds.hasOwnProperty("rate")){
      rate = ds["rate"];
    };
    if(rate){ terms.push("rate") };

    //downsample
    terms.push("15m-max");

    // metric
    terms.push(ds["metric"]);
    
    //tags
    if (ds.hasOwnProperty("tags")){
      $.each(ds["tags"],function(k,v){tags.push(v)});
    };

    var tagstr = "";
    if(tags.length > 0){
      tagstr = "{" + tags.join(",") + "}";
    };

    args.push("m=" + terms.join(":") + tagstr);

    proms.push(
      $.ajax({
        url: "/api/query?" + args.join("&"),
        dataType: "json",
        cache: true,
        async: true,
        method: 'GET'
      }))
  };

  $.when.apply($,proms).done( 
    function () {
      var allseries = new Array(), placeholder;
      var responses;
      if(proms.length > 1){
        responses = arguments;
      } else {
        responses = new Array();
        responses[0] = arguments;
      };

      for (var resp in responses){
        var query_data = responses[resp][0]; 
        for (var s in query_data) {
          var dphash = query_data[s].dps;
          var series = {};
          var dps =  new Array();

          if (!ytag){
            series['label'] = query_data[s]['metric'];
          } else {
            series['label'] = query_data[s]['tags'][ytag];
          }

          series['data'] = dps;

          var item;
          for (var key in dphash) {
            item = new Array();
            item[0] = key * 1000;
            item[1] = dphash[key];
            dps.push(item);
          }
          allseries.push(series);
        }
      }

      console.log(ylabel);
      plot = $.plot(
        div,
        allseries,
      {
        xaxis: { mode: "time", show: true },
      
        yaxes: [{
            position: 'left',
            axisLabel: ylabel,
            color: "#00000000"
        }],
        grid: { hoverable: true, autoHighlight: false },
        legend: { show: true, position: "sw" },
        // crosshair: { mode: "x" },
        // selection: { mode: "x" },
        series: {
          stack: stack,
          lines: { fill: fill, show: true , lineWidth: linewidth}
        }
      }
    );
  });

  createDataTable = function (lines) {
    var index  = 0,
         length = lines.length,
         datapoint,
         point,
         data,
         type,
         host;

    data = {
      used:    [],
      free: []
    };

    for (; index < length; index++) {
      datapoint = lines[index].split(' ');
      var set = parseDataPoint(datapoint,new Array('used','free'));                        
      if (undefined != set) {
        data[set[0]].push(set[1]);
      }
    }

    return {
      data: data
    };
  };

  function parseDataPoint(datapoint,fields) {
    var length = fields.length, dlength = datapoint.length;
    for (dindex = 3; dindex < dlength; dindex++) {
      var item = datapoint[dindex].split('=');
      for (var index = 0; index < length; index++) {
        if (item[1] == fields[index]) {
          var point = [ datapoint[1]*1000, datapoint[2]/1024/1024/1024];
          return new Array(item[1],point);
        }
      }
    }
  }
};
