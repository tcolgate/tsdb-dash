view_host_main = function () {
  var $document = $(document), onDocumentReady;
  var params = $.getQuery();

 	if ( document.location.protocol === 'file:' ) {
 		alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
 	}

 	// Establish Variables
 	var History = window.History; 
 	var	State = History.getState();

  var branchId = "";
  if(State['data'].hasOwnProperty("branch") && State['data']['branch']){
    branchId = State['data']['branch'];
  } else {
    branchId = params['branch'];
  }

 	// Bind to State Change
 	onStateChange = function(){ // Note: We are using statechange instead of popstate
    var State = History.getState(); // Note: We are using History.getState() instead of event.state
    var now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    if(State['data'].hasOwnProperty("start_date") && State['data']['start_date']){
      $('#start_date').val(State['data']['start_date']);
    } else {
      if (params.hasOwnProperty("start_date") && params['start_date']){
        $('#start_date').val(params['start_date']);
      } else {
        $('#start_date').val(moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm:ss"));
      }
    }

    if(State['data'].hasOwnProperty("end_date") && State['data']['end_date']){
      $('#end_date').val(State['data']['end_date']);
    } else {
      if (params.hasOwnProperty("end_date") && params['end_date']){
        $('#end_date').val(params['end_date']);
      } else {
        $('#end_date').val(now);
      }
    }

    $('#start_date').on("change",onDateChange);
    $('#end_date').on("change",onDateChange);

    $('#end_date').change();

 	};

 	History.Adapter.bind(window,'statechange', onStateChange);

  onDateChange = function (ev) {
    $.ajax({
      url: "/api/tree/branch?branch=" + branchId,
      dataType: "json",
      cache: true,
      async: true,
      method: 'GET',
    }).done(onBranchListSuccess);
  }

  onDocumentReady = function () {

    onStateChange();

/*
    $('#start_date').appendDtpicker({
      closeOnSelected: true,
      dateFormat: "YYYY-MM-DD hh:mm",
      current: moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm"),
      maxDate: now
    });

    $('#end_date').appendDtpicker({
      dateFormat: "YYYY-MM-DD hh:mm",
      closeOnSelected: true,
      current: now,
      maxDate: now
    });
 */

  };

  onBranchListSuccess = function (branch_data, textStatus, jqXHR) {
    $.getJSON(
      'groupings.json',
      function(groupings){
        $("#container").html("");

        var host = branch_data['displayName'];
        var groups = {};
        for(var key in groupings) {
          groupings[key]["regex"] = new RegExp(groupings[key]["regex"]);
        };
        for (var l in branch_data['leaves']) {
          var leaf = branch_data['leaves'][l];
          var displayName = leaf['displayName'];
          var match = false;
          for (var g in groupings) {
            if (displayName.match(groupings[g]['regex'])){
              match = g;
              break;
            }
          };
          if (match == false){
            console.log("Unmatched metric: " + displayName);
            continue;
          };

          if (! groups.hasOwnProperty(match)){
            groups[match] = true;
          };
        };

        for (g in groups){
          var group = groupings[g];
          if (group.hasOwnProperty("charts") && group['charts'].length > 0){
            var grtitle = group['name'];
            if (group.hasOwnProperty("title")){
              grtitle = group['title'];
            }

            var gritem = $("<h3 id=\"" + group['name'] + "\">" + grtitle + "</h3>");
            $("#container").append(gritem);

            for (c in group["charts"]){
              (function(grdiv,groupindex,chartindex){
                var spec ="charts/"+ groupings[groupindex]["charts"][chartindex] + ".json" ;
                $.getJSON(spec).done(function(spec_data){

                  var name   = groupings[groupindex]["name"];
                  var target = $("<div id=\"" + name + "\"><a name=\"" + name + "\"></a></div>");
                  grdiv.append(target);

                  onPlotSelected = function(event, ranges){
                    var from = ranges.xaxis.from;
                    var   to = ranges.xaxis.to;

                    var newstate = $.extend({},History.getState()['data']);

                    $.extend(newstate,{branch: branchId});
                    $.extend(newstate,{start_date: moment(new Date(from)).format("YYYY-MM-DD HH:mm:ss")});
                    $.extend(newstate,{end_date: moment(new Date(to)).format("YYYY-MM-DD HH:mm:ss")});

                    var str = [];
                    for(var p in newstate)
                      if (newstate.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(newstate[p]));
                      }
                    var  newurl = "?" + str.join("&");

                    History.pushState(newstate,null,newurl);
                  }
                  var chart = new plotchart( 
                    {
                      "start": moment($("#start_date").val()).format("X"),
                      "end": moment($("#end_date").val()).format("X"),
                      "onselect": onPlotSelected, 
                      'width': "400px",
                      'height': "220px",
                      'title': spec_data['title'],
                      'stack': spec_data['stack'],
                      'ylabel': spec_data['units'],
                      'ytag': spec_data['ytag'],
                      "dss": spec_data['dss'],
                      "fill": spec_data['fill'],
                      "linewidth": spec_data['linewidth'],
                      "units": spec_data['units'],
                      "log": spec_data['log'],
                      "logbase": spec_data['logbase'],
                      "format": spec_data['format'],
                      "tags": {"host": host},
                      "legend": {"show": true}
                    }
                  );
                  chart.renderTo(target);
                })
              })(gritem,g,c)
            }
          }
        }
      }
    )
  }
  $document.ready(onDocumentReady);
};
