function plotchart(opts) { var that = this; this.title  = opts['title']; this.width  = opts['width']; this.height = opts['height']; this.start = opts["start"]
  this.end = opts["end"]
  this.grouptag = opts['grouptag']

  this.dss = opts["dss"];
  this.proms = [];
  this.downsample = "max";

  this.logbase = 10.0; 
  if(opts.hasOwnProperty("logbase") && opts['logbase']){
    this.logbase = opts['logbase'];
  }

  this.format = "%f";
  if(opts.hasOwnProperty("format") && opts["format"]){
    this.format = opts["format"];
  }

  this.onselect = undefined;
  if(opts.hasOwnProperty("onselect") && opts['onselect']){
    this.onselect = opts['onselect'];
  }

  this.ylabel = null;
  if(opts.hasOwnProperty("units")){
    this.ylabel = opts['units'];
  }
  this.ytag = null;
  if(opts.hasOwnProperty("ytag")){
    this.ytag = opts['ytag'];
  }

  this.stack = undefined;
  if(opts.hasOwnProperty("stack")){
    this.stack = opts['stack'];
  }

  this.fill = 0;
  if(opts.hasOwnProperty("fill")){
    this.fill = opts['fill'];
  }

  this.linewidth = 0;
  if(opts.hasOwnProperty("linewidth")){
    this.linewidth = opts['linewidth'];
  }

  this.legend = { show: true, position: "sw" };
  if(opts.hasOwnProperty("legend")){
    this.legend = opts['legend'];
  };

  this.globaltags = new Array();
  $.each(opts["tags"],function(k,v){that.globaltags.push(k + "=" + v)});
  if (undefined != this.grouptag){
    this.globaltags.push(this.grouptag + "=*");
  }

  var wpix = parseInt(this.width.replace(/px$/,""));
  var twidth = this.end - this.start;

  var tperpix = Math.floor(twidth / wpix);

  for(dsi in this.dss){
    var ds = this.dss[dsi]; 
    var args = new Array();
    var terms = new Array();
    var tags = this.globaltags.slice(0);
    var aggr = "sum";

    var lag = 0;
    if(ds.hasOwnProperty("lag")){
      lag = ds["lag"];
    };
    args.push("start=" + (parseInt(this.start) - lag));
    args.push("end=" + (parseInt(this.end) - lag));

    // Agg
    terms[0] = aggr ;

    //rate
    var rate = false;
    if(ds.hasOwnProperty("rate")){
      rate = ds["rate"];
    };
    if(rate){ terms.push("rate") };

    //downsample
    if(tperpix > 1){
      terms.push("" + (tperpix * 2) + "s-" + this.downsample);
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

    this.proms.push(
      $.ajax({
        url: "/api/query?" + args.join("&"),
        dataType: "json",
        cache: true,
        async: true,
        method: 'GET'
      }));
  };


  this.allgraphs = new Array();

  this.prepare = function(){
    return $.when.apply($,that.proms).done( 
      function () {
        var responses;
        if(that.proms.length > 1){
          responses = arguments;
        } else {
          responses = new Array();
          responses[0] = arguments;
        };

        // We need to split the responses into graphs
        var respset = new Array();
        for (var resp in responses){
          var query_data = responses[resp][0]; 
          for (var qd in query_data){
            if(undefined != that.grouptag){
              var gtagval = query_data[qd]["tags"][that.grouptag]
              if(respset[gtagval] == undefined){
                respset[gtagval] = new Array();
              };
              respset[gtagval].push(query_data[qd]);
            } else {
              var gtagval = 0;
              if(respset[gtagval] == undefined){
                respset[gtagval] = new Array();
              };
              respset[gtagval].push(query_data[qd]);
            } 
          }
        }

        for (var r in respset){
          // E.g. for eth0...
          var respgroup = respset[r];
          that.allgraphs[r] =  new Array();
          var graph = that.allgraphs[r];
          graph.allseries = new Array();

          var query_data = respgroup; 

          for (var s in query_data) {
            var dphash = query_data[s].dps;
            var series = new Array();
            var ds = that.dss[s]; 
            var dps =  new Array();

            series['tags'] = query_data[s]['tags'];

            if (!that.ytag){
              if (ds.hasOwnProperty("label")){
                series['label'] = ds['label'];
              } else {
                series['label'] = query_data[s]['metric'];
              }
            } else {
              if (ds.hasOwnProperty("labelmap")){
                if (ds["labelmap"].hasOwnProperty(query_data[s]['tags'][that.ytag])){
                  series['label'] = ds["labelmap"][query_data[s]['tags'][that.ytag]];
                } else {
                  series['label'] = query_data[s]['tags'][that.ytag];
                }
              } else {
                series['label'] = query_data[s]['tags'][that.ytag];
              }
            }

            series['data'] = dps;

            var lag = 0;
            if (ds.hasOwnProperty("lag")){
              lag = ds['lag'];
            };
            
            var cur = 0;
            var min = 1/0;
            var max = 0;
            var sum = 0;

            for (var key in dphash) {
              var item = new Array();
              var val  = dphash[key]
              item[0] = (lag + parseInt(key)) * 1000 ;
              item[1] = val;
              cur = val;
              if(val < min){min = val};
              if(val > max){max = val};
              sum += val;

              dps.push(item);
            };

            var avg = sum / dps.length;

            series['cur'] = cur;
            series['min'] = min;
            series['max'] = max;
            series['sum'] = sum;
            series['avg'] = avg;

            series['label'] = series['label'] 
              + "<td>" + gprintf(that.format,that.logbase,'.',cur) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',min) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',avg) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',max) + "</td>"
              + "<td>" + gprintf(that.format,that.logbase,'.',sum) + "</td></tr><tr>"; 

            graph.allseries.push(series)
          }
        }
      }
    );
  };

  this.renderGraphTo = function(gid,divid){
    return that.prepare().done(function(){
      (function(g,div){
        console.log(g);
        var target = $(
          "<div class='plot' style=\"width: " + that.width +";"
          + " height: " + that.height +";\">" 
          + "</div>");

        var legcont = $("<div class='legend'></div>");

        var title = that.title;
        if( undefined != that.grouptag ){
          title += g;
        };

        var enclose = 
          $("<div style=\"overflow: visible; width: "+ that.width +"\" class='graph'>" 
            + "<h6 class='graph'>" 
            + title 
            + "</h6>").append(target).append(legcont).append($("</div>"));

        div.append(enclose);

        that.allgraphs[gid].legend = $.extend(true,{},that.legend);
        that.allgraphs[gid].legend['container'] = legcont;
        that.allgraphs[gid].legend['noColumns'] = 6;

        var ticks;
        var transform = function(x){return x};
        if(opts.hasOwnProperty("log") && opts["log"]){
          var tickformatter = 
            (function(fmt,lgb){
              return function (val,axis) {
                var ret = gprintf(fmt,lgb,'.',val);
                return ret;
              }
            })(that.format,that.logbase);

          transform = 
            (function(lgb){
              return function(v){return Math.log(v+0.0001) / Math.log(lgb);}
            })(that.logbase);

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
              }})(that.logbase,tickformatter)
        }

        var plot = $.plot(
          target,
          that.allgraphs[gid].allseries,
          {
            xaxis: { mode: "time", show: true },
          
            yaxes: [{
                position: 'left',
                axisLabel: that.ylabel,
                color: "#00000000",
                transform: transform,
                ticks: ticks
            }],
            grid: { hoverable: true, autoHighlight: false },
            legend: that.allgraphs[gid].legend,
            selection: { mode: "x" },
            series: {
              stack: that.stack,
              lines: { fill: that.fill, show: true , lineWidth: that.linewidth},
              shadowSize: 0
            }
          }
        );

        // Populate the table columns
        console.log(that.allgraphs[gid]);
        var table = that.allgraphs[gid].legend['container'].children()[0];
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        cell3.innerHTML = "cur";
        cell4.innerHTML = "min";
        cell5.innerHTML = "avg";
        cell6.innerHTML = "max";
        cell7.innerHTML = "sum";

        if(that.onselect){
          target.bind("plotselected", that.onselect);
        }
      })(gid,divid)
    })
  };

  this.renderAllTo = function(divid){
    that.prepare().done(function(){
      for(gid in that.allgraphs){
        (function(g,d){
          that.renderGraphTo(g,d)
        })(gid,divid)
      }
    });
  };
};
