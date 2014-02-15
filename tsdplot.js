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

  var stack = undefined;
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

  var legend = { show: true, position: "sw" };
  if(opts.hasOwnProperty("legend")){
    legend = opts['legend'];
  }

  var logbase = 10.0; 
  if(opts.hasOwnProperty("logbase") && opts['logbase']){
    logbase = opts['logbase'];
  }

  var format = "%f";
  if(opts.hasOwnProperty("format") && opts["format"]){
    format = opts["format"];
  }

  var ticks;
  var transform = function(x){return x};
  if(opts.hasOwnProperty("log") && opts["log"]){
    var tickformatter = 
      (function(fmt,lgb){
        return function (val,axis) {
          var ret = gprintf(fmt,lgb,'.',val);
          return ret;
        }
      })(format,logbase);

    transform = 
      (function(lgb){
        return function(v){return Math.log(v+0.0001) / Math.log(lgb);}
      })(logbase);

    ticks = 
      (function(lgb,tkf){
        return function(axis) {
          var res = [];
          var max = Math.ceil(Math.log(axis.max) / Math.log(lgb));
          var i = 0;

          do {
            var v   = Math.pow(lgb,i);
            var txt = tkf(v, axis);
            res.push([v,txt]);
            ++i;
          } while (i < max);

          return res;
        }})(logbase,tickformatter)
  }



  var dss = opts["dss"];

  var i = 0;
  var proms = [];

  var globaltags = new Array();
  $.each(opts["tags"],function(k,v){globaltags.push(k + "=" + v)});

  var wpix = div.width();
  var start = opts["start"]
  var end = opts["end"]
  var twidth = end - start;
  var tperpix = Math.floor(twidth / wpix);
  var downsample = "max";

  for(dsi in dss){
    var ds = dss[dsi]; 
    var args = new Array();
    var terms = new Array();
    var tags = globaltags;

    var lag = 0;
    if(ds.hasOwnProperty("lag")){
      lag = ds["lag"];
    };
    args.push("start=" + (parseInt(start) - lag));
    args.push("end=" + (parseInt(end) - lag));

    // Agg
    terms[0] = "sum" ;

    //rate
    var rate = false;
    if(ds.hasOwnProperty("rate")){
      rate = ds["rate"];
    };
    if(rate){ terms.push("rate") };

    //downsample
    if(tperpix > 0){
      terms.push("" + tperpix + "s-" + downsample);
    }

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
      }));
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
        // $.when promises to pass responses in the order
        // they were requested in
        var query_data = responses[resp][0]; 
        var ds = dss[resp]; 
        for (var s in query_data) {
          var dphash = query_data[s].dps;
          var series = {};
          var dps =  new Array();

          if (!ytag){
            if (ds.hasOwnProperty("label")){
              series['label'] = ds['label'];
            } else {
              series['label'] = query_data[s]['metric'];
            }
          } else {
            if (ds.hasOwnProperty("labelmap")){
              if (ds["labelmap"].hasOwnProperty(query_data[s]['tags'][ytag])){
                series['label'] = ds["labelmap"][query_data[s]['tags'][ytag]];
              } else {
                series['label'] = query_data[s]['tags'][ytag];
              }
            } else {
              series['label'] = query_data[s]['tags'][ytag];
            }
          }

          series['data'] = dps;

          var lag = 0;
          if (ds.hasOwnProperty("lag")){
            lag = ds['lag'];
          };

          for (var key in dphash) {
            var item = new Array();
            item[0] = (lag + parseInt(key)) * 1000 ;
            item[1] = dphash[key];
            dps.push(item);
          };
          allseries.push(series);
        }
      }

      plot = $.plot(
        div,
        allseries,
      {
        xaxis: { mode: "time", show: true },
      
        yaxes: [{
            position: 'left',
            axisLabel: ylabel,
            color: "#00000000",
            transform: transform,
            ticks: ticks
        }],
        grid: { hoverable: true, autoHighlight: false },
        legend: legend,
        selection: { mode: "x" },
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
