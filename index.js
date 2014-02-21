index_main = function () {

// $.when($.ajax( "/page1.php" ), 
//        $.ajax( "/page2.php" ) ).done(
//           function( a1, a2 ) {
//             // a1 and a2 are arguments resolved for the page1 and page2 ajax requests, respectively.
//             // Each argument is an array with the following structure: [ data, statusText, jqXHR ]
//             var data = a1[ 0 ] + a2[ 0 ]; // a1[ 0 ] = "Whip", a2[ 0 ] = " It"
//             if ( /Whip It/.test( data ) ) {
//               alert( "We got what we came for!" );
//             }});

    var $document = $(document), onDocumentReady, onTreeListSuccess, populateBranches;

    onDocumentReady = function () {
        $.ajax({
            url: "/api/tree",
            dataType: "json",
            cache: true,
            async: false,
            method: 'GET',
        }).done(onTreeListSuccess);
    };

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    populateBranches = function (treediv,branchId,groupings){
      $.ajax({
            url: "/api/tree/branch?branch=" + branchId,
            dataType: "json",
            cache: true,
            async: false,
            method: 'GET',
      }).done(
        function(data, textStatus, jqXHR){
          var groups = {};
          var nodeName = data['displayName'];
          for (var l in data['leaves']) {
            var leaf = data['leaves'][l];
            var displayName = leaf['displayName'];
            var match = false;
            for (var g in groupings) {
              if (displayName.match(groupings[g]['regex'])){
                match = groupings[g]['name'];
                break;
              }
            };
            if (match != false){
                groups[match] = 1;
            } else {
                groups[displayName] = 1;
            };
          };
          if (Object.keys(groups).length > 0){
            $("#" + treediv).append( " [ " );
            for (var g in groups) {
              $("#" + treediv).append( " <a href=\"view_host.html?branch=" + branchId + "#" + g + "\"> " + g + "</a> " );
            }
            $("#" + treediv).append( " ] " );
          }

          for (var i in data['branches']) {
            var branch = data['branches'][i];
            var displayName = branch['displayName'];
            var childid = branch['branchId'];
            var childdiv = treediv + "_" + i;
            $("#" + treediv).append(
               "<ul><div class='container' id='" + childdiv + "'><span>" + "<a href=\"view_host.html?branch=" + childid + "\">" + displayName + "</a></span></div></ul>"   
            );
            populateBranches(childdiv,childid,groupings);
          }
        }
      );
    }

    onTreeListSuccess = function (data, textStatus, jqXHR) {
      $.getJSON(
       'groupings.json',
        function(groupings){
          var trees =  new Array();
          for (var i in data) {
            var tree = data[i];
            var treeid = tree['treeId'];
            var treediv = "treeview" + treeid;
            $('#hosttree').append(
              "<li> Tree: " + treeid + " <ul><li id='" + treediv +"'></li></ul></li>"   
            );
            populateBranches(
              treediv,
              pad(treeid,4),
              function(){
                 // Might need to sort these
                 for(var key in groupings) {
                   // Compile the regex
                   groupings[key]["regex"] = new RegExp(groupings[key]["regex"]);
                 }
                 return groupings;
              }()
            )
          }
        }
      )
    }


    $document.ready(onDocumentReady);

};
