(function () {

// $.when($.ajax( "/page1.php" ), 
//        $.ajax( "/page2.php" ) ).done(
//           function( a1, a2 ) {
//             // a1 and a2 are arguments resolved for the page1 and page2 ajax requests, respectively.
//             // Each argument is an array with the following structure: [ data, statusText, jqXHR ]
//             var data = a1[ 0 ] + a2[ 0 ]; // a1[ 0 ] = "Whip", a2[ 0 ] = " It"
//             if ( /Whip It/.test( data ) ) {
//               alert( "We got what we came for!" );
//             }});

    var $document = $(document), onDocumentReady;
    var params = $.getQuery(); 
    var branchId = params['branch'];

    onDocumentReady = function () {
      $('*[name=start_date]').appendDtpicker({
        "current": moment(new Date()).subtract('days',1).format("YYYY-MM-DD HH:mm:ss")
      });

      $('*[name=end_date]').appendDtpicker();

      $.ajax({
          url: "/api/tree/branch?branch=" + branchId,
          dataType: "json",
          cache: true,
          async: true,
          method: 'GET',
      }).done(onBranchListSuccess);
    };


    onBranchListSuccess = function (branch_data, textStatus, jqXHR) {
      $.getJSON(
       'groupings.json',
        function(groupings){
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
              next;
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
                (function(groupindex,chartindex){
                  var spec ="charts/"+ groupings[groupindex]["charts"][chartindex] + ".json" 
                  console.log("Will draw chart: " + spec);
                  $.getJSON(spec).done(function(spec_data){
                    var title = spec_data['title'];
                    var name  = groupings[groupindex]["name"];
                    var cont  = "#" + name;
                    var target = $(
                      "<div class='plot' id=\"group_" 
                      + chartindex 
                      + "\" style=\"width: 480px; height: 280px\">" 
                      + "</div>");
                    var legcont = $("<div class='legend' id=\"group_" + chartindex + "_legend\"></div>");
                    var enclose = 
                      $("<div style=\"width: 400px\" class='graph'>" 
                        + "<h6 class='graph' id=\"" + name + "\">" 
                        + title 
                        + "</h6>").append(target).append(legcont).append($("</div>"));
                    $(cont).append(enclose);
  
                    plotchart(target, 
                    {
                       "start": moment($("#start_date").val()).format("X"),
                         "end": moment($("#end_date").val()).format("X"),
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
                      "legend": {"show": true, "container": legcont}
                    })
                  })
                })(g,c)
              } 
            }
          }
        }
      )
    }
  $document.ready(onDocumentReady);
})();
